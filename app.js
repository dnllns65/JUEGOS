// Lógica principal - Controlador del Celular (Anfitrión)

let activeCharacter = null;
let gameMode = 'ai'; // 'ai' o 'manual'
let currentFilters = { region: 'random', area: 'random', nature: 'random', era: 'random' };
let questionCount = 0;
const MAX_QUESTIONS = 20;
let chatHistory = [];
let presentationConnection = null;
let askedQuestions = [];
let cluesRevealedCount = 0;

let roomCode = '';

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
const chatContainer = document.getElementById('chat-container');
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
  // Configurar el archivo receptor
  presentationRequest = new PresentationRequest(['receiver.html']);
  navigator.presentation.defaultRequest = presentationRequest;
  
  // Escuchar si hay pantallas disponibles
  presentationRequest.getAvailability()
    .then(availability => {
      console.log('Disponibilidad de pantallas:', availability.value);
      btnCast.style.display = availability.value ? 'flex' : 'none';
      availability.onchange = () => {
        btnCast.style.display = availability.value ? 'flex' : 'none';
      };
    })
    .catch(err => {
      console.warn('Presentation API - Error al chequear disponibilidad:', err);
      // Mantener el botón visible como fallback por si acaso
      btnCast.style.display = 'flex';
    });
} else {
  console.log('Presentation API no soportada por este navegador.');
  btnCast.style.display = 'none';
}

// Conectar / Desconectar Proyección
btnCast.addEventListener('click', () => {
  if (presentationConnection) {
    // Si ya hay conexión, cerrarla
    presentationConnection.terminate();
  } else {
    // Iniciar nueva conexión
    if (presentationRequest) {
      presentationRequest.start()
        .then(connection => {
          setupPresentationConnection(connection);
        })
        .catch(err => {
          console.error('Error al iniciar transmisión:', err);
        });
    }
  }
});

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
  const payloadStr = JSON.stringify({ action, data });

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
      body: payloadStr,
      headers: {
        'Title': 'AdivinaQuién AI State Update',
        'Priority': 'normal'
      }
    }).catch(err => console.log('Error enviando sincronización remota:', err));
  }
}

// Sincronizar el estado actual completo con la TV
function syncWithTV() {
  const currentScreenId = Object.keys(screens).find(key => screens[key].classList.contains('active'));
  
  if (currentScreenId === 'home') {
    sendToTV('show-view', { view: 'welcome' });
  } else if (currentScreenId === 'setup') {
    sendToTV('show-view', { view: 'welcome' });
  } else if (currentScreenId === 'searching') {
    sendToTV('show-view', { view: 'searching' });
  } else if (currentScreenId === 'gameplay') {
    sendToTV('show-view', { view: 'gameplay' });
    sendToTV('update-stats', {
      questionCount,
      maxQuestions: MAX_QUESTIONS,
      mode: gameMode.toUpperCase(),
      filters: getReadableFilters()
    });
    sendToTV('sync-chat', { history: chatHistory });
  } else if (currentScreenId === 'results') {
    sendToTV('show-view', { view: 'results' });
    sendToTV('reveal-character', {
      victory: document.getElementById('result-title').textContent.includes('Victoria'),
      name: activeCharacter.name,
      description: activeCharacter.description
    });
    sendToTV('sync-chat', { history: chatHistory });
  }
  // Sincronizar música de Spotify
  sendSpotifyPlaylist();
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
      return;
    }
    
    // Filtros estándar
    const filterName = parent.dataset.filter;
    parent.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    currentFilters[filterName] = button.dataset.value;
  });
});

// Manejar inputs y lógica de Spotify
const spotifyPlaylistSelect = document.getElementById('spotify-playlist-select');
const spotifyCustomUrl = document.getElementById('spotify-custom-url');

spotifyPlaylistSelect.addEventListener('change', () => {
  if (spotifyPlaylistSelect.value === 'custom') {
    spotifyCustomUrl.style.display = 'block';
  } else {
    spotifyCustomUrl.style.display = 'none';
    spotifyCustomUrl.value = '';
    sendSpotifyPlaylist();
  }
});

spotifyCustomUrl.addEventListener('input', () => {
  sendSpotifyPlaylist();
});

function getSelectedPlaylistId() {
  const value = spotifyPlaylistSelect.value;
  if (value === 'custom') {
    const url = spotifyCustomUrl.value.trim();
    if (!url) return "";
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  }
  return value;
}

function sendSpotifyPlaylist() {
  const playlistId = getSelectedPlaylistId();
  sendToTV('update-music', { playlistId });
}


