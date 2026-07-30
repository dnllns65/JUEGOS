// Lógica principal - Controlador del Celular (Anfitrión)

window.onerror = function(message, source, lineno, colno, error) {
  console.error("ERROR DETECTADO:", message, "Línea:", lineno, "Archivo:", source);
  return true;
};

let activeCharacter = null;
const myClientId = 'host_' + Math.random().toString(36).substring(2, 9);
let gameMode = 'ai'; // 'ai' o 'manual'
let currentFilters = { region: 'random', area: 'random', nature: 'random', era: 'random' };
let questionCount = 0;
const MAX_QUESTIONS = 20;
let chatHistory = [];
let presentationConnection = null;
let askedQuestions = [];
let cluesRevealedCount = 0;

let roomCode = '';
let connectedPlayers = {};
let globalQuestionsEnabled = true;
let globalSocialEnabled = true;
let tvMusicEnabled = true;
let turnModeEnabled = false;
let currentPlayerTurnIndex = 0;
let activeHostChatTab = 'questions'; // 'questions' o 'social'
let activeLobbyChatTab = 'questions'; // 'questions' o 'social'

// Elementos del DOM
const btnCast = document.getElementById('btn-cast');
const roomCodeDisplay = document.getElementById('room-code-display');
const btnShareInvite = document.getElementById('btn-share-invite');
const btnSyncTv = document.getElementById('btn-sync-tv');
const toastNotification = document.getElementById('toast-notification');
const toastText = document.getElementById('toast-text');
const screens = {
  home: document.getElementById('screen-home'),
  setup: document.getElementById('screen-setup'),
  searching: document.getElementById('screen-searching'),
  gameplay: document.getElementById('screen-gameplay'),
  results: document.getElementById('screen-results')
};
const searchLogs = document.getElementById('search-logs');
const chatQuestionsContainer = document.getElementById('chat-questions-container');
const chatSocialContainer = document.getElementById('chat-social-container');
const inputQuestion = document.getElementById('input-question');
const btnAsk = document.getElementById('btn-ask');
const statQuestions = document.getElementById('stat-questions');
const statMode = document.getElementById('stat-mode');
const blurOverlay = document.getElementById('blur-overlay');
const charNameDisplay = document.getElementById('char-name-display');
const charDescDisplay = document.getElementById('char-desc-display');

// ==========================================================================
// 1. PRESENTATION API - TRANSMISIÓN A LA PANTALLA (CAST)
// ==========================================================================
let presentationRequest = null;


if (navigator.presentation) {
  // Configurar el archivo receptor con URL absoluta para Chrome Android Cast
  const receiverUrl = new URL('receiver.html', window.location.href).href;
  presentationRequest = new PresentationRequest([receiverUrl]);
  navigator.presentation.defaultRequest = presentationRequest;
  
  // Escuchar si hay pantallas disponibles
  presentationRequest.getAvailability()
    .then(availability => {
      btnCast.style.display = 'flex'; // Siempre visible como fallback
      availability.onchange = () => {
        btnCast.style.display = 'flex';
      };
    })
    .catch(err => {
      console.warn('Presentation API - Error al chequear disponibilidad:', err);
      btnCast.style.display = 'flex';
    });
} else {
  console.log('Presentation API no soportada por este navegador.');
  btnCast.style.display = 'flex'; // Siempre visible para móvil
}

// MODAL DE OPCIONES DE TRANSMISIÓN (CAST & MULTI-EQUIPO)
const castOptionsModal = document.getElementById('cast-options-modal');
const btnCloseCastModal = document.getElementById('btn-close-cast-modal');
const btnCancelCastModal = document.getElementById('btn-cancel-cast-modal');
const btnCastChromecast = document.getElementById('btn-cast-chromecast');
const btnCastQr = document.getElementById('btn-cast-qr');
const castQrContainer = document.getElementById('cast-qr-container');
const castTvUrlDisplay = document.getElementById('cast-tv-url-display');
const btnCopyTvUrl = document.getElementById('btn-copy-tv-url');
const btnOpenTvTab = document.getElementById('btn-open-tv-tab');

function closeCastModal() {
  if (castOptionsModal) castOptionsModal.style.display = 'none';
}

if (btnCloseCastModal) btnCloseCastModal.addEventListener('click', closeCastModal);
if (btnCancelCastModal) btnCancelCastModal.addEventListener('click', closeCastModal);

// Abrir Modal de Transmisión al hacer clic en el botón de Cast
btnCast.addEventListener('click', () => {
  if (castOptionsModal) {
    if (castTvUrlDisplay) castTvUrlDisplay.textContent = getSpectatorURL();
    if (castQrContainer) castQrContainer.style.display = 'none';
    castOptionsModal.style.display = 'flex';
  } else {
    triggerChromecastSearch();
  }
});

function triggerChromecastSearch() {
  // 1. Cerrar el modal custom para dejar la pantalla despejada
  closeCastModal();
  
  if (presentationConnection) {
    try {
      presentationConnection.terminate();
    } catch (e) {}
    presentationConnection = null;
  }

  if (window.PresentationRequest) {
    try {
      const receiverUrl = new URL('receiver.html', window.location.href).href;
      const freshRequest = new PresentationRequest([receiverUrl]);
      freshRequest.start()
        .then(connection => {
          setupPresentationConnection(connection);
        })
        .catch(err => {
          console.log('Diálogo nativo de Cast cerrado:', err);
          // Sin cartel de cancelación
        });
    } catch (err) {
      console.warn('Presentation API error:', err);
    }
  } else {
    window.open(getSpectatorURL(), '_blank');
  }
}

if (btnCastChromecast) {
  btnCastChromecast.addEventListener('click', triggerChromecastSearch);
}

if (btnCastQr) {
  btnCastQr.addEventListener('click', () => {
    if (castQrContainer) {
      const isVisible = castQrContainer.style.display === 'block';
      const newDisplay = isVisible ? 'none' : 'block';
      castQrContainer.style.display = newDisplay;
      if (newDisplay === 'block') {
        const tvUrl = getSpectatorURL();
        const qrImg = document.getElementById('cast-qr-img');
        if (qrImg) {
          qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(tvUrl)}`;
          qrImg.style.display = 'block';
        }
      }
    }
  });
}

if (btnCopyTvUrl) {
  btnCopyTvUrl.addEventListener('click', () => {
    copyToClipboard(getSpectatorURL());
    closeCastModal();
  });
}

if (btnOpenTvTab) {
  btnOpenTvTab.addEventListener('click', () => {
    window.open(getSpectatorURL(), '_blank');
    closeCastModal();
  });
}

function setupPresentationConnection(connection) {
  presentationConnection = connection;
  btnCast.classList.add('connected');
  btnCast.innerHTML = `<i class="fa-solid fa-tv"></i> Transmitiendo`;
  
  // Enviar estado actual de inmediato
  syncWithTV();
  
  connection.onclose = () => {
    handleCastDisconnect();
  };
  connection.onterminate = () => {
    handleCastDisconnect();
  };
}

function handleCastDisconnect() {
  presentationConnection = null;
  btnCast.classList.remove('connected');
  btnCast.innerHTML = `<i class="fa-solid fa-tv"></i> Transmitir`;
}

// Enviar comandos al Smart TV
function sendToTV(action, data = {}) {
  const payloadStr = JSON.stringify({ action, data, senderId: myClientId });

  // 1. Enviar por Presentation API si está activa la conexión
  if (presentationConnection && presentationConnection.state === 'connected') {
    presentationConnection.send(payloadStr);
  }

  // 2. Enviar por LocalStorage para permitir pruebas locales de sincronización en pestañas separadas
  localStorage.setItem('adivinador_tv_sync', JSON.stringify({
    action,
    data,
    timestamp: Date.now()
  }));

  // 3. Enviar por Internet usando ntfy.sh (Modo Remoto)
  if (roomCode) {
    fetch(`https://ntfy.sh/adivina_ai_sala_${roomCode}`, {
      method: 'POST',
      body: payloadStr
    }).catch(err => console.log('Error enviando sincronización remota:', err));
  }
}

function sendBulkToTV(actions) {
  sendToTV('bulk-sync', { actions });
}

// Sincronizar el estado actual completo con la TV
function syncWithTV() {
  const currentScreenId = Object.keys(screens).find(key => screens[key].classList.contains('active'));
  const actions = [];
  
  if (currentScreenId === 'home' || currentScreenId === 'setup') {
    actions.push({ action: 'show-view', data: { view: 'welcome' } });
  } else if (currentScreenId === 'searching') {
    actions.push({ action: 'show-view', data: { view: 'searching' } });
  } else if (currentScreenId === 'gameplay') {
    actions.push({ action: 'show-view', data: { view: 'gameplay' } });
    actions.push({ action: 'update-stats', data: {
        questionCount,
        maxQuestions: MAX_QUESTIONS,
        mode: gameMode.toUpperCase(),
        filters: getReadableFilters()
      }
    });
    actions.push({ action: 'sync-chat', data: { history: chatHistory } });
  } else if (currentScreenId === 'results') {
    actions.push({ action: 'show-view', data: { view: 'results' } });
    actions.push({ action: 'reveal-character', data: {
        victory: document.getElementById('result-title').textContent.includes('Victoria'),
        name: activeCharacter.name,
        description: activeCharacter.description
      }
    });
    actions.push({ action: 'sync-chat', data: { history: chatHistory } });
  }
  
  // Agregar música
  actions.push({ action: 'music-control', data: { tvMusicEnabled } });

  // Enviar todo en un solo paquete consolidado
  sendBulkToTV(actions);
}

function getReadableFilters() {
  const labels = {
    region: { latam: 'Latinoamérica', usa: 'Norteamérica', europa: 'Europa', asia_africa: 'Asia/África', random: 'Aleatorio' },
    area: { sports: 'Deportes', music: 'Música/Cine', science: 'Ciencia/Tech', history: 'Historia/Pol.', fiction: 'Ficción', random: 'Aleatorio' },
    nature: { real: 'Real', fictional: 'Ficticio', random: 'Aleatorio' },
    era: { current: 'Actual', historical: 'Histórico', random: 'Aleatorio' }
  };
  return [
    `Región: ${labels.region[currentFilters.region]}`,
    `Área: ${labels.area[currentFilters.area]}`,
    `Naturaleza: ${labels.nature[currentFilters.nature]}`,
    `Época: ${labels.era[currentFilters.era]}`
  ];
}


// ==========================================================================
// 2. NAVEGACIÓN Y CONFIGURACIÓN DE FILTROS
// ==========================================================================
function changeScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
  
  const lobbyChatBox = document.getElementById('lobby-chat-box');
  if (lobbyChatBox) {
    if (screenName === 'gameplay' || screenName === 'results') {
      lobbyChatBox.style.display = 'none';
    } else {
      lobbyChatBox.style.display = 'flex';
    }
  }
  
  syncWithTV();
}

// Iniciar configuración de partida
document.getElementById('btn-start-setup').addEventListener('click', () => {
  changeScreen('setup');
});

// Manejar botones de filtros
document.querySelectorAll('.filter-options button').forEach(button => {
  button.addEventListener('click', (e) => {
    const parent = button.parentElement;
    
    // Si es del grupo de modo de juego, tiene id especial
    if (parent.id === 'host-mode-options') {
      parent.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      gameMode = button.dataset.mode;
      
      const humanHostContainer = document.getElementById('human-host-container');
      if (humanHostContainer) {
        humanHostContainer.style.display = gameMode === 'manual' ? 'flex' : 'none';
      }
      return;
    }
    
    // Filtros estándar
    const filterName = parent.dataset.filter;
    parent.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    currentFilters[filterName] = button.dataset.value;
  });
});


// Función para consultar información de personajes en Internet (Wikipedia REST API)
async function searchInternetCharacter(charName) {
  try {
    const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(charName)}&format=json&origin=*`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    const results = data.query && data.query.search;
    
    if (!results || results.length === 0) {
      return null;
    }
    
    const wikiTitle = results[0].title;
    const summaryUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    const sumRes = await fetch(summaryUrl);
    const sumData = await sumRes.json();
    
    if (sumData && sumData.extract) {
      const desc = sumData.extract;
      const textLower = (wikiTitle + ' ' + desc).toLowerCase();
      
      const inferredFilters = {
        region: currentFilters.region !== 'random' ? currentFilters.region : 'latam',
        area: currentFilters.area !== 'random' ? currentFilters.area : 'sports',
        nature: 'real',
        era: 'current'
      };
      
      if (textLower.includes('futbolista') || textLower.includes('deporte') || textLower.includes('baloncesto') || textLower.includes('tenista') || textLower.includes('jugador')) {
        inferredFilters.area = 'sports';
      } else if (textLower.includes('cantante') || textLower.includes('actor') || textLower.includes('actriz') || textLower.includes('música') || textLower.includes('cine')) {
        inferredFilters.area = 'music';
      } else if (textLower.includes('ficticio') || textLower.includes('anime') || textLower.includes('manga') || textLower.includes('cómic') || textLower.includes('serie')) {
        inferredFilters.nature = 'fictional';
        inferredFilters.area = 'fiction';
      } else if (textLower.includes('político') || textLower.includes('presidente') || textLower.includes('historia')) {
        inferredFilters.area = 'history';
      }
      
      if (textLower.includes('españa') || textLower.includes('francia') || textLower.includes('italia') || textLower.includes('alemania') || textLower.includes('europa')) {
        inferredFilters.region = 'europa';
      } else if (textLower.includes('argentin') || textLower.includes('brasil') || textLower.includes('chile') || textLower.includes('méxico') || textLower.includes('colombia')) {
        inferredFilters.region = 'latam';
      }

      return {
        name: wikiTitle,
        description: desc,
        synonyms: [charName, wikiTitle],
        filters: inferredFilters
      };
    }
  } catch (err) {
    console.error('Error buscando información en Internet (Wikipedia):', err);
  }
  return null;
}


// ==========================================================================
// 3. SIMULACIÓN DE BÚSQUEDA Y SELECCIÓN DE PERSONAJE
// ==========================================================================
document.getElementById('btn-run-search').addEventListener('click', async () => {
  const humanCharNameInput = document.getElementById('human-character-name');
  const humanManualDetails = document.getElementById('human-manual-details');
  const humanCharDescInput = document.getElementById('human-character-desc');
  
  if (gameMode === 'manual') {
    const charName = humanCharNameInput ? humanCharNameInput.value.trim() : '';
    if (!charName) {
      showToast('Por favor ingresa el nombre del personaje.');
      if (humanCharNameInput) humanCharNameInput.focus();
      return;
    }
    
    // 1. Buscar en la base de datos local
    let found = CHARACTERS.find(c => 
      c.name.toLowerCase() === charName.toLowerCase() || 
      c.name.toLowerCase().includes(charName.toLowerCase())
    );
    
    // 2. Si no está en la base local, buscar en Internet (Wikipedia API)
    if (!found) {
      showToast('Buscando información en Internet (Wikipedia)...');
      found = await searchInternetCharacter(charName);
    }
    
    if (found) {
      if (humanManualDetails) humanManualDetails.style.display = 'none';
      activeCharacter = {
        name: found.name,
        description: found.description,
        synonyms: found.synonyms || [charName, found.name],
        filters: found.filters || currentFilters
      };
      showToast(`¡Datos de '${found.name}' obtenidos con éxito de Internet!`);
    } else {
      // 3. Si tampoco se encuentra en Internet
      const manualDesc = humanCharDescInput ? humanCharDescInput.value.trim() : '';
      if (!manualDesc) {
        if (humanManualDetails) humanManualDetails.style.display = 'flex';
        showToast('Datos no encontrados de este personaje; ingrese manual los datos');
        if (humanCharDescInput) humanCharDescInput.focus();
        return;
      }
      
      // Si el humano completó la descripción manual
      activeCharacter = {
        name: charName,
        description: manualDesc,
        synonyms: [charName],
        filters: currentFilters
      };
    }
  }

  changeScreen('searching');
  
  // Limpiar logs
  searchLogs.innerHTML = '';
  
  const searchTargetName = (gameMode === 'manual' && activeCharacter) ? activeCharacter.name : 'Personaje Misterioso';
  const logs = [
    `Inicializando rastreador de datos para: ${searchTargetName}...`,
    "Crawleando Wikipedia, Wikidata y bases de datos públicas...",
    `Filtrando por parámetros: Región [${currentFilters.region}], Profesión [${currentFilters.area}]...`,
    "Analizando popularidad y volumen de búsquedas...",
    "Cruzando referencias históricas y ficticias...",
    "¡Datos procesados y personaje cargado con éxito!"
  ];
  
  let currentLogIdx = 0;
  
  // Agregar logs dinámicos
  const interval = setInterval(() => {
    if (currentLogIdx < logs.length) {
      const p = document.createElement('div');
      p.className = 'search-log-line';
      p.textContent = `> ${logs[currentLogIdx]}`;
      searchLogs.appendChild(p);
      searchLogs.scrollTop = searchLogs.scrollHeight;
      
      // Enviar log a la TV
      sendToTV('search-log', { text: `> ${logs[currentLogIdx]}` });
      
      currentLogIdx++;
    } else {
      clearInterval(interval);
      // Seleccionar personaje aleatorio sólo en modo IA
      if (gameMode === 'ai' || !activeCharacter) {
        selectCharacter();
      }
      setTimeout(() => {
        startGame();
      }, 1000);
    }
  }, 500);
});

function selectCharacter() {
  const candidates = CHARACTERS.filter(char => {
    const isDead = char.deathYear !== null && char.deathYear !== undefined;
    
    // Regla estricta 1: Si el filtro es Actualidad, NUNCA seleccionar un personaje muerto!
    if (currentFilters.era === 'current' && isDead) {
      return false;
    }
    // Regla estricta 2: Si el filtro es Histórico, NUNCA seleccionar un personaje vivo de la actualidad!
    if (currentFilters.era === 'historical' && !isDead && char.filters.era === 'current') {
      return false;
    }

    const regionMatch = currentFilters.region === 'random' || char.filters.region === currentFilters.region;
    const areaMatch = currentFilters.area === 'random' || char.filters.area === currentFilters.area;
    const natureMatch = currentFilters.nature === 'random' || char.filters.nature === currentFilters.nature;
    const eraMatch = currentFilters.era === 'random' || char.filters.era === currentFilters.era;
    
    return regionMatch && areaMatch && natureMatch && eraMatch;
  });

  console.log('Candidatos que coinciden exactamente con los filtros:', candidates);

  if (candidates.length > 0) {
    activeCharacter = candidates[Math.floor(Math.random() * candidates.length)];
  } else {
    // Fallback inteligente: Respetar estrictamente Región, Época y Exclusión de Muertos en Actualidad
    console.warn('Filtro combinado estricto sin candidatos. Aplicando fallback inteligente...');
    const smartFallback = CHARACTERS.filter(char => {
      const isDead = char.deathYear !== null && char.deathYear !== undefined;
      if (currentFilters.era === 'current' && isDead) return false;
      if (currentFilters.region !== 'random' && char.filters.region !== currentFilters.region) return false;
      if (currentFilters.nature !== 'random' && char.filters.nature !== currentFilters.nature) return false;
      return true;
    });

    if (smartFallback.length > 0) {
      activeCharacter = smartFallback[Math.floor(Math.random() * smartFallback.length)];
    } else {
      // Fallback de seguridad respetando vivo/muerto según la época elegida
      const eraFallback = CHARACTERS.filter(char => {
        const isDead = char.deathYear !== null && char.deathYear !== undefined;
        if (currentFilters.era === 'current' && isDead) return false;
        return true;
      });
      activeCharacter = eraFallback.length > 0 
        ? eraFallback[Math.floor(Math.random() * eraFallback.length)]
        : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    }
  }
}


// ==========================================================================
// 4. FLUJO DE JUEGO (GAMEPLAY)
// ==========================================================================
function startGame() {
  questionCount = 0;
  cluesRevealedCount = 0;
  askedQuestions = [];
  chatHistory = [];
  
  // Resetear DOM
  if (chatQuestionsContainer) chatQuestionsContainer.innerHTML = '';
  if (chatSocialContainer) chatSocialContainer.innerHTML = '';
  statQuestions.textContent = `0 / ${MAX_QUESTIONS}`;
  // Plegar panel de control de sala para dejar pantalla limpia durante el juego
  const btnToggleRoomControl = document.getElementById('btn-toggle-room-control');
  const roomControlPanel = document.getElementById('room-control-panel');
  if (btnToggleRoomControl) btnToggleRoomControl.style.display = 'flex';
  if (roomControlPanel) roomControlPanel.style.display = 'none';

  // Configurar display de identidad
  charNameDisplay.textContent = activeCharacter.name;
  charDescDisplay.textContent = activeCharacter.description;
  
  // Por defecto la respuesta está oculta bajo un blur
  blurOverlay.style.display = 'flex';
  
  // Ajustar paneles de controles para Gameplay
  const controlsAI = document.getElementById('controls-ai');
  const controlsManual = document.getElementById('controls-manual');
  
  if (controlsAI) controlsAI.style.display = 'flex';
  if (controlsManual) controlsManual.style.display = gameMode === 'manual' ? 'flex' : 'none';
  
  changeScreen('gameplay');
  
  // Enviar evento de inicio a la TV
  sendToTV('start-game', {
    maxQuestions: MAX_QUESTIONS,
    mode: gameMode.toUpperCase(),
    filters: getReadableFilters()
  });

  // Enviar estado de música inicial
  sendMusicStateToTV();
}

// Ocultar/Mostrar identidad
blurOverlay.addEventListener('click', () => {
  blurOverlay.style.display = 'none';
});

// Registrar un mensaje en el historial local y sincronizar con la TV
function addChatMessage(sender, text, type = '', channel = 'questions') {
  chatHistory.push({ sender, text, type, channel });
  
  // Si es una pregunta oficial del jugador (sender === 'player'), buscar si ya existe en la caja de chat una burbuja del invitado con ese texto para actualizarla sin duplicar
  if (sender === 'player' && chatQuestionsContainer && channel === 'questions') {
    const existingBubbles = chatQuestionsContainer.querySelectorAll('.chat-bubble');
    for (let b of existingBubbles) {
      if (b.textContent.includes(text)) {
        b.className = `chat-bubble player ${type}`;
        const meta = b.querySelector('.chat-meta');
        if (meta) {
          meta.textContent = `Pregunta #${questionCount}:`;
        }
        chatQuestionsContainer.scrollTop = chatQuestionsContainer.scrollHeight;
        sendToTV('add-chat-bubble', { sender, text, type, questionCount, channel });
        return;
      }
    }
  }

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender} ${type}`;
  
  const meta = document.createElement('span');
  meta.className = 'chat-meta';
  
  if (sender === 'player') {
    meta.textContent = `Pregunta #${questionCount}:`;
  } else {
    meta.textContent = `Anfitrión:`;
  }
  
  const content = document.createElement('span');
  content.textContent = text;
  
  bubble.appendChild(meta);
  bubble.appendChild(content);
  
  const targetContainer = channel === 'social' ? chatSocialContainer : chatQuestionsContainer;
  if (targetContainer) {
    targetContainer.appendChild(bubble);
    targetContainer.scrollTop = targetContainer.scrollHeight;
  }
  
  // Sincronizar chat e historial con la TV
  sendToTV('add-chat-bubble', { sender, text, type, questionCount, channel });
}