// ==========================================================================
// 3. SIMULACIÓN DE BÚSQUEDA Y SELECCIÓN DE PERSONAJE
// ==========================================================================
document.getElementById('btn-run-search').addEventListener('click', () => {
  changeScreen('searching');
  
  // Limpiar logs
  searchLogs.innerHTML = '';
  
  const logs = [
    "Inicializando rastreador de personajes...",
    "Crawleando Wikipedia y bases de datos públicas...",
    `Filtrando por parámetros: Región [${currentFilters.region}], Profesión [${currentFilters.area}]...`,
    "Analizando popularidad y volumen de búsquedas...",
    "Cruzando referencias históricas y ficticias...",
    "¡Personaje seleccionado con éxito!"
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
      // Seleccionar el personaje final
      selectCharacter();
      setTimeout(() => {
        startGame();
      }, 1000);
    }
  }, 500);
});

function selectCharacter() {
  // Filtrar base de datos
  const candidates = CHARACTERS.filter(char => {
    // Si el filtro es random, pasa automáticamente. Si no, debe coincidir.
    const regionMatch = currentFilters.region === 'random' || char.filters.region === currentFilters.region;
    const areaMatch = currentFilters.area === 'random' || char.filters.area === currentFilters.area;
    const natureMatch = currentFilters.nature === 'random' || char.filters.nature === currentFilters.nature;
    const eraMatch = currentFilters.era === 'random' || char.filters.era === currentFilters.era;
    
    return regionMatch && areaMatch && natureMatch && eraMatch;
  });
  
  console.log('Candidatos que coinciden con los filtros:', candidates);
  
  if (candidates.length > 0) {
    // Seleccionar uno aleatorio de los coincidentes
    activeCharacter = candidates[Math.floor(Math.random() * candidates.length)];
  } else {
    // Si no coincide ninguno, tomar uno aleatorio general
    console.warn('No se encontraron personajes con los filtros seleccionados, seleccionando uno general...');
    activeCharacter = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
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
  chatContainer.innerHTML = '';
  statQuestions.textContent = `0 / ${MAX_QUESTIONS}`;
  statMode.textContent = gameMode === 'ai' ? 'ANFITRIÓN IA' : 'MANUAL';
  
  // Configurar display de identidad
  charNameDisplay.textContent = activeCharacter.name;
  charDescDisplay.textContent = activeCharacter.description;
  
  // Por defecto la respuesta está oculta bajo un blur
  blurOverlay.style.display = 'flex';
  
  // Ajustar paneles de controles según el modo
  const controlsAI = document.getElementById('controls-ai');
  const controlsManual = document.getElementById('controls-manual');
  
  if (gameMode === 'ai') {
    controlsAI.style.display = 'flex';
    controlsManual.style.display = 'none';
  } else {
    controlsAI.style.display = 'none';
    controlsManual.style.display = 'flex';
  }
  
  changeScreen('gameplay');
  
  // Enviar evento de inicio a la TV
  sendToTV('start-game', {
    maxQuestions: MAX_QUESTIONS,
    mode: gameMode.toUpperCase(),
    filters: getReadableFilters()
  });

  // Enviar música inicial
  sendSpotifyPlaylist();
}

// Ocultar/Mostrar identidad
blurOverlay.addEventListener('click', () => {
  blurOverlay.style.display = 'none';
});

// Registrar un mensaje en el historial local y sincronizar con la TV
function addChatMessage(sender, text, type = '') {
  chatHistory.push({ sender, text, type });
  
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
  chatContainer.appendChild(bubble);
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  // Sincronizar chat e historial con la TV
  sendToTV('add-chat-bubble', { sender, text, type, questionCount });
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
    
    // Si no tiene suficiente información ('maybe'), la pregunta no se cuenta
    if (answer.type === 'yes' || answer.type === 'no') {
      questionCount++;
      statQuestions.textContent = `${questionCount} / ${MAX_QUESTIONS}`;
      sendToTV('update-questions-count', { count: questionCount });
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

  // --- REGLAS SEMÁNTICAS ESTÁNDAR ---
  const attrs = activeCharacter.attributes;
  
  // Género
  if (containsKeyword(question, "mujer") || containsKeyword(question, "femenina") || containsKeyword(question, "chica") || containsKeyword(question, "ella") || containsKeyword(question, "femenino")) {
    return attrs.mujer ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "hombre") || containsKeyword(question, "masculino") || containsKeyword(question, "varon") || containsKeyword(question, "chico") || containsKeyword(question, "el")) {
    if (containsKeyword(question, "es el") || containsKeyword(question, "el es") || containsKeyword(question, "hombre") || containsKeyword(question, "varon") || containsKeyword(question, "el")) {
      return attrs.hombre ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
    }
  }
  
  // Estado vital / Época
  if (containsKeyword(question, "vivo") || containsKeyword(question, "viva") || containsKeyword(question, "sigue vivo") || containsKeyword(question, "sigue con vida") || containsKeyword(question, "actualidad") || containsKeyword(question, "hoy en dia")) {
    return attrs.vivo ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "muerto") || containsKeyword(question, "fallecido") || containsKeyword(question, "murio") || containsKeyword(question, "ya no vive") || containsKeyword(question, "difunto") || containsKeyword(question, "tumba")) {
    return attrs.muerto ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  
  // Realidad / Ficción
  if (containsKeyword(question, "real") || containsKeyword(question, "existio") || containsKeyword(question, "existe") || containsKeyword(question, "vida real") || containsKeyword(question, "carne y hueso")) {
    return attrs.real ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
  }
  if (containsKeyword(question, "ficticio") || containsKeyword(question, "inventado") || containsKeyword(question, "dibujo") || containsKeyword(question, "caricatura") || containsKeyword(question, "anime") || containsKeyword(question, "libro") || containsKeyword(question, "pelicula") || containsKeyword(question, "personaje de") || containsKeyword(question, "falso")) {
    return attrs.ficticio ? { text: "SÍ", type: 'yes' } : { text: "NO", type: 'no' };
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
          if (activeCharacter.demonyms.some(d => phonetize(d) === phonetize(demonym)) || activeCharacter.country === char.country) {
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
        if (activeCharacter.demonyms.some(d => phonetize(d) === phonetize(demonym)) || phonetize(activeCharacter.country) === phonetize(country)) {
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
    text: "NO TENGO SUFICIENTE INFORMACIÓN sobre esa pregunta específica. Intenta preguntar sobre su profesión, si está vivo, su origen, o si es real/ficticio.",
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
    if (answerType === 'maybe') answerText = "TAL VEZ / PARCIAL";
    
    // Solo contar la pregunta si la respuesta es concluyente (SÍ o NO)
    if (answerType === 'yes' || answerType === 'no') {
      questionCount++;
      statQuestions.textContent = `${questionCount} / ${MAX_QUESTIONS}`;
      sendToTV('update-questions-count', { count: questionCount });
    }
    
    addChatMessage('player', `[Pregunta formulada en voz alta]`);
    addChatMessage('host', answerText, answerType);
    
    // Verificar si alcanzó el límite
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


// ==========================================================================
// 7. ARRIESGAR / GANAR / PERDER
// ==========================================================================
document.getElementById('btn-guess-prompt').addEventListener('click', () => {
  const guess = prompt("¿Quién crees que es el personaje secreto?");
  if (guess === null) return; // Cancelado
  
  const cleanGuess = phonetize(guess);
  if (!cleanGuess) return;
  
  // Verificar si coincide con el nombre o los sinónimos con tolerancia ortográfica
  const isCorrect = activeCharacter.synonyms.some(synonym => phonetize(synonym) === cleanGuess);
  
  if (isCorrect) {
    endGame(true);
  } else {
    alert(`¡Incorrecto! "${guess}" no es el personaje secreto. La partida continúa y se suma una pregunta.`);
    questionCount++;
    statQuestions.textContent = `${questionCount} / ${MAX_QUESTIONS}`;
    sendToTV('update-questions-count', { count: questionCount });
    
    addChatMessage('player', `¿Es ${guess}?`);
    addChatMessage('host', "NO", "no");
    
    checkGameOver();
  }
});

document.getElementById('btn-give-up').addEventListener('click', () => {
  if (confirm("¿Estás seguro de que quieres rendirte y revelar el personaje?")) {
    endGame(false);
  }
});

function checkGameOver() {
  if (questionCount >= MAX_QUESTIONS) {
    alert("Se han agotado las 20 preguntas disponibles.");
    endGame(false);
  }
}

function endGame(victory) {
  // Configurar pantalla de resultados
  const resultEmoji = document.getElementById('result-emoji');
  const resultTitle = document.getElementById('result-title');
  const resultSubtitle = document.getElementById('result-subtitle');
  const resultCharName = document.getElementById('result-char-name');
  const resultCharDesc = document.getElementById('result-char-desc');
  
  if (victory) {
    resultEmoji.textContent = "🏆";
    resultTitle.textContent = "¡Victoria!";
    resultSubtitle.textContent = "Han adivinado el personaje secreto con éxito.";
  } else {
    resultEmoji.textContent = "💀";
    resultTitle.textContent = "Fin de la Partida";
    resultSubtitle.textContent = "No han logrado adivinar el personaje secreto.";
  }
  
  resultCharName.textContent = activeCharacter.name;
  resultCharDesc.textContent = activeCharacter.description;
  
  changeScreen('results');
  
  // Enviar comando a la TV
  sendToTV('reveal-character', {
    victory,
    name: activeCharacter.name,
    description: activeCharacter.description
  });
}

// Jugar de nuevo
document.getElementById('btn-play-again').addEventListener('click', () => {
  changeScreen('setup');
});

// LÓGICA DE INVITACIÓN Y CÓDIGO DE SALA (MODO REMOTO)
function generateRoomCode() {
  roomCode = Math.floor(1000 + Math.random() * 9000).toString();
  roomCodeDisplay.querySelector('span').textContent = roomCode;
  roomCodeDisplay.style.display = 'inline-flex';
  btnShareInvite.style.display = 'inline-flex';
  btnSyncTv.style.display = 'inline-flex';
}

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

// Inicializar código de sala
generateRoomCode();