// ==========================================================================
// 5. MOTOR DE INTELIGENCIA ARTIFICIAL LOCAL (MODO IA)
// ==========================================================================
btnAsk.addEventListener('click', () => {
  processAIQuestion();
});

inputQuestion.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    processAIQuestion();
  }
});

function processAIQuestion() {
  const text = inputQuestion.value.trim();
  if (!text) return;
  
  const normQuestion = phonetize(text);
  inputQuestion.value = '';
  
  // 1. Verificar si la pregunta ya se hizo
  if (askedQuestions.includes(normQuestion)) {
    addChatMessage('player', text);
    setTimeout(() => {
      addChatMessage('host', "Esa pregunta ya la hicieron y ya fue contestada. ¡Intenta hacer una nueva!", 'maybe');
    }, 600);
    return;
  }
  
  // Registrar la pregunta en el historial de preguntas únicas
  askedQuestions.push(normQuestion);
  
  // Agregar pregunta del jugador
  addChatMessage('player', text);
  
  // 2. Procesar respuesta localmente
  setTimeout(() => {
    const answer = evaluateQuestionSemantics(text);
    addChatMessage('host', answer.text, answer.type);
    
    // Si la pregunta es "Cambia de pregunta" ('maybe'), no se cuenta y se libera del historial
    if (answer.type === 'yes' || answer.type === 'no') {
      questionCount++;
      statQuestions.textContent = `${questionCount} / ${MAX_QUESTIONS}`;
      sendToTV('update-questions-count', { count: questionCount });
    } else if (answer.type === 'maybe') {
      const idx = askedQuestions.indexOf(normQuestion);
      if (idx !== -1) askedQuestions.splice(idx, 1);
    }
    
    // Verificar si alcanzó el límite de preguntas
    checkGameOver();
  }, 800);
}

// Limpia texto (acentos, signos, minúsculas)
function cleanText(t) {
  return t.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,]/g, "")
    .trim();
}

// Normalización fonética para tolerancia ortográfica
function phonetize(text) {
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos y tildes
    .replace(/h/g, "")              // Quitar H
    .replace(/c/g, "s")             // C -> S
    .replace(/z/g, "s")             // Z -> S
    .replace(/v/g, "b")             // V -> B
    .replace(/y/g, "i")             // Y -> I
    .replace(/ll/g, "i")            // LL -> I
    .replace(/[¿?¡!.,;\-_]/g, "")   // Quitar signos
    .replace(/(.)\1+/g, "$1")       // Colapsar letras dobles a una sola (ej: messi -> mesi)
    .replace(/\s+/g, " ")           // Colapsar espacios
    .trim();
}

// Validador de palabras clave con tolerancia fonética
function containsKeyword(question, keyword) {
  const normQ = phonetize(question);
  const normK = phonetize(keyword);
  
  const escapedK = normK.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp('\\b' + escapedK + '\\b');
  return regex.test(normQ);
}

// Calcular la edad actual o al fallecer
function getCharacterAge(char) {
  if (char.birthYear === undefined || char.birthYear === null) return null;
  const endYear = char.deathYear ? char.deathYear : 2026; // Año actual del sistema
  return endYear - char.birthYear;
}

function evaluateQuestionSemantics(question) {
  const q = cleanText(question);
  
  // Verificar si intentan preguntar directamente el nombre en el chat
  for (let synonym of activeCharacter.synonyms) {
    if (phonetize(question).includes(phonetize(synonym))) {
      return {
        text: "Si crees saber quién es, usa el botón 'Arriesgar Nombre' para comprobar tu respuesta y ganar la partida. ¡No te responderé el nombre en una pregunta de sí o no!",
        type: 'maybe'
      };
    }
  }
  
  // --- LÓGICA DE EDAD / AÑO DE NACIMIENTO / MUERTE ---
  const numberMatch = question.match(/\d+/);
  if (numberMatch) {
    const targetNumber = parseInt(numberMatch[0]);
    const charAge = getCharacterAge(activeCharacter);
    
    // Identificar tipo de pregunta
    const isAgeQuestion = containsKeyword(question, "edad") || 
                          containsKeyword(question, "años") || 
                          containsKeyword(question, "anos") ||
                          containsKeyword(question, "mayor") ||
                          containsKeyword(question, "menor") ||
                          containsKeyword(question, "mas de") ||
                          containsKeyword(question, "menos de") ||
                          containsKeyword(question, "tiene");
                          
    const isBirthYearQuestion = containsKeyword(question, "nacio") || 
                                containsKeyword(question, "nacimiento");
                                
    const isDeathYearQuestion = containsKeyword(question, "murio") || 
                                containsKeyword(question, "fallecio") ||
                                containsKeyword(question, "muerte");
    
    if (isAgeQuestion && charAge !== null) {
      const isGreater = containsKeyword(question, "mayor") || 
                        containsKeyword(question, "mas") || 
                        containsKeyword(question, "supera") || 
                        containsKeyword(question, "mas de");
                        
      const isLess = containsKeyword(question, "menor") || 
                     containsKeyword(question, "menos") || 
                     containsKeyword(question, "menos de");
                     
      if (isGreater) {
        return charAge > targetNumber ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
      } else if (isLess) {
        return charAge < targetNumber ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
      } else {
        return charAge === targetNumber ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
      }
    }
    
    if (isBirthYearQuestion && activeCharacter.birthYear !== undefined) {
      const isAfter = containsKeyword(question, "despues") || containsKeyword(question, "posterior");
      const isBefore = containsKeyword(question, "antes") || containsKeyword(question, "anterior");
      
      if (isAfter) {
        return activeCharacter.birthYear > targetNumber ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
      } else if (isBefore) {
        return activeCharacter.birthYear < targetNumber ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
      } else {
        return activeCharacter.birthYear === targetNumber ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
      }
    }
    
    if (isDeathYearQuestion && activeCharacter.deathYear) {
      const isAfter = containsKeyword(question, "despues") || containsKeyword(question, "posterior");
      const isBefore = containsKeyword(question, "antes") || containsKeyword(question, "anterior");
      
      if (isAfter) {
        return activeCharacter.deathYear > targetNumber ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
      } else if (isBefore) {
        return activeCharacter.deathYear < targetNumber ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
      } else {
        return activeCharacter.deathYear === targetNumber ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
      }
    }
  }

  // --- REGLAS SEMÁNTICAS ESTÁNDAR (19 PREGUNTAS Y ATRIBUTOS) ---
  const attrs = activeCharacter.attributes || {};
  const bYear = activeCharacter.birthYear;

  // 1. REALIDAD VS FICCIÓN (Estricta Exclusión Mutua)
  const isRealChar = attrs.real === true || (activeCharacter.filters && activeCharacter.filters.nature === 'real') || (attrs.ficticio === false);
  const isFictionalChar = !isRealChar;

  if (containsKeyword(question, "ficticio") || containsKeyword(question, "ficcion") || containsKeyword(question, "fantasia") || containsKeyword(question, "inventado") || containsKeyword(question, "creado") || containsKeyword(question, "personaje de ficcion")) {
    return isFictionalChar ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "real") || containsKeyword(question, "existio") || containsKeyword(question, "existe") || containsKeyword(question, "vida real") || containsKeyword(question, "carne y hueso")) {
    return isRealChar ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // --- EVALUACIÓN DE SIGLOS Y ÉPOCAS HISTÓRICAS ---

  // Siglo XIX (Años 1801 a 1900)
  if (containsKeyword(question, "siglo xix") || containsKeyword(question, "siglo 19") || containsKeyword(question, "siglo diecinueve") || containsKeyword(question, "años 1800") || containsKeyword(question, "del 1800")) {
    const isSigloXIX = attrs.siglo_xix === true || (bYear !== null && bYear !== undefined && bYear >= 1801 && bYear <= 1900);
    return isSigloXIX ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // Siglo XX (Años 1901 a 2000)
  if (containsKeyword(question, "siglo xx") || containsKeyword(question, "siglo 20") || containsKeyword(question, "siglo veinte") || containsKeyword(question, "años 1900") || containsKeyword(question, "del 1900")) {
    const isSigloXX = attrs.siglo_xx === true || (bYear !== null && bYear !== undefined && bYear >= 1901 && bYear <= 2000);
    return isSigloXX ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // Siglo XXI (Años 2001 al presente)
  if (containsKeyword(question, "siglo xxi") || containsKeyword(question, "siglo 21") || containsKeyword(question, "siglo veintiuno") || containsKeyword(question, "años 2000") || containsKeyword(question, "del 2000")) {
    const isSigloXXI = attrs.siglo_xxi === true || (bYear !== null && bYear !== undefined && bYear >= 2001) || (activeCharacter.filters && activeCharacter.filters.era === 'current');
    return isSigloXXI ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // Contexto Histórico Anterior a 1900 / Antigüedad
  if (containsKeyword(question, "anterior a 1900") || containsKeyword(question, "antes de 1900") || containsKeyword(question, "anterior al año 1900") || containsKeyword(question, "antiguedad") || containsKeyword(question, "epoca antigua") || containsKeyword(question, "antiguo")) {
    const isBefore1900 = (bYear !== null && bYear !== undefined && bYear < 1900) || (activeCharacter.filters && activeCharacter.filters.era === 'historical') || attrs.anterior_1900 === true;
    return isBefore1900 ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 17. ¿La primera letra de su nombre/apodo común está entre la A y la M en el abecedario?
  if ((containsKeyword(question, "letra") || containsKeyword(question, "abecedario") || containsKeyword(question, "alfabeto")) && (containsKeyword(question, "a y m") || containsKeyword(question, "a y la m") || containsKeyword(question, "entre la a") || containsKeyword(question, "primera letra"))) {
    const firstChar = activeCharacter.name.trim().charAt(0).toUpperCase();
    const isBetweenAandM = firstChar >= 'A' && firstChar <= 'M';
    return isBetweenAandM ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 18. ¿Su nombre tiene más de dos palabras? (Ej: "Harry Potter", "El Guasón")
  if (containsKeyword(question, "dos palabras") || containsKeyword(question, "mas de dos palabras") || containsKeyword(question, "tres palabras") || containsKeyword(question, "varias palabras")) {
    const wordCount = activeCharacter.name.trim().split(/\s+/).length;
    const hasMultiWords = wordCount >= 2;
    return hasMultiWords ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // ESTADO VITAL Y ACTUALIDAD (Si es real: o está vivo o está muerto. Si está muerto, NO es actual).
  const isDeadChar = attrs.muerto === true || (activeCharacter.deathYear !== null && activeCharacter.deathYear !== undefined);
  const isAliveChar = isRealChar ? !isDeadChar : (attrs.vivo === true || attrs.activo === true || activeCharacter.deathYear === null);

  if (containsKeyword(question, "actual") || containsKeyword(question, "actualidad") || containsKeyword(question, "de la actualidad") || containsKeyword(question, "hoy en dia")) {
    if (isDeadChar) {
      return { text: "NO", type: 'no' }; // Si está muerto, NUNCA es actual
    }
    const isCurrent = (activeCharacter.filters && activeCharacter.filters.era === 'current') || attrs.siglo_xxi === true || isAliveChar;
    return isCurrent ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  if (containsKeyword(question, "vivo") || containsKeyword(question, "viva") || containsKeyword(question, "sigue vivo") || containsKeyword(question, "esta vivo") || containsKeyword(question, "con vida")) {
    return isAliveChar ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  if (containsKeyword(question, "fallecido") || containsKeyword(question, "muerto") || containsKeyword(question, "murio") || containsKeyword(question, "esta muerto") || containsKeyword(question, "ya fallecio")) {
    return isDeadChar ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 3. Género Femenino / Masculino
  if (containsKeyword(question, "femenino") || containsKeyword(question, "mujer") || containsKeyword(question, "femenina") || containsKeyword(question, "chica") || containsKeyword(question, "dama") || containsKeyword(question, "hombre") || containsKeyword(question, "masculino") || containsKeyword(question, "varon")) {
    const isFemale = attrs.mujer === true || attrs.femenino === true;
    if (containsKeyword(question, "hombre") || containsKeyword(question, "masculino") || containsKeyword(question, "varon")) {
      return !isFemale ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
    }
    return isFemale ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 4. ¿Es un ser humano?
  if (containsKeyword(question, "humano") || containsKeyword(question, "persona") || containsKeyword(question, "ser humano") || containsKeyword(question, "animal") || containsKeyword(question, "alien") || containsKeyword(question, "criatura") || containsKeyword(question, "robot")) {
    const isHuman = attrs.humano !== false && !attrs.animal && !attrs.alien && !attrs.robot && !attrs.criatura;
    if (containsKeyword(question, "animal") || containsKeyword(question, "alien") || containsKeyword(question, "criatura") || containsKeyword(question, "robot")) {
      return !isHuman ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
    }
    return isHuman ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 5. ¿Es de origen o creación estadounidense?
  if (containsKeyword(question, "estadounidense") || containsKeyword(question, "norteamericano") || containsKeyword(question, "estados unidos") || containsKeyword(question, "eeuu") || containsKeyword(question, "usa") || containsKeyword(question, "gringo")) {
    const isUS = activeCharacter.country === "Estados Unidos" || (activeCharacter.filters && activeCharacter.filters.region === "usa") || attrs.estadounidense === true || attrs.usa === true;
    return isUS ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 6a. ¿Es deportista / atleta / se dedica al deporte?
  if (containsKeyword(question, "deportista") || containsKeyword(question, "atleta") || containsKeyword(question, "futbolista") || containsKeyword(question, "baloncesto") || containsKeyword(question, "tenista") || containsKeyword(question, "deporte")) {
    const area = activeCharacter.filters ? activeCharacter.filters.area : '';
    const isSports = area === 'sports' || attrs.deportista === true || attrs.futbolista === true || attrs.atleta === true;
    return isSports ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 6b. ¿Se le conoce principalmente por entretenimiento, arte o espectáculo?
  if (containsKeyword(question, "entretenimiento") || containsKeyword(question, "arte") || containsKeyword(question, "espectaculo") || containsKeyword(question, "artista") || containsKeyword(question, "actor") || containsKeyword(question, "actriz")) {
    const area = activeCharacter.filters ? activeCharacter.filters.area : '';
    const isEntertainment = area === 'music' || area === 'fiction' || attrs.artista || attrs.actor || attrs.actriz || attrs.cantante || attrs.musico || attrs.entretenimiento || attrs.caricaturista;
    return isEntertainment ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 7. ¿Es el/la protagonista de su obra o historia?
  if (containsKeyword(question, "protagonista") || containsKeyword(question, "personaje principal") || containsKeyword(question, "figura principal") || containsKeyword(question, "prota")) {
    const isProtagonist = attrs.protagonista !== false && attrs.villano !== true && attrs.antagonista !== true;
    return isProtagonist ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 8. ¿Es un villano, antagonista o figura antagónica?
  if (containsKeyword(question, "villano") || containsKeyword(question, "antagonista") || containsKeyword(question, "malo") || containsKeyword(question, "enemigo") || containsKeyword(question, "malvado")) {
    const isVillain = attrs.villano === true || attrs.antagonista === true || attrs.malo === true;
    return isVillain ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 10. ¿Está dirigido principalmente a un público infantil?
  if (containsKeyword(question, "infantil") || containsKeyword(question, "ninos") || containsKeyword(question, "ninas") || containsKeyword(question, "niños") || containsKeyword(question, "niñas") || containsKeyword(question, "público infantil") || containsKeyword(question, "caricatura") || containsKeyword(question, "dibujo animado")) {
    const isKids = attrs.infantil === true || attrs.dibujo === true || attrs.animado === true;
    return isKids ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 11. ¿Proviene originalmente del cine o la televisión?
  if (containsKeyword(question, "cine") || containsKeyword(question, "television") || containsKeyword(question, "tv") || containsKeyword(question, "pelicula") || containsKeyword(question, "serie") || containsKeyword(question, "pantalla grande")) {
    const isCinemaTV = attrs.cine_tv === true || attrs.origen_cine === true || attrs.origen_tv === true || attrs.actor === true || attrs.actriz === true;
    return isCinemaTV ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 12. ¿Tiene superpoderes, magia o habilidades sobrehumanas?
  if (containsKeyword(question, "superpoderes") || containsKeyword(question, "poderes") || containsKeyword(question, "magia") || containsKeyword(question, "sobrehumano") || containsKeyword(question, "sobrenatural") || containsKeyword(question, "habilidades sobrehumanas")) {
    const hasPowers = attrs.superpoderes === true || attrs.magia === true || attrs.mago === true || attrs.superheroe === true || attrs.sobrehumano === true;
    return hasPowers ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 13. ¿Lleva algún uniforme, traje especial, máscara o accesorio icónico?
  if (containsKeyword(question, "uniforme") || containsKeyword(question, "traje especial") || containsKeyword(question, "mascara") || containsKeyword(question, "casco") || containsKeyword(question, "accesorio") || containsKeyword(question, "disfraz") || containsKeyword(question, "capa")) {
    const hasIconicOutfit = attrs.uniforme === true || attrs.mascara === true || attrs.casco === true || attrs.traje_especial === true || attrs.capa === true || attrs.lentes === true || attrs.anteojos === true;
    return hasIconicOutfit ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 14. ¿Lleva armas o herramientas de combate de forma habitual?
  if (containsKeyword(question, "armas") || containsKeyword(question, "arma") || containsKeyword(question, "herramientas de combate") || containsKeyword(question, "espada") || containsKeyword(question, "pistola") || containsKeyword(question, "escudo") || containsKeyword(question, "combate")) {
    const hasWeapons = attrs.armas === true || attrs.espada === true || attrs.pistola === true || attrs.espada_laser === true || attrs.escudo === true;
    return hasWeapons ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 15. ¿Forma parte de un grupo, equipo o franquicia de más de 3 integrantes?
  if (containsKeyword(question, "grupo") || containsKeyword(question, "equipo") || containsKeyword(question, "franquicia") || containsKeyword(question, "mas de 3") || containsKeyword(question, "mas de tres") || containsKeyword(question, "integrantes") || containsKeyword(question, "vengadores") || containsKeyword(question, "banda")) {
    const isTeam = attrs.equipo === true || attrs.grupo === true || attrs.franquicia === true || attrs.banda === true;
    return isTeam ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // 16. ¿Tiene algún rasgo físico visible no humano?
  if (containsKeyword(question, "rasgo fisico no humano") || containsKeyword(question, "piel de otro color") || containsKeyword(question, "orejas puntiagudas") || containsKeyword(question, "pelo de color extravagante") || containsKeyword(question, "rasgo visible no humano") || containsKeyword(question, "rasgo no humano")) {
    const hasNonHumanTrait = attrs.rasgo_no_humano === true || attrs.piel_color === true || attrs.orejas_puntiagudas === true || attrs.pelo_extravagante === true;
    return hasNonHumanTrait ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // --- DETECCIÓN DINÁMICA DE PAÍSES Y GENTILICIOS ---
  let countryMatchDetected = false;
  let matchesActiveCharacter = false;

  const COMMON_COUNTRIES_LOOKUP = {
    "uruguay": ["uruguayo", "uruguaya"],
    "brasil": ["brasileño", "brasileña", "brasilero", "brasilera"],
    "mexico": ["mexicano", "mexicana"],
    "chile": ["chileno", "chilena"],
    "peru": ["peruano", "peruana"],
    "japon": ["japones", "japonesa"],
    "china": ["chino", "china"],
    "italia": ["italiano", "italiana"],
    "españa": ["español", "española", "gallego", "gallega"],
    "francia": ["frances", "francesa"],
    "rusia": ["ruso", "rusa"],
    "canada": ["canadiense"],
    "australia": ["australiano", "australiana"],
  };

  // 1. Escanear base de datos de personajes
  for (let char of CHARACTERS) {
    if (char.country && containsKeyword(question, char.country)) {
      countryMatchDetected = true;
      if (activeCharacter.country === char.country) {
        matchesActiveCharacter = true;
      }
    }
    if (char.demonyms) {
      for (let demonym of char.demonyms) {
        if (containsKeyword(question, demonym)) {
          countryMatchDetected = true;
          if (activeCharacter.demonyms && activeCharacter.demonyms.some(d => phonetize(d) === phonetize(demonym)) || activeCharacter.country === char.country) {
            matchesActiveCharacter = true;
          }
        }
      }
    }
  }

  // 2. Escanear diccionario común de países como fallback
  for (let country in COMMON_COUNTRIES_LOOKUP) {
    if (containsKeyword(question, country)) {
      countryMatchDetected = true;
      if (phonetize(activeCharacter.country) === phonetize(country)) {
        matchesActiveCharacter = true;
      }
    }
    for (let demonym of COMMON_COUNTRIES_LOOKUP[country]) {
      if (containsKeyword(question, demonym)) {
        countryMatchDetected = true;
        if (activeCharacter.demonyms && activeCharacter.demonyms.some(d => phonetize(d) === phonetize(demonym)) || phonetize(activeCharacter.country) === phonetize(country)) {
          matchesActiveCharacter = true;
        }
      }
    }
  }

  if (countryMatchDetected) {
    return matchesActiveCharacter ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }

  // Regiones generales (fallback)
  if (containsKeyword(question, "latino") || containsKeyword(question, "latinoamericano") || containsKeyword(question, "sudamericano") || containsKeyword(question, "america del sur")) {
    return attrs.latino || attrs.sudamericano ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "europeo") || containsKeyword(question, "europa")) {
    return attrs.europeo ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "asiatico") || containsKeyword(question, "asia")) {
    return attrs.asiatico ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  
  // Profesiones / Áreas
  if (containsKeyword(question, "deporte") || containsKeyword(question, "deportista") || containsKeyword(question, "atleta")) {
    return attrs.deportista ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "futbol") || containsKeyword(question, "futbolista") || containsKeyword(question, "juega al futbol")) {
    return attrs.futbolista ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "basquet") || containsKeyword(question, "baloncesto")) {
    return attrs.basquetbolista ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "tenis") || containsKeyword(question, "tenista")) {
    return attrs.tenista ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "musica") || containsKeyword(question, "cantante") || containsKeyword(question, "canta") || containsKeyword(question, "canciones") || containsKeyword(question, "musico")) {
    return attrs.cantante || attrs.musico ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "actor") || containsKeyword(question, "actriz") || containsKeyword(question, "actua") || containsKeyword(question, "peliculas") || containsKeyword(question, "cine")) {
    return attrs.actor || attrs.actriz ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "ciencia") || containsKeyword(question, "cientifico") || containsKeyword(question, "fisico") || containsKeyword(question, "quimico") || containsKeyword(question, "astronomo") || containsKeyword(question, "investigador")) {
    return attrs.cientifico || attrs.cientifica || attrs.fisico || attrs.quimico ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "inventor") || containsKeyword(question, "invento") || containsKeyword(question, "tecnologia") || containsKeyword(question, "empresario") || containsKeyword(question, "computadoras")) {
    return attrs.inventor || attrs.tecnologia || attrs.empresario ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "politico") || containsKeyword(question, "presidente") || containsKeyword(question, "gobernante") || containsKeyword(question, "rey") || containsKeyword(question, "reina") || containsKeyword(question, "emperador")) {
    return attrs.politico || attrs.presidente || attrs.gobernante || attrs.reina || attrs.emperador ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "militar") || containsKeyword(question, "soldado") || containsKeyword(question, "general") || containsKeyword(question, "independencia") || containsKeyword(question, "guerra")) {
    return attrs.militar || attrs.libertador || attrs.guerra_civil ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  
  // Elementos físicos / característicos específicos
  if (containsKeyword(question, "anteojos") || containsKeyword(question, "lentes") || containsKeyword(question, "gafas")) {
    return attrs.anteojos || attrs.lentes ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "barba") || containsKeyword(question, "barbudo") || containsKeyword(question, "bigote")) {
    return attrs.barba || attrs.barbudo || attrs.bigote ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "calvo") || containsKeyword(question, "pelado") || containsKeyword(question, "sin pelo")) {
    return attrs.calvo ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "rubio") || containsKeyword(question, "rubia")) {
    return attrs.rubia || attrs.rubio ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "capa") || containsKeyword(question, "mascara") || containsKeyword(question, "casco")) {
    return attrs.capa || attrs.mascara || attrs.casco ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "rico") || containsKeyword(question, "millonario") || containsKeyword(question, "dinero")) {
    return attrs.rico || attrs.millonario ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "magia") || containsKeyword(question, "mago") || containsKeyword(question, "hechicero")) {
    return attrs.mago || attrs.magia ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "superheroe") || containsKeyword(question, "poderes") || containsKeyword(question, "heroe")) {
    return attrs.superheroe ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "caballo") || containsKeyword(question, "cabalga")) {
    return attrs.caballo ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "nobel") || containsKeyword(question, "premio nobel")) {
    return attrs.nobel ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "dibujo") || containsKeyword(question, "animado") || containsKeyword(question, "caricatura")) {
    return attrs.dibujo || attrs.animado ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "casado") || containsKeyword(question, "esposa") || containsKeyword(question, "esposo") || containsKeyword(question, "pareja")) {
    return attrs.casado ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "hijo") || containsKeyword(question, "hijos")) {
    return attrs.hijos ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "alto") || containsKeyword(question, "alta")) {
    return attrs.alto ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "bajo") || containsKeyword(question, "baja") || containsKeyword(question, "petiso")) {
    return attrs.bajo ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  
  // Respuestas específicas para marcas/conceptos
  if (containsKeyword(question, "apple") || containsKeyword(question, "mac")) {
    return attrs.apple ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "tesla") || containsKeyword(question, "spacex")) {
    return attrs.tesla || attrs.spacex ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "marvel") || containsKeyword(question, "avengers") || containsKeyword(question, "vengadores")) {
    return attrs.marvel || attrs.ironman ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "star wars") || containsKeyword(question, "sith") || containsKeyword(question, "jedi")) {
    return attrs.espada_laser ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  
  // Si no matchea nada
  return {
    text: "Cambia de pregunta",
    type: 'maybe'
  };
}


// ==========================================================================
// 6. CONTROLES MANUALES (MODO HUMANO)
// ==========================================================================
document.querySelectorAll('.btn-manual-answer').forEach(button => {
  button.addEventListener('click', () => {
    const answerType = button.dataset.answer;
    let answerText = "SÍ";
    if (answerType === 'no') answerText = "NO";
    if (answerType === 'maybe') answerText = "Cambia de pregunta";
    
    const targetChannel = activeHostChatTab || 'questions';
    const textToUse = (inputQuestion && inputQuestion.value.trim()) ? inputQuestion.value.trim() : '[Pregunta formulada]';
    
    // Solo contar la pregunta si la respuesta es en canal preguntas y concluyente (SÍ o NO)
    if (targetChannel === 'questions' && (answerType === 'yes' || answerType === 'no')) {
      questionCount++;
      statQuestions.textContent = `${questionCount} / ${MAX_QUESTIONS}`;
      sendToTV('update-questions-count', { count: questionCount });
    }
    
    addChatMessage('player', textToUse, '', targetChannel);
    addChatMessage('host', answerText, answerType, targetChannel);
    
    if (inputQuestion) inputQuestion.value = '';
    
    checkGameOver();
  });
});

// Manejo del sistema de pistas (Costo de 3 preguntas)
const btnGetClue = document.getElementById('btn-get-clue');
btnGetClue.addEventListener('click', () => {
  if (cluesRevealedCount >= 3) {
    alert("Ya has agotado todas las pistas disponibles para este personaje (máximo 3).");
    return;
  }
  
  if (questionCount + 3 > MAX_QUESTIONS) {
    alert("No tienes suficientes preguntas restantes para pedir una pista (cuesta 3 preguntas).");
    return;
  }
  
  questionCount += 3;
  cluesRevealedCount++;
  
  const clueText = activeCharacter.clues[cluesRevealedCount - 1];
  
  addChatMessage('host', `[PISTA #${cluesRevealedCount}] (Costo: +3 Qs): ${clueText}`, 'maybe');
  
  statQuestions.textContent = `${questionCount} / ${MAX_QUESTIONS}`;
  sendToTV('update-questions-count', { count: questionCount });
  
  checkGameOver();
});


// Levenshtein distance para tolerancia a errores tipográficos / de imprenta
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Calcular porcentaje de similitud entre dos cadenas (0.0 a 1.0)
function stringSimilarity(str1, str2) {
  const s1 = phonetize(str1);
  const s2 = phonetize(str2);
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;
  
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  
  const dist = levenshteinDistance(s1, s2);
  return 1.0 - (dist / maxLen);
}

function checkGuessMatch(userGuess, activeChar) {
  if (!userGuess || !activeChar || !activeChar.name) return false;

  const cleanGuess = phonetize(userGuess);
  if (!cleanGuess) return false;

  // Recopilar posibles nombres / apodos / sinónimos válidos del personaje
  const targets = [];
  if (activeChar.name) targets.push(activeChar.name);
  if (activeChar.synonyms && Array.isArray(activeChar.synonyms)) {
    targets.push(...activeChar.synonyms);
  }

  const ignoreWords = ['de', 'del', 'la', 'las', 'los', 'van', 'von', 'el', 'da', 'di'];

  for (let targetName of targets) {
    if (!targetName) continue;

    const targetWords = targetName.split(/\s+/).filter(w => w.length > 0 && !ignoreWords.includes(w.toLowerCase()));
    const guessWords = userGuess.split(/\s+/).filter(w => w.length > 0 && !ignoreWords.includes(w.toLowerCase()));

    // CASO A: Personaje con Nombre y Apellido (2 o más palabras principales)
    if (targetWords.length >= 2) {
      const firstName = targetWords[0];
      const lastName = targetWords[targetWords.length - 1];

      // Coincide al menos un Nombre y un Apellido (>= 70% de similitud o prefijo)
      const matchedFirstName = guessWords.some(gw => stringSimilarity(gw, firstName) >= 0.70 || phonetize(firstName).startsWith(phonetize(gw)));
      const matchedLastName = guessWords.some(gw => stringSimilarity(gw, lastName) >= 0.70 || phonetize(lastName).startsWith(phonetize(gw)));

      if (matchedFirstName && matchedLastName) {
        return true;
      }

      // Coincidencia de nombre completo >= 75%
      if (stringSimilarity(userGuess, targetName) >= 0.75) {
        return true;
      }
      
      // Coincidencia del apellido principal >= 75%
      if (guessWords.some(gw => stringSimilarity(gw, lastName) >= 0.75)) {
        return true;
      }
    } 
    // CASO B: Personaje con Un solo Nombre (ej: Goku, Pelé, Neymar, Madonna)
    else if (targetWords.length === 1) {
      const singleTarget = targetWords[0];
      
      // Coincidencia si la similitud global es >= 75% (0.75)
      if (stringSimilarity(userGuess, singleTarget) >= 0.75) {
        return true;
      }
      
      // Coincidencia si alguna palabra ingresada por el usuario es >= 75%
      if (guessWords.some(gw => stringSimilarity(gw, singleTarget) >= 0.75)) {
        return true;
      }
    }
  }

  return false;
}

// ==========================================================================
// 7. ARRIESGAR / GANAR / PERDER
// ==========================================================================
// MODAL DE ARRIESGAR ANFITRIÓN
const hostGuessModal = document.getElementById('host-guess-modal');
const btnCloseHostGuess = document.getElementById('btn-close-host-guess');
const btnCancelHostGuess = document.getElementById('btn-cancel-host-guess');
const btnSubmitHostGuess = document.getElementById('btn-submit-host-guess');
const hostGuessInput = document.getElementById('host-guess-input');

function openHostGuessModal() {
  if (hostGuessModal) {
    if (hostGuessInput) hostGuessInput.value = '';
    hostGuessModal.style.display = 'flex';
  }
}

function closeHostGuessModal() {
  if (hostGuessModal) hostGuessModal.style.display = 'none';
}

if (btnCloseHostGuess) btnCloseHostGuess.addEventListener('click', closeHostGuessModal);
if (btnCancelHostGuess) btnCancelHostGuess.addEventListener('click', closeHostGuessModal);

function submitHostGuess() {
  if (!hostGuessInput) return;
  const guess = hostGuessInput.value.trim();
  if (!guess) return;

  closeHostGuessModal();
  
  const isCorrect = checkGuessMatch(guess, activeCharacter);
  
  if (isCorrect) {
    endGame(true, 'Anfitrión');
  } else {
    showToast(`❌ ¡Incorrecto! "${guess}" no es el personaje secreto.`);
    questionCount++;
    statQuestions.textContent = `${questionCount} / ${MAX_QUESTIONS}`;
    sendToTV('update-questions-count', { count: questionCount });
    
    addChatMessage('player', `¿Es ${guess}?`);
    addChatMessage('host', "NO", "no");
    
    checkGameOver();
  }
}

if (btnSubmitHostGuess) btnSubmitHostGuess.addEventListener('click', submitHostGuess);
if (hostGuessInput) {
  hostGuessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitHostGuess();
  });
}

document.getElementById('btn-guess-prompt').addEventListener('click', openHostGuessModal);

document.getElementById('btn-give-up').addEventListener('click', () => {
  if (confirm("¿Estás seguro de que quieres rendirte y revelar el personaje?")) {
    endGame(false);
  }
});

function checkGameOver() {
  if (questionCount >= MAX_QUESTIONS) {
    showToast("Se han agotado las 20 preguntas disponibles.");
    endGame(false);
  }
}

function endGame(victory, winner = 'Un participante') {
  // Configurar pantalla de resultados
  const resultEmoji = document.getElementById('result-emoji');
  const resultTitle = document.getElementById('result-title');
  const resultSubtitle = document.getElementById('result-subtitle');
  const resultCharName = document.getElementById('result-char-name');
  const resultCharDesc = document.getElementById('result-char-desc');
  
  if (victory) {
    resultEmoji.textContent = "🏆";
    resultTitle.textContent = "¡Victoria!";
    resultSubtitle.textContent = `🎉 ¡${winner} ha adivinado el personaje secreto con éxito!`;
  } else {
    resultEmoji.textContent = "💀";
    resultTitle.textContent = "Fin de la Partida";
    resultSubtitle.textContent = "No han logrado adivinar el personaje secreto.";
  }
  
  resultCharName.textContent = activeCharacter.name;
  resultCharDesc.textContent = activeCharacter.description;
  
  changeScreen('results');
  
  // Enviar comando a la TV y a todos los invitados remotos
  sendToTV('reveal-character', {
    victory,
    name: activeCharacter.name,
    description: activeCharacter.description,
    winner: winner
  });
}

// Jugar de nuevo
document.getElementById('btn-play-again').addEventListener('click', () => {
  const btnToggleRoomControl = document.getElementById('btn-toggle-room-control');
  const roomControlPanel = document.getElementById('room-control-panel');
  if (btnToggleRoomControl) btnToggleRoomControl.style.display = 'none';
  if (roomControlPanel) roomControlPanel.style.display = 'block';
  changeScreen('setup');
});

// LÓGICA DE INVITACIÓN Y CÓDIGO DE SALA (MODO REMOTO)
function generateRoomCode(forceNew = false) {
  // Generar código de sala único de 4 dígitos (si se fuerza o es primera vez)
  let savedCode = localStorage.getItem('adivinador_host_room_code');
  if (!forceNew && savedCode && savedCode.length === 4 && /^\d+$/.test(savedCode)) {
    roomCode = savedCode;
  } else {
    roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    localStorage.setItem('adivinador_host_room_code', roomCode);
  }
  
  if (roomCodeDisplay && roomCodeDisplay.querySelector('span')) {
    roomCodeDisplay.querySelector('span').textContent = roomCode;
    roomCodeDisplay.style.display = 'inline-flex';
    roomCodeDisplay.style.cursor = 'pointer';
    roomCodeDisplay.title = 'Clic para cambiar de sala';
  }
  if (btnShareInvite) btnShareInvite.style.display = 'inline-flex';
  if (btnSyncTv) btnSyncTv.style.display = 'inline-flex';

  const roomControlPanel = document.getElementById('room-control-panel');
  if (roomControlPanel) {
    roomControlPanel.style.display = 'block';
  }

  // Escuchar mensajes entrantes en la sala
  listenToRoom();
}

if (roomCodeDisplay) {
  roomCodeDisplay.addEventListener('click', () => {
    generateRoomCode(true);
    syncWithTV();
    showToast(`¡Nueva sala generada: Código ${roomCode}!`);
  });
}

btnSyncTv.addEventListener('click', () => {
  syncWithTV();
  sendMusicStateToTV();
  sendChatControlState();
  showToast('¡Pantalla sincronizada con la TV!');
});

function getSpectatorURL() {
  const loc = window.location;
  let path = loc.pathname;
  if (path.endsWith('index.html')) {
    path = path.replace('index.html', 'receiver.html');
  } else if (path.endsWith('/')) {
    path += 'receiver.html';
  } else {
    path += '/receiver.html';
  }
  return `${loc.protocol}//${loc.host}${path}?sala=${roomCode}`;
}

function showToast(message) {
  toastText.textContent = message;
  toastNotification.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toastNotification.style.transform = 'translateX(-50%) translateY(100px)';
  }, 3000);
}

btnShareInvite.addEventListener('click', async () => {
  const url = getSpectatorURL();
  const inviteMessage = `¡Únete a mi partida de AdivinaQuién AI! 🧠🎮\nEntra a este enlace para ver el tablero en tiempo real:\n${url}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'AdivinaQuién AI',
        text: inviteMessage,
        url: url
      });
      showToast('¡Invitación compartida!');
    } catch (err) {
      console.log('Error compartiendo:', err);
      copyToClipboard(inviteMessage);
    }
  } else {
    copyToClipboard(inviteMessage);
  }
});

btnSyncTv.addEventListener('click', () => {
  syncWithTV();
  showToast('¡Pantalla sincronizada!');
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showToast('¡Invitación copiada al portapapeles!');
    })
    .catch(err => {
      console.error('Error al copiar:', err);
      showToast('No se pudo copiar automáticamente.');
    });
}

// Lógica de Escucha y Chat Bidireccional en el Host
let hostSse = null;
function listenToRoom() {
  if (hostSse) {
    hostSse.close();
  }
  hostSse = new EventSource(`https://ntfy.sh/adivina_ai_sala_${roomCode}/sse`);
  hostSse.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.message) {
        const innerMsg = JSON.parse(payload.message);
        if (innerMsg.senderId === myClientId) return;
        
        if (innerMsg.action === 'chat-message') {
          const channel = innerMsg.data.channel || 'questions';
          // Agregar mensaje de chat localmente
          addLocalChatMessage(innerMsg.data.sender, innerMsg.data.text, innerMsg.data.type, channel);
          
          // Si el modo turnos está activo y el mensaje viene de un invitado en preguntas, avanzar de turno automáticamente
          if (turnModeEnabled && innerMsg.data.sender === 'Invitado' && channel === 'questions') {
            advanceTurn();
          }
        } else if (innerMsg.action === 'guess-attempt') {
          const { sender, guess } = innerMsg.data;
          const isCorrect = checkGuessMatch(guess, activeCharacter);
          
          if (isCorrect) {
            addLocalChatMessage('Sistema', `🎉 ¡${sender} ARRIESGÓ Y ADIVINÓ A ${activeCharacter.name.toUpperCase()}!`, 'victory', 'questions');
            sendToTV('chat-message', { sender: 'Sistema', text: `🎉 ¡${sender} ARRIESGÓ Y ADIVINÓ A ${activeCharacter.name.toUpperCase()}!`, type: 'victory', channel: 'questions' });
            endGame(true);
          } else {
            addLocalChatMessage('Sistema', `❌ ${sender} arriesgó "${guess}" (Incorrecto)`, 'error', 'questions');
            sendToTV('chat-message', { sender: 'Sistema', text: `❌ ${sender} arriesgó "${guess}" (Incorrecto)`, type: 'error', channel: 'questions' });
            showToast(`❌ ${sender} arriesgó "${guess}" (Incorrecto)`);
          }
        } else if (innerMsg.action === 'request-clue') {
          const { sender, questionsLeft } = innerMsg.data;
          cluesRevealedCount++;
          let clueText = "";
          if (activeCharacter.clues && activeCharacter.clues.length > 0) {
            clueText = activeCharacter.clues[(cluesRevealedCount - 1) % activeCharacter.clues.length];
          } else {
            clueText = activeCharacter.description || "Sin más pistas.";
          }
          addLocalChatMessage('Sistema', `💡 PISTA para ${sender} (${questionsLeft}/20 Qs): ${clueText}`, 'maybe', 'questions');
          sendToTV('clue-revealed', { sender, questionsLeft, clueText });
        } else if (innerMsg.action === 'join-request') {
          processJoinRequest(innerMsg.data);
        } else if (innerMsg.action === 'request-state-sync') {
          const { clientId } = innerMsg.data;
          if (connectedPlayers[clientId]) {
            sendToTV('join-approved', {
              clientId: clientId,
              roomCode: roomCode,
              isReload: true,
              history: chatHistory,
              questionCount: questionCount,
              maxQuestions: MAX_QUESTIONS,
              gameMode: gameMode,
              activeCharacter: activeCharacter ? { name: activeCharacter.name } : null
            });
          }
        } else if (innerMsg.action === 'guest-joined') {
          processJoinRequest(innerMsg.data);
        }
      }
    } catch (e) {
      console.error("Error procesando mensaje en host SSE:", e);
    }
  };
}

function addLocalChatMessage(sender, text, type = '', channel = 'questions') {
  // Traducir el sender para la UI local
  let senderClass = 'player';
  if (sender === 'Anfitrión') {
    senderClass = 'host chat';
  } else if (sender === 'Invitado') {
    senderClass = 'guest';
  } else if (sender === 'Sistema') {
    senderClass = 'system';
  }

  chatHistory.push({ sender: senderClass, text, type, channel });
  
  // Helper para crear una burbuja
  const createBubble = () => {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${senderClass}`;
    
    const meta = document.createElement('span');
    meta.className = 'chat-meta';
    meta.textContent = `${sender}:`;
    
    const content = document.createElement('span');
    content.textContent = text;
    
    bubble.appendChild(meta);
    bubble.appendChild(content);
    
    // Si es un mensaje de invitado en preguntas, agregar botón rápido de responder
    if (sender !== 'Anfitrión' && sender !== 'Sistema' && channel === 'questions') {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn-copy-question';
      copyBtn.innerHTML = `<i class="fa-solid fa-reply"></i> Responder`;
      copyBtn.style.cssText = 'background: rgba(139, 92, 246, 0.25); border: 1px solid var(--accent); color: white; font-size: 0.7rem; padding: 3px 8px; border-radius: 6px; margin-top: 5px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; width: fit-content; font-family: inherit; font-weight: bold;';
      copyBtn.addEventListener('click', () => {
        if (hostTabQuestions) hostTabQuestions.click();
        if (inputQuestion) inputQuestion.value = text;
        showToast(`Pregunta de ${sender} cargada para responder`);
        const controlsManual = document.getElementById('controls-manual');
        const controlsAI = document.getElementById('controls-ai');
        if (gameMode === 'manual' && controlsManual) {
          controlsManual.scrollIntoView({ behavior: 'smooth' });
        } else if (controlsAI) {
          controlsAI.scrollIntoView({ behavior: 'smooth' });
        }
      });
      bubble.appendChild(copyBtn);
    }
    
    return bubble;
  };

  // 1. Añadir al chat principal de Gameplay
  const gameplayContainer = channel === 'social' ? chatSocialContainer : chatQuestionsContainer;
  if (gameplayContainer) {
    const defaultPlayText = gameplayContainer.querySelector('.chat-bubble[style*="italic"]');
    if (defaultPlayText) defaultPlayText.remove();
    
    gameplayContainer.appendChild(createBubble());
    gameplayContainer.scrollTop = gameplayContainer.scrollHeight;
  }

  // 2. Añadir al chat del Lobby
  const lobbyContainer = document.getElementById(channel === 'social' ? 'lobby-chat-social-container' : 'lobby-chat-questions-container');
  if (lobbyContainer) {
    const defaultLobbyText = lobbyContainer.querySelector('div[style*="italic"]');
    if (defaultLobbyText) defaultLobbyText.remove();
    
    lobbyContainer.appendChild(createBubble());
    lobbyContainer.scrollTop = lobbyContainer.scrollHeight;
  }

  // Indicar nueva actividad en la pestaña inactiva de Gameplay
  if (channel !== activeHostChatTab) {
    const tabButton = channel === 'social' ? document.getElementById('host-tab-social') : document.getElementById('host-tab-questions');
    if (tabButton) {
      const icon = channel === 'social' ? 'fa-comments' : 'fa-circle-question';
      const textLabel = channel === 'social' ? 'Social' : 'Preguntas';
      tabButton.innerHTML = `<i class="fa-solid ${icon}"></i> ${textLabel} <span style="background: var(--danger); width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-left: 3px;"></span>`;
    }
  }

  // Indicar nueva actividad en la pestaña inactiva del Lobby
  if (channel !== activeLobbyChatTab) {
    const lobbyTabButton = channel === 'social' ? document.getElementById('lobby-tab-social') : document.getElementById('lobby-tab-questions');
    if (lobbyTabButton) {
      const textLabel = channel === 'social' ? 'Social' : 'Preguntas';
      lobbyTabButton.innerHTML = `${textLabel} <span style="background: var(--danger); width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-left: 3px;"></span>`;
    }
  }
}

// Enviar comentario de chat por el Host (Gameplay)
const btnChatToggle = document.getElementById('btn-chat-toggle');

function sendHostChatMessage(channel) {
  const text = inputQuestion.value.trim();
  if (!text) return;
  
  addLocalChatMessage('Anfitrión', text, 'chat', channel);
  sendToTV('chat-message', { sender: 'Anfitrión', text: text, type: 'chat', channel });
  
  inputQuestion.value = '';
}

if (btnAsk) {
  btnAsk.addEventListener('click', () => sendHostChatMessage('questions'));
}
if (btnChatToggle) {
  btnChatToggle.addEventListener('click', () => sendHostChatMessage('social'));
}

// Configurar Tabs de Chat en Gameplay (Host)
const hostTabQuestions = document.getElementById('host-tab-questions');
const hostTabSocial = document.getElementById('host-tab-social');
if (hostTabQuestions && hostTabSocial) {
  hostTabQuestions.addEventListener('click', () => {
    activeHostChatTab = 'questions';
    if (chatQuestionsContainer) chatQuestionsContainer.style.setProperty('display', 'flex', 'important');
    if (chatSocialContainer) chatSocialContainer.style.setProperty('display', 'none', 'important');
    if (inputQuestion) inputQuestion.placeholder = "¿Es un deportista? ¿Está vivo?...";
    
    const controlsManual = document.getElementById('controls-manual');
    if (controlsManual) {
      controlsManual.style.display = gameMode === 'manual' ? 'flex' : 'none';
    }
    
    hostTabQuestions.style.background = 'var(--accent)';
    hostTabQuestions.style.color = 'white';
    hostTabQuestions.style.borderColor = 'var(--accent)';
    hostTabSocial.style.background = 'rgba(255,255,255,0.05)';
    hostTabSocial.style.color = 'var(--text-muted)';
    hostTabSocial.style.borderColor = 'rgba(255,255,255,0.1)';
    hostTabQuestions.innerHTML = `<i class="fa-solid fa-circle-question"></i> Preguntas`;
  });

  hostTabSocial.addEventListener('click', () => {
    activeHostChatTab = 'social';
    if (chatSocialContainer) chatSocialContainer.style.setProperty('display', 'flex', 'important');
    if (chatQuestionsContainer) chatQuestionsContainer.style.setProperty('display', 'none', 'important');
    if (inputQuestion) inputQuestion.placeholder = "Escribe un mensaje para el chat Social...";
    
    const controlsManual = document.getElementById('controls-manual');
    if (controlsManual) {
      controlsManual.style.display = 'none';
    }
    
    hostTabSocial.style.background = 'var(--accent)';
    hostTabSocial.style.color = 'white';
    hostTabSocial.style.borderColor = 'var(--accent)';
    hostTabQuestions.style.background = 'rgba(255,255,255,0.05)';
    hostTabQuestions.style.color = 'var(--text-muted)';
    hostTabQuestions.style.borderColor = 'rgba(255,255,255,0.1)';
    hostTabSocial.innerHTML = `<i class="fa-solid fa-comments"></i> Social`;
  });
}

// Configurar Tabs de Chat en Lobby (Host)
activeLobbyChatTab = 'questions';
const lobbyTabQuestions = document.getElementById('lobby-tab-questions');
const lobbyTabSocial = document.getElementById('lobby-tab-social');
const lobbyChatQuestionsContainer = document.getElementById('lobby-chat-questions-container');
const lobbyChatSocialContainer = document.getElementById('lobby-chat-social-container');

if (lobbyTabQuestions && lobbyTabSocial) {
  lobbyTabQuestions.addEventListener('click', () => {
    activeLobbyChatTab = 'questions';
    if (lobbyChatQuestionsContainer) lobbyChatQuestionsContainer.style.setProperty('display', 'flex', 'important');
    if (lobbyChatSocialContainer) lobbyChatSocialContainer.style.setProperty('display', 'none', 'important');
    lobbyTabQuestions.style.background = 'var(--accent)';
    lobbyTabQuestions.style.color = 'white';
    lobbyTabQuestions.style.borderColor = 'var(--accent)';
    lobbyTabSocial.style.background = 'rgba(255,255,255,0.05)';
    lobbyTabSocial.style.color = 'var(--text-muted)';
    lobbyTabSocial.style.borderColor = 'rgba(255,255,255,0.1)';
    lobbyTabQuestions.innerHTML = `Preguntas`;
  });

  lobbyTabSocial.addEventListener('click', () => {
    activeLobbyChatTab = 'social';
    if (lobbyChatSocialContainer) lobbyChatSocialContainer.style.setProperty('display', 'flex', 'important');
    if (lobbyChatQuestionsContainer) lobbyChatQuestionsContainer.style.setProperty('display', 'none', 'important');
    lobbyTabSocial.style.background = 'var(--accent)';
    lobbyTabSocial.style.color = 'white';
    lobbyTabSocial.style.borderColor = 'var(--accent)';
    lobbyTabQuestions.style.background = 'rgba(255,255,255,0.05)';
    lobbyTabQuestions.style.color = 'var(--text-muted)';
    lobbyTabQuestions.style.borderColor = 'rgba(255,255,255,0.1)';
    lobbyTabSocial.innerHTML = `Social`;
  });
}

// LÓGICA DE CONTROL DE JUGADORES Y CHAT (HOST)
const playerListContainer = document.getElementById('player-list-container');
const btnToggleQuestionsChat = document.getElementById('btn-toggle-questions-chat');
const btnToggleSocialChat = document.getElementById('btn-toggle-social-chat');
const btnToggleTvMusic = document.getElementById('btn-toggle-tv-music');
const btnToggleTurnMode = document.getElementById('btn-toggle-turn-mode');
const btnNextTurn = document.getElementById('btn-next-turn');

function renderPlayerList() {
  if (!playerListContainer) return;
  
  const players = Object.keys(connectedPlayers);
  if (players.length === 0) {
    playerListContainer.innerHTML = `<span style="color: var(--text-muted); font-style: italic;">Esperando a que se unan jugadores...</span>`;
    return;
  }
  
  playerListContainer.innerHTML = '';
  
  players.forEach((clientId, idx) => {
    const player = connectedPlayers[clientId];
    
    const playerRow = document.createElement('div');
    playerRow.style.display = 'flex';
    playerRow.style.justify = 'space-between';
    playerRow.style.alignItems = 'center';
    playerRow.style.background = 'rgba(255, 255, 255, 0.03)';
    playerRow.style.padding = '6px 12px';
    playerRow.style.borderRadius = '6px';
    playerRow.style.border = '1px solid var(--bg-card-border)';
    playerRow.style.gap = '10px';
    
    const nameSpan = document.createElement('span');
    if (turnModeEnabled && idx === currentPlayerTurnIndex) {
      nameSpan.innerHTML = `<i class="fa-solid fa-hourglass-half pulse-success-active" style="color: var(--accent); margin-right: 6px;"></i> <strong>${player.name} (Su Turno)</strong>`;
    } else {
      nameSpan.textContent = player.name;
    }
    nameSpan.style.fontWeight = '500';
    nameSpan.style.overflow = 'hidden';
    nameSpan.style.textOverflow = 'ellipsis';
    nameSpan.style.whiteSpace = 'nowrap';
    nameSpan.style.flexGrow = '1';
    
    // Contenedor de botones de mute
    const mutesContainer = document.createElement('div');
    mutesContainer.style.display = 'flex';
    mutesContainer.style.gap = '4px';
    
    // 1. Botón Mute Preguntas
    const muteQuestionsBtn = document.createElement('button');
    muteQuestionsBtn.className = 'btn';
    muteQuestionsBtn.style.padding = '4px 6px';
    muteQuestionsBtn.style.margin = '0';
    muteQuestionsBtn.style.fontSize = '0.75rem';
    muteQuestionsBtn.style.borderRadius = '4px';
    muteQuestionsBtn.style.display = 'inline-flex';
    muteQuestionsBtn.style.alignItems = 'center';
    muteQuestionsBtn.style.justify = 'center';
    muteQuestionsBtn.style.gap = '3px';
    muteQuestionsBtn.style.textTransform = 'none';
    muteQuestionsBtn.style.fontWeight = 'bold';
    
    if (player.questionsEnabled) {
      muteQuestionsBtn.innerHTML = `<i class="fa-solid fa-circle-question"></i> Preg`;
      muteQuestionsBtn.style.background = 'rgba(16, 185, 129, 0.15)';
      muteQuestionsBtn.style.color = 'var(--accent)';
      muteQuestionsBtn.style.borderColor = 'var(--accent)';
    } else {
      muteQuestionsBtn.innerHTML = `<i class="fa-solid fa-comment-slash"></i> Preg`;
      muteQuestionsBtn.style.background = 'rgba(239, 68, 68, 0.15)';
      muteQuestionsBtn.style.color = 'var(--danger)';
      muteQuestionsBtn.style.borderColor = 'var(--danger)';
    }
    
    if (turnModeEnabled) {
      muteQuestionsBtn.disabled = true;
      muteQuestionsBtn.style.opacity = '0.5';
      muteQuestionsBtn.style.cursor = 'not-allowed';
    } else {
      muteQuestionsBtn.disabled = false;
      muteQuestionsBtn.style.opacity = '1';
      muteQuestionsBtn.style.cursor = 'pointer';
    }
    
    muteQuestionsBtn.addEventListener('click', () => {
      if (turnModeEnabled) return;
      player.questionsEnabled = !player.questionsEnabled;
      renderPlayerList();
      sendChatControlState();
    });
    
    // 2. Botón Mute Social
    const muteSocialBtn = document.createElement('button');
    muteSocialBtn.className = 'btn';
    muteSocialBtn.style.padding = '4px 6px';
    muteSocialBtn.style.margin = '0';
    muteSocialBtn.style.fontSize = '0.75rem';
    muteSocialBtn.style.borderRadius = '4px';
    muteSocialBtn.style.display = 'inline-flex';
    muteSocialBtn.style.alignItems = 'center';
    muteSocialBtn.style.justify = 'center';
    muteSocialBtn.style.gap = '3px';
    muteSocialBtn.style.textTransform = 'none';
    muteSocialBtn.style.fontWeight = 'bold';
    
    if (player.socialEnabled) {
      muteSocialBtn.innerHTML = `<i class="fa-solid fa-comments"></i> Soc`;
      muteSocialBtn.style.background = 'rgba(16, 185, 129, 0.15)';
      muteSocialBtn.style.color = 'var(--accent)';
      muteSocialBtn.style.borderColor = 'var(--accent)';
    } else {
      muteSocialBtn.innerHTML = `<i class="fa-solid fa-comment-slash"></i> Soc`;
      muteSocialBtn.style.background = 'rgba(239, 68, 68, 0.15)';
      muteSocialBtn.style.color = 'var(--danger)';
      muteSocialBtn.style.borderColor = 'var(--danger)';
    }
    
    muteSocialBtn.addEventListener('click', () => {
      player.socialEnabled = !player.socialEnabled;
      renderPlayerList();
      sendChatControlState();
    });
    
    // 3. Botón Expulsar (Solo X roja sin texto)
    const kickBtn = document.createElement('button');
    kickBtn.className = 'btn';
    kickBtn.style.padding = '4px 8px';
    kickBtn.style.margin = '0';
    kickBtn.style.fontSize = '0.9rem';
    kickBtn.style.borderRadius = '4px';
    kickBtn.style.background = 'rgba(239, 68, 68, 0.15)';
    kickBtn.style.color = '#ef4444';
    kickBtn.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    kickBtn.style.cursor = 'pointer';
    kickBtn.title = `Expulsar a ${player.name} de la sala`;
    kickBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    
    kickBtn.addEventListener('click', () => {
      kickPlayer(clientId);
    });

    mutesContainer.appendChild(muteQuestionsBtn);
    mutesContainer.appendChild(muteSocialBtn);
    mutesContainer.appendChild(kickBtn);
    
    playerRow.appendChild(nameSpan);
    playerRow.appendChild(mutesContainer);
    playerListContainer.appendChild(playerRow);
  });

  const connectedPlayersCount = document.getElementById('connected-players-count');
  if (connectedPlayersCount) {
    connectedPlayersCount.textContent = Object.keys(connectedPlayers).length;
  }
}

const btnToggleRoomControl = document.getElementById('btn-toggle-room-control');
const roomControlArrow = document.getElementById('room-control-arrow');

if (btnToggleRoomControl) {
  btnToggleRoomControl.addEventListener('click', () => {
    const roomControlPanel = document.getElementById('room-control-panel');
    if (roomControlPanel) {
      if (roomControlPanel.style.display === 'none') {
        roomControlPanel.style.display = 'block';
        if (roomControlArrow) roomControlArrow.style.transform = 'rotate(180deg)';
      } else {
        roomControlPanel.style.display = 'none';
        if (roomControlArrow) roomControlArrow.style.transform = 'rotate(0deg)';
      }
    }
  });
}

function kickPlayer(clientId) {
  const player = connectedPlayers[clientId];
  const playerName = player ? player.name : 'Jugador';
  
  delete connectedPlayers[clientId];
  renderPlayerList();
  
  sendToTV('kick-player', { clientId });
  showToast(`❌ ${playerName} ha sido expulsado.`);
}

let pendingApplicant = null;

function processJoinRequest(data) {
  const { clientId, name, role, isReload } = data;

  // Si el jugador YA estaba registrado previamente en esta sala (ej: recargó la pantalla con F5)
  if (connectedPlayers[clientId]) {
    if (name) connectedPlayers[clientId].name = name;
    renderPlayerList();
    
    sendToTV('join-approved', {
      clientId: clientId,
      roomCode: roomCode,
      isReload: true,
      history: chatHistory,
      questionCount: questionCount,
      maxQuestions: MAX_QUESTIONS,
      gameMode: gameMode,
      activeCharacter: activeCharacter ? { name: activeCharacter.name } : null
    });
    return;
  }

  // Solicitud nueva: mostrar Modal de Aprobación al Anfitrión
  pendingApplicant = { clientId, name: name || 'Invitado', role: role || 'guest' };

  const guestApprovalModal = document.getElementById('guest-approval-modal');
  const approvalApplicantName = document.getElementById('approval-applicant-name');
  const approvalRoomCode = document.getElementById('approval-room-code');

  if (guestApprovalModal) {
    if (approvalApplicantName) approvalApplicantName.textContent = pendingApplicant.name + (role === 'cohost' ? ' (Co-Anfitrión)' : '');
    if (approvalRoomCode) approvalRoomCode.textContent = roomCode;
    guestApprovalModal.style.display = 'flex';
  }
}

// Botón Aceptar en Modal de Aprobación
const btnApproveApplicant = document.getElementById('btn-approve-applicant');
if (btnApproveApplicant) {
  btnApproveApplicant.addEventListener('click', () => {
    if (!pendingApplicant) return;
    const { clientId, name, role } = pendingApplicant;
    
    connectedPlayers[clientId] = {
      name: name,
      role: role,
      questionsLeft: 20,
      questionsEnabled: true,
      socialEnabled: true
    };

    const guestApprovalModal = document.getElementById('guest-approval-modal');
    if (guestApprovalModal) guestApprovalModal.style.display = 'none';

    renderPlayerList();
    showToast(`✅ ${name} fue aceptado en la sala.`);

    sendToTV('join-approved', {
      clientId: clientId,
      roomCode: roomCode,
      history: chatHistory,
      questionCount: questionCount,
      maxQuestions: MAX_QUESTIONS,
      gameMode: gameMode,
      activeCharacter: activeCharacter ? { name: activeCharacter.name } : null
    });

    pendingApplicant = null;
  });
}

// Botón Rechazar en Modal de Aprobación
const btnRejectApplicant = document.getElementById('btn-reject-applicant');
if (btnRejectApplicant) {
  btnRejectApplicant.addEventListener('click', () => {
    if (!pendingApplicant) return;
    const { clientId, name } = pendingApplicant;

    const guestApprovalModal = document.getElementById('guest-approval-modal');
    if (guestApprovalModal) guestApprovalModal.style.display = 'none';

    showToast(`❌ Solicitud de ${name} rechazada.`);

    sendToTV('join-rejected', {
      clientId: clientId,
      reason: 'El Anfitrión no aprobó tu ingreso.'
    });

    pendingApplicant = null;
  });
}

function sendChatControlState() {
  const mutedQuestions = Object.keys(connectedPlayers).filter(id => !connectedPlayers[id].questionsEnabled);
  const mutedSocial = Object.keys(connectedPlayers).filter(id => !connectedPlayers[id].socialEnabled);
  sendToTV('chat-control', { 
    globalQuestionsEnabled, 
    globalSocialEnabled, 
    mutedQuestions, 
    mutedSocial 
  });
}

function sendMusicStateToTV() {
  sendToTV('music-control', { tvMusicEnabled });
}

function advanceTurn() {
  const playerIds = Object.keys(connectedPlayers);
  if (playerIds.length === 0) return;
  
  currentPlayerTurnIndex = (currentPlayerTurnIndex + 1) % playerIds.length;
  
  playerIds.forEach((id, idx) => {
    connectedPlayers[id].questionsEnabled = (idx === currentPlayerTurnIndex);
  });
  
  renderPlayerList();
  sendChatControlState();
  
  const nextPlayer = connectedPlayers[playerIds[currentPlayerTurnIndex]];
  addLocalChatMessage('Sistema', `Es el turno de ${nextPlayer.name}`, 'system', 'questions');
  sendToTV('chat-message', { sender: 'Sistema', text: `Es el turno de ${nextPlayer.name}`, type: 'system', channel: 'questions' });
}

function enableTurnMode() {
  const playerIds = Object.keys(connectedPlayers);
  if (playerIds.length === 0) return;
  
  currentPlayerTurnIndex = 0;
  playerIds.forEach((id, idx) => {
    connectedPlayers[id].questionsEnabled = (idx === 0);
  });
  
  renderPlayerList();
  sendChatControlState();
  
  const firstPlayer = connectedPlayers[playerIds[0]];
  addLocalChatMessage('Sistema', `Modo Turnos activado. Turno de: ${firstPlayer.name}`, 'system', 'questions');
  sendToTV('chat-message', { sender: 'Sistema', text: `Modo Turnos activado. Turno de: ${firstPlayer.name}`, type: 'system', channel: 'questions' });
}

function disableTurnMode() {
  const playerIds = Object.keys(connectedPlayers);
  playerIds.forEach(id => {
    connectedPlayers[id].questionsEnabled = true;
  });
  
  renderPlayerList();
  sendChatControlState();
  
  addLocalChatMessage('Sistema', `Modo Turnos desactivado. Chat de preguntas libre.`, 'system', 'questions');
  sendToTV('chat-message', { sender: 'Sistema', text: `Modo Turnos desactivado. Chat de preguntas libre.`, type: 'system', channel: 'questions' });
}

if (btnToggleQuestionsChat) {
  btnToggleQuestionsChat.addEventListener('click', () => {
    globalQuestionsEnabled = !globalQuestionsEnabled;
    if (globalQuestionsEnabled) {
      btnToggleQuestionsChat.textContent = 'Habilitado';
      btnToggleQuestionsChat.style.background = 'var(--accent)';
    } else {
      btnToggleQuestionsChat.textContent = 'Deshabilitado';
      btnToggleQuestionsChat.style.background = 'var(--danger)';
    }
    sendChatControlState();
  });
}

if (btnToggleSocialChat) {
  btnToggleSocialChat.addEventListener('click', () => {
    globalSocialEnabled = !globalSocialEnabled;
    if (globalSocialEnabled) {
      btnToggleSocialChat.textContent = 'Habilitado';
      btnToggleSocialChat.style.background = 'var(--accent)';
    } else {
      btnToggleSocialChat.textContent = 'Deshabilitado';
      btnToggleSocialChat.style.background = 'var(--danger)';
    }
    sendChatControlState();
  });
}

if (btnToggleTvMusic) {
  btnToggleTvMusic.addEventListener('click', () => {
    tvMusicEnabled = !tvMusicEnabled;
    if (tvMusicEnabled) {
      btnToggleTvMusic.textContent = 'Sonando';
      btnToggleTvMusic.style.background = 'var(--accent)';
    } else {
      btnToggleTvMusic.textContent = 'Silenciada';
      btnToggleTvMusic.style.background = '#4b5563'; // gris
    }
    sendMusicStateToTV();
  });
}

if (btnToggleTurnMode) {
  btnToggleTurnMode.addEventListener('click', () => {
    turnModeEnabled = !turnModeEnabled;
    if (turnModeEnabled) {
      btnToggleTurnMode.textContent = 'Activo';
      btnToggleTurnMode.style.background = 'var(--accent)';
      if (btnNextTurn) btnNextTurn.style.display = 'inline-flex';
      enableTurnMode();
    } else {
      btnToggleTurnMode.textContent = 'Desactivado';
      btnToggleTurnMode.style.background = '#4b5563';
      if (btnNextTurn) btnNextTurn.style.display = 'none';
      disableTurnMode();
    }
  });
}

if (btnNextTurn) {
  btnNextTurn.addEventListener('click', () => {
    if (turnModeEnabled) {
      advanceTurn();
    }
  });
}

// Permitir al Anfitrión responder en el chat del Lobby
const lobbyChatInput = document.getElementById('lobby-chat-input');
const btnSendLobbyChat = document.getElementById('btn-send-lobby-chat');

function sendHostLobbyChatMessage() {
  if (!lobbyChatInput) return;
  const text = lobbyChatInput.value.trim();
  if (!text) return;
  
  addLocalChatMessage('Anfitrión', text, 'chat', activeLobbyChatTab);
  sendToTV('chat-message', { sender: 'Anfitrión', text: text, type: 'chat', channel: activeLobbyChatTab });
  
  lobbyChatInput.value = '';
}

if (btnSendLobbyChat && lobbyChatInput) {
  btnSendLobbyChat.addEventListener('click', sendHostLobbyChatMessage);
  lobbyChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendHostLobbyChatMessage();
    }
  });
}

// Inicializar código de sala
generateRoomCode();

// Event listeners para Modal de Instructivo
document.addEventListener('DOMContentLoaded', () => {
  const instructionsModal = document.getElementById('instructions-modal');
  const btnOpenInstructions = document.getElementById('btn-open-instructions');
  const btnCloseInstructions = document.getElementById('btn-close-instructions');
  const btnUnderstandInstructions = document.getElementById('btn-understand-instructions');

  if (btnOpenInstructions && instructionsModal) {
    btnOpenInstructions.addEventListener('click', () => {
      instructionsModal.style.display = 'flex';
    });
  }
  if (btnCloseInstructions && instructionsModal) {
    btnCloseInstructions.addEventListener('click', () => {
      instructionsModal.style.display = 'none';
    });
  }
  if (btnUnderstandInstructions && instructionsModal) {
    btnUnderstandInstructions.addEventListener('click', () => {
      instructionsModal.style.display = 'none';
    });
  }
});

