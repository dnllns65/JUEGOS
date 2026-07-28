// Lógica principal - Pantalla Espectador (TV)
const myClientId = 'guest_' + Math.random().toString(36).substring(2, 9);
let currentRoomCode = '';
let activeChatTab = 'questions'; // 'questions' o 'social'
let isGlobalQuestionsEnabled = true;
let isGlobalSocialEnabled = true;
let isPlayerMutedQuestions = false;
let isPlayerMutedSocial = false;
let isMusicLocallyMuted = localStorage.getItem('adivinador_guest_music_muted') === 'true';

const views = {
  welcome: document.getElementById('tv-view-welcome'),
  searching: document.getElementById('tv-view-searching'),
  gameplay: document.getElementById('tv-view-gameplay'),
  results: document.getElementById('tv-view-results')
};

const tvStatus = document.getElementById('tv-status');
const tvSearchLogs = document.getElementById('tv-search-logs');
const tvQuestionsVal = document.getElementById('tv-questions-val');
const tvActiveFilters = document.getElementById('tv-active-filters');
const tvChatQuestionsContainer = document.getElementById('tv-chat-questions-container');
const tvChatSocialContainer = document.getElementById('tv-chat-social-container');
const tvTabQuestions = document.getElementById('tv-tab-questions');
const tvTabSocial = document.getElementById('tv-tab-social');

const tvResultEmoji = document.getElementById('tv-result-emoji');
const tvResultTitle = document.getElementById('tv-result-title');
const tvResultCharName = document.getElementById('tv-result-char-name');
const tvResultCharDesc = document.getElementById('tv-result-char-desc');

// Cambiar la vista de la TV
function showView(viewName) {
  Object.values(views).forEach(view => view.style.display = 'none');
  if (views[viewName]) {
    views[viewName].style.display = 'flex';
  }
}

// Agregar burbuja de chat en la TV
function addTVChatBubble(sender, text, type = '', questionCount = 0, channel = 'questions') {
  const container = channel === 'social' ? tvChatSocialContainer : tvChatQuestionsContainer;
  if (!container) return;

  // Limpiar mensaje inicial si existe
  if (container.innerHTML.includes('El historial de preguntas se mostrará') || container.innerHTML.includes('Conversación libre de la sala')) {
    container.innerHTML = '';
  }

  // Si es la formulación de una pregunta oficial (sender === 'player'), verificar si ya existe una burbuja del invitado con ese texto para actualizarla sin duplicar
  if (sender === 'player' && channel === 'questions') {
    const existingBubbles = container.querySelectorAll('.chat-bubble');
    for (let b of existingBubbles) {
      if (b.textContent.includes(text)) {
        b.className = `chat-bubble tv-chat-bubble player ${type}`;
        const meta = b.querySelector('.chat-meta');
        if (meta) {
          meta.textContent = `Pregunta #${questionCount}:`;
        }
        container.scrollTop = container.scrollHeight;
        return;
      }
    }
  }

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble tv-chat-bubble ${sender} ${type}`;

  const meta = document.createElement('span');
  meta.className = 'chat-meta';
  
  if (sender === 'player') {
    meta.textContent = `Pregunta #${questionCount}:`;
  } else {
    meta.textContent = `${sender === 'guest' || sender === 'Invitado' ? 'Invitado' : 'Anfitrión'}:`;
  }

  const content = document.createElement('span');
  content.textContent = text;

  bubble.appendChild(meta);
  bubble.appendChild(content);
  container.appendChild(bubble);

  // Auto-scroll hacia abajo
  container.scrollTop = container.scrollHeight;
}

// Sincronizar historial de chat completo
function syncTVChat(history) {
  if (tvChatQuestionsContainer) {
    tvChatQuestionsContainer.innerHTML = `
      <div class="chat-bubble player tv-chat-bubble" style="font-style: italic; color: var(--text-muted); align-self: center; text-align: center; max-width: 100%;">
        El historial de preguntas se mostrará aquí.
      </div>
    `;
  }
  if (tvChatSocialContainer) {
    tvChatSocialContainer.innerHTML = `
      <div class="chat-bubble player tv-chat-bubble" style="font-style: italic; color: var(--text-muted); align-self: center; text-align: center; max-width: 100%;">
        Conversación libre de la sala.
      </div>
    `;
  }

  if (history.length === 0) return;

  let pCount = 0;
  history.forEach(msg => {
    const channel = msg.channel || 'questions';
    if (channel === 'questions' && msg.sender === 'player' && !msg.text.includes('[Pregunta')) {
      pCount++;
    }
    addTVChatBubble(msg.sender, msg.text, msg.type, pCount, channel);
  });
}

// ==========================================================================
// CONFIGURACIÓN DEL RECEPTOR DE PRESENTACIÓN (Presentation API)
// ==========================================================================
if (navigator.presentation && navigator.presentation.receiver) {
  navigator.presentation.receiver.connectionList
    .then(list => {
      // Registrar conexiones existentes
      list.connections.forEach(connection => {
        setupConnection(connection);
      });

      // Escuchar nuevas conexiones entrantes
      list.onconnectionavailable = (event) => {
        setupConnection(event.connection);
      };
    })
    .catch(err => {
      console.error('Error al iniciar el receptor de Presentation API:', err);
    });
} else {
  console.log('Pantalla en modo local independiente (no iniciada mediante Presentation API).');
  tvStatus.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="color: #f59e0b; margin-right: 8px;"></i> Modo Local`;
}

// Procesar acciones y actualizar la interfaz de la TV
function handleTVMessage(action, data) {
  switch (action) {
    case 'bulk-sync':
      if (data.actions && Array.isArray(data.actions)) {
        data.actions.forEach(item => {
          handleTVMessage(item.action, item.data);
        });
      }
      break;

    case 'chat-message':
      addSpectatorChatMessage(data.sender, data.text, data.type, data.channel);
      break;

    case 'clue-revealed':
      addSpectatorChatMessage('Sistema', `💡 PISTA para ${data.sender} (${data.questionsLeft}/20 Qs): ${data.clueText}`, 'maybe', 'questions');
      break;

    case 'chat-control':
      isGlobalQuestionsEnabled = data.globalQuestionsEnabled;
      isGlobalSocialEnabled = data.globalSocialEnabled;
      isPlayerMutedQuestions = data.mutedQuestions.includes(myClientId);
      isPlayerMutedSocial = data.mutedSocial.includes(myClientId);
      updateChatInputState();
      break;

    case 'music-control':
      const bgMusic = document.getElementById('bg-music');
      const tvMuteIcon = document.getElementById('tv-mute-icon');
      if (bgMusic) {
        if (isMusicLocallyMuted) {
          bgMusic.muted = true;
          if (tvMuteIcon) {
            tvMuteIcon.className = 'fa-solid fa-volume-xmark';
            tvMuteIcon.style.color = 'var(--text-muted)';
          }
          break;
        }
        
        if (data.tvMusicEnabled) {
          bgMusic.muted = false;
          bgMusic.play().catch(e => {});
          if (tvMuteIcon) {
            tvMuteIcon.className = 'fa-solid fa-volume-high';
            tvMuteIcon.style.color = 'var(--accent)';
          }
        } else {
          bgMusic.muted = true;
          if (tvMuteIcon) {
            tvMuteIcon.className = 'fa-solid fa-volume-xmark';
            tvMuteIcon.style.color = 'var(--text-muted)';
          }
        }
      }
      break;

    case 'show-view':
      showView(data.view);
      break;

    case 'search-log':
      if (tvSearchLogs.innerHTML.trim() === '') {
        tvSearchLogs.innerHTML = '';
      }
      const p = document.createElement('div');
      p.className = 'search-log-line';
      p.textContent = data.text;
      tvSearchLogs.appendChild(p);
      tvSearchLogs.scrollTop = tvSearchLogs.scrollHeight;
      break;

    case 'start-game':
      showView('gameplay');
      tvQuestionsVal.textContent = `0 / ${data.maxQuestions}`;
      if (tvGameCountVal && data.gamesCount) tvGameCountVal.textContent = `#${data.gamesCount}`;
      tvChatContainer.innerHTML = '';
      tvSearchLogs.innerHTML = '';
      
      tvActiveFilters.innerHTML = '';
      data.filters.forEach(filter => {
        const span = document.createElement('span');
        span.innerHTML = `<i class="fa-solid fa-circle-chevron-right" style="color: var(--primary); margin-right: 8px;"></i> ${filter}`;
        tvActiveFilters.appendChild(span);
      });
      break;

    case 'update-stats':
      tvQuestionsVal.textContent = `${data.questionCount} / ${data.maxQuestions}`;
      
      tvActiveFilters.innerHTML = '';
      data.filters.forEach(filter => {
        const span = document.createElement('span');
        span.innerHTML = `<i class="fa-solid fa-circle-chevron-right" style="color: var(--primary); margin-right: 8px;"></i> ${filter}`;
        tvActiveFilters.appendChild(span);
      });
      break;

    case 'update-questions-count':
      tvQuestionsVal.textContent = `${data.count} / 20`;
      break;

    case 'add-chat-bubble':
      addTVChatBubble(data.sender, data.text, data.type, data.questionCount);
      break;

    case 'sync-chat':
      syncTVChat(data.history);
      break;

    case 'reveal-character':
      showView('results');
      if (data.victory) {
        tvResultEmoji.textContent = "🏆";
        tvResultTitle.textContent = "¡Victoria!";
        tvResultTitle.style.color = "var(--accent)";
      } else {
        tvResultEmoji.textContent = "💀";
        tvResultTitle.textContent = "Fin de la Partida";
        tvResultTitle.style.color = "var(--danger)";
      }
      tvResultCharName.textContent = data.name;
      tvResultCharDesc.textContent = data.description;
      break;

    default:
      console.warn('Acción desconocida recibida:', action);
  }
}

// Escuchar actualizaciones vía LocalStorage (para pruebas locales en la misma computadora en pestañas distintas)
window.addEventListener('storage', (event) => {
  if (event.key === 'adivinador_tv_sync' && event.newValue) {
    // Si ya estamos conectados a una sala remota vía SSE, ignorar LocalStorage para evitar duplicados
    if (currentRoomCode) return;

    try {
      const payload = JSON.parse(event.newValue);
      console.log('Mensaje LocalStorage recibido:', payload.action, payload.data);
      
      // Actualizar estado de conexión a local
      tvStatus.innerHTML = `<i class="fa-solid fa-circle-dot pulse-success-active" style="color: var(--accent); margin-right: 8px;"></i> Modo Local Sincronizado`;
      
      handleTVMessage(payload.action, payload.data);
    } catch (err) {
      console.error('Error al procesar mensaje de LocalStorage:', err);
    }
  }
});

function setupConnection(connection) {
  console.log('Conexión de control establecida:', connection.id);
  tvStatus.innerHTML = `<i class="fa-solid fa-circle-dot pulse-success-active" style="color: var(--accent); margin-right: 8px;"></i> Pantalla Conectada`;

  connection.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      console.log('Mensaje de controlador recibido:', payload.action, payload.data);
      handleTVMessage(payload.action, payload.data);
    } catch (err) {
      console.error('Error al parsear el mensaje de la conexión:', err);
    }
  };

  connection.onclose = () => {
    console.log('Conexión cerrada:', connection.id);
    tvStatus.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="color: var(--danger); margin-right: 8px;"></i> Desconectado`;
  };
}

// LÓGICA DE CONEXIÓN POR INTERNET (NTFY.SH SSE)
let sseSource = null;
const welcomeSetupBox = document.getElementById('tv-welcome-setup-box');
const welcomeStatusBox = document.getElementById('tv-welcome-status-box');
const tvRoomInput = document.getElementById('tv-room-input');
const tvBtnJoin = document.getElementById('tv-btn-join');
const tvRoomConnectionStatus = document.getElementById('tv-room-connection-status');

function connectToRoom(salaCode, nickname = '') {
  currentRoomCode = salaCode;
  if (sseSource) {
    sseSource.close();
  }

  tvStatus.innerHTML = `<i class="fa-solid fa-circle-dot pulse-success-active" style="color: var(--accent); margin-right: 8px;"></i> Sala Remota: ${salaCode}`;
  tvRoomConnectionStatus.textContent = `Conectado a Sala: ${salaCode}`;
  tvRoomConnectionStatus.style.color = 'var(--accent)';
  
  welcomeSetupBox.style.display = 'none';
  welcomeStatusBox.style.display = 'block';
  
  // Mostrar entrada de chat de sala
  const chatInputContainer = document.getElementById('tv-chat-input-container');
  if (chatInputContainer) {
    chatInputContainer.style.display = 'flex';
  }

  // Configurar editor de nombre en la pantalla de espera
  const waitingNickInput = document.getElementById('waiting-nickname-input');
  const btnSaveWaitingNick = document.getElementById('btn-save-waiting-nick');
  const resolvedName = nickname || localStorage.getItem('adivinador_guest_nickname') || `Invitado #${myClientId.slice(-4)}`;
  
  if (waitingNickInput) {
    waitingNickInput.value = resolvedName;
  }
  if (btnSaveWaitingNick && waitingNickInput) {
    btnSaveWaitingNick.onclick = () => {
      const newName = waitingNickInput.value.trim();
      if (newName) {
        localStorage.setItem('adivinador_guest_nickname', newName);
        sendRoomMessage('guest-joined', { name: newName, clientId: myClientId });
        alert('Nombre de jugador guardado.');
      }
    };
  }

  sseSource = new EventSource(`https://ntfy.sh/adivina_ai_sala_${salaCode}/sse`);
  
  sseSource.onopen = () => {
    console.log(`Conexión SSE establecida con la sala ${salaCode}`);
    
    // Notificar al anfitrión que nos unimos con nuestro nombre
    setTimeout(() => {
      sendRoomMessage('guest-joined', { name: resolvedName, clientId: myClientId });
    }, 500);
  };

  sseSource.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.message) {
        const innerMsg = JSON.parse(payload.message);
        // Ignorar si lo enviamos nosotros
        if (innerMsg.senderId === myClientId) return;
        
        console.log('Mensaje recibido de ntfy:', innerMsg);
        handleTVMessage(innerMsg.action, innerMsg.data);
      }
    } catch (e) {
      console.error('Error al procesar mensaje SSE:', e);
    }
  };

  sseSource.onerror = (err) => {
    console.error('Error en conexión SSE:', err);
    tvRoomConnectionStatus.textContent = `Reconectando a Sala: ${salaCode}...`;
    tvRoomConnectionStatus.style.color = '#e11d48';
  };
}

// Leer parámetro sala de la URL (?sala=XXXX) o (?room=XXXX)
const urlParams = new URLSearchParams(window.location.search);
const salaParam = urlParams.get('sala') || urlParams.get('room');

const nickInput = document.getElementById('tv-nickname-input');
if (nickInput) {
  nickInput.value = localStorage.getItem('adivinador_guest_nickname') || '';
}

if (salaParam) {
  const savedNick = localStorage.getItem('adivinador_guest_nickname') || '';
  connectToRoom(salaParam, savedNick);
} else {
  tvBtnJoin.addEventListener('click', () => {
    const nick = nickInput ? nickInput.value.trim() : '';
    if (nick) {
      localStorage.setItem('adivinador_guest_nickname', nick);
    }
    const code = tvRoomInput.value.trim();
    if (code.length === 4 && /^\d+$/.test(code)) {
      connectToRoom(code, nick);
    } else {
      alert('Por favor, ingresa un código de sala válido de 4 números.');
    }
  });
  
  // También permitir presionar Enter en el input
  tvRoomInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      tvBtnJoin.click();
    }
  });
}

// Permitir editar el número de sala haciendo clic en el badge de estado
tvStatus.addEventListener('click', () => {
  // Evitar iniciar la edición si ya está editando
  if (document.getElementById('tv-status-room-edit-input')) return;

  const currentCode = sseSource ? sseSource.url.match(/sala_(\d+)/)?.[1] || '' : '';
  
  tvStatus.innerHTML = `
    <i class="fa-solid fa-edit" style="margin-right: 6px; color: var(--accent);"></i>
    Sala: <input type="text" id="tv-status-room-edit-input" value="${currentCode}" maxlength="4" style="width: 45px; text-align: center; background: rgba(0,0,0,0.4); border: 1px solid var(--accent); color: var(--text-main); font-weight: bold; border-radius: 4px; outline: none; margin: 0 4px; font-family: inherit; font-size: 0.95rem;">
    <button id="tv-status-room-edit-save" class="btn" style="padding: 2px 6px; margin: 0; font-size: 0.75rem; display: inline-flex; align-items: center; justify-content: center; height: 22px; width: 24px; vertical-align: middle; border-radius: 4px;"><i class="fa-solid fa-check"></i></button>
  `;
  
  const editInput = document.getElementById('tv-status-room-edit-input');
  const editSave = document.getElementById('tv-status-room-edit-save');
  
  editInput.focus();
  editInput.select();

  // Evitar propagación para que al cliquear el input no reinicie la función
  editInput.addEventListener('click', (e) => e.stopPropagation());

  const saveEdit = () => {
    const code = editInput.value.trim();
    if (code.length === 4 && /^\d+$/.test(code)) {
      connectToRoom(code);
    } else {
      // Restaurar estado anterior
      if (currentCode) {
        connectToRoom(currentCode);
      } else {
        tvStatus.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="color: var(--danger); margin-right: 8px;"></i> Desconectado`;
      }
    }
  };

  editInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    }
  });

  editSave.addEventListener('click', (e) => {
    e.stopPropagation();
    saveEdit();
  });
});

// LÓGICA DE ENVÍO DE CHAT DEL INVITADO
function sendRoomMessage(action, data = {}) {
  if (currentRoomCode) {
    const payloadStr = JSON.stringify({ action, data, senderId: myClientId });
    fetch(`https://ntfy.sh/adivina_ai_sala_${currentRoomCode}`, {
      method: 'POST',
      body: payloadStr
    }).catch(err => console.log('Error enviando mensaje de chat:', err));
  }
}

function addSpectatorChatMessage(sender, text, type = '', channel = 'questions') {
  const bubble = document.createElement('div');
  let senderClass = 'player';
  
  if (sender === 'Anfitrión') {
    senderClass = 'host chat';
  } else if (sender === 'Invitado') {
    senderClass = 'guest';
  } else if (sender === 'Sistema') {
    senderClass = 'system';
  }
  
  bubble.className = `chat-bubble tv-chat-bubble ${senderClass}`;
  
  const meta = document.createElement('span');
  meta.className = 'chat-meta';
  meta.textContent = `${sender}:`;
  
  const content = document.createElement('span');
  content.textContent = text;
  
  bubble.appendChild(meta);
  bubble.appendChild(content);
  
  // Seleccionar contenedor según canal
  const container = channel === 'social' ? tvChatSocialContainer : tvChatQuestionsContainer;
  if (!container) return;

  // Remover el cartel inicial si existe
  const defaultText = container.querySelector('.tv-chat-bubble');
  if (defaultText && defaultText.style.fontStyle === 'italic') {
    defaultText.remove();
  }
  
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;

  // Indicar nueva actividad en la pestaña inactiva
  if (channel !== activeChatTab) {
    const tabButton = channel === 'social' ? tvTabSocial : tvTabQuestions;
    if (tabButton) {
      const icon = channel === 'social' ? 'fa-comments' : 'fa-circle-question';
      const textLabel = channel === 'social' ? 'Social' : 'Preguntas';
      tabButton.innerHTML = `<i class="fa-solid ${icon}"></i> ${textLabel} <span style="background: var(--danger); width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-left: 5px;"></span>`;
    }
  }
}

let myQuestionsLeft = 20;

function updateMyQuestionsDisplay() {
  const tvMyQsVal = document.getElementById('tv-my-qs-val');
  if (tvMyQsVal) {
    tvMyQsVal.textContent = myQuestionsLeft;
  }
}

const tvChatInput = document.getElementById('tv-chat-input');
const tvBtnSendChat = document.getElementById('tv-btn-send-chat');

function sendSpectatorChatMessage() {
  const text = tvChatInput.value.trim();
  if (!text) return;
  
  if (activeChatTab === 'questions') {
    if (myQuestionsLeft <= 0) {
      alert('Has agotado tus 20 preguntas disponibles.');
      return;
    }
    myQuestionsLeft--;
    updateMyQuestionsDisplay();
  }
  
  const senderName = (typeof guestPlayerName !== 'undefined' && guestPlayerName) ? guestPlayerName : 'Invitado';
  const formattedSender = activeChatTab === 'questions' ? `${senderName} (${myQuestionsLeft}/20 Qs)` : senderName;
  
  // Mostrar localmente
  addSpectatorChatMessage(senderName, text, 'chat', activeChatTab);
  
  // Enviar a la sala por ntfy.sh
  sendRoomMessage('chat-message', { sender: formattedSender, text: text, type: 'chat', channel: activeChatTab, questionsLeft: myQuestionsLeft });
  
  tvChatInput.value = '';
}

if (tvBtnSendChat && tvChatInput) {
  tvBtnSendChat.addEventListener('click', sendSpectatorChatMessage);
  tvChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendSpectatorChatMessage();
    }
  });
}

const tvBtnClue = document.getElementById('tv-btn-clue');
if (tvBtnClue) {
  tvBtnClue.addEventListener('click', () => {
    if (myQuestionsLeft <= 0) {
      alert('No tienes preguntas disponibles para pedir una pista.');
      return;
    }
    myQuestionsLeft--;
    updateMyQuestionsDisplay();
    
    const senderName = (typeof guestPlayerName !== 'undefined' && guestPlayerName) ? guestPlayerName : 'Invitado';
    sendRoomMessage('request-clue', {
      sender: senderName,
      questionsLeft: myQuestionsLeft
    });
  });
}

// Configurar Tabs de Chat en Espectador
if (tvTabQuestions && tvTabSocial) {
  tvTabQuestions.addEventListener('click', () => {
    activeChatTab = 'questions';
    if (tvChatQuestionsContainer) tvChatQuestionsContainer.style.display = 'flex';
    if (tvChatSocialContainer) tvChatSocialContainer.style.display = 'none';
    
    // Estilo activo
    tvTabQuestions.style.background = 'var(--accent)';
    tvTabQuestions.style.color = 'white';
    tvTabQuestions.style.borderColor = 'var(--accent)';
    
    // Estilo inactivo
    tvTabSocial.style.background = 'rgba(255,255,255,0.05)';
    tvTabSocial.style.color = 'var(--text-muted)';
    tvTabSocial.style.borderColor = 'rgba(255,255,255,0.1)';
    
    // Quitar dot indicador
    tvTabQuestions.innerHTML = `<i class="fa-solid fa-circle-question"></i> Preguntas`;
    
    updateChatInputState();
  });
  
  tvTabSocial.addEventListener('click', () => {
    activeChatTab = 'social';
    if (tvChatSocialContainer) tvChatSocialContainer.style.display = 'flex';
    if (tvChatQuestionsContainer) tvChatQuestionsContainer.style.display = 'none';
    
    // Estilo activo
    tvTabSocial.style.background = 'var(--accent)';
    tvTabSocial.style.color = 'white';
    tvTabSocial.style.borderColor = 'var(--accent)';
    
    // Estilo inactivo
    tvTabQuestions.style.background = 'rgba(255,255,255,0.05)';
    tvTabQuestions.style.color = 'var(--text-muted)';
    tvTabQuestions.style.borderColor = 'rgba(255,255,255,0.1)';
    
    // Quitar dot indicador
    tvTabSocial.innerHTML = `<i class="fa-solid fa-comments"></i> Social`;
    
    updateChatInputState();
  });
}

// LÓGICA DE CONTROL DE CHAT (HABILITAR/SILENCIAR) Y MÚSICA EN EL ESPECTADOR
function updateChatInputState() {
  const chatInput = document.getElementById('tv-chat-input');
  const btnSend = document.getElementById('tv-btn-send-chat');
  
  if (!chatInput || !btnSend) return;
  
  if (activeChatTab === 'questions') {
    if (!isGlobalQuestionsEnabled) {
      chatInput.disabled = true;
      chatInput.placeholder = "El chat de preguntas está desactivado.";
      btnSend.disabled = true;
      btnSend.style.opacity = '0.5';
    } else if (isPlayerMutedQuestions) {
      chatInput.disabled = true;
      chatInput.placeholder = "El anfitrión desactivó tu chat de preguntas.";
      btnSend.disabled = true;
      btnSend.style.opacity = '0.5';
    } else {
      chatInput.disabled = false;
      chatInput.placeholder = "Escribe tu pregunta...";
      btnSend.disabled = false;
      btnSend.style.opacity = '1';
    }
  } else {
    // Canal Social
    if (!isGlobalSocialEnabled) {
      chatInput.disabled = true;
      chatInput.placeholder = "El chat social está desactivado.";
      btnSend.disabled = true;
      btnSend.style.opacity = '0.5';
    } else if (isPlayerMutedSocial) {
      chatInput.disabled = true;
      chatInput.placeholder = "El anfitrión desactivó tu chat social.";
      btnSend.disabled = true;
      btnSend.style.opacity = '0.5';
    } else {
      chatInput.disabled = false;
      chatInput.placeholder = "Escribe un mensaje al chat social...";
      btnSend.disabled = false;
      btnSend.style.opacity = '1';
    }
  }
}

// Control Local de la Música y Autoplay
const bgMusic = document.getElementById('bg-music');
const tvBtnMute = document.getElementById('tv-btn-mute');
const tvMuteIcon = document.getElementById('tv-mute-icon');

function playMusic() {
  if (bgMusic && bgMusic.paused) {
    bgMusic.play().catch(err => {
      console.log('Autoplay bloqueado. Esperando interacción del usuario.');
    });
  }
}

// Forzar inicio al hacer clic en cualquier lado del documento o al entrar
document.addEventListener('click', playMusic, { once: true });
if (document.getElementById('tv-btn-join')) {
  document.getElementById('tv-btn-join').addEventListener('click', () => {
    // Pequeño retardo para asegurar la interacción del usuario
    setTimeout(playMusic, 100);
  });
}

// Inicializar estado de la música basado en la preferencia guardada
if (bgMusic) {
  bgMusic.muted = isMusicLocallyMuted;
  if (tvMuteIcon) {
    if (isMusicLocallyMuted) {
      tvMuteIcon.className = 'fa-solid fa-volume-xmark';
      tvMuteIcon.style.color = 'var(--text-muted)';
    } else {
      tvMuteIcon.className = 'fa-solid fa-volume-high';
      tvMuteIcon.style.color = 'var(--accent)';
    }
  }
}

if (tvBtnMute) {
  tvBtnMute.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic) {
      playMusic();
      bgMusic.muted = !bgMusic.muted;
      isMusicLocallyMuted = bgMusic.muted;
      localStorage.setItem('adivinador_guest_music_muted', isMusicLocallyMuted);
      
      if (bgMusic.muted) {
        tvMuteIcon.className = 'fa-solid fa-volume-xmark';
        tvMuteIcon.style.color = 'var(--text-muted)';
      } else {
        tvMuteIcon.className = 'fa-solid fa-volume-high';
        tvMuteIcon.style.color = 'var(--accent)';
      }
    }
  });
}

// ==========================================================================
// MODAL Y LÓGICA DE ARRIESGAR PERSONAJE PARA EL INVITADO / ESPECTADOR
// ==========================================================================
const tvBtnGuess = document.getElementById('tv-btn-guess');
const tvGuessModal = document.getElementById('tv-guess-modal');
const tvBtnCloseGuess = document.getElementById('tv-btn-close-guess');
const tvBtnCancelGuess = document.getElementById('tv-btn-cancel-guess');
const tvBtnSubmitGuess = document.getElementById('tv-btn-submit-guess');
const tvGuessInputModal = document.getElementById('tv-guess-input-modal');

if (tvBtnGuess && tvGuessModal) {
  tvBtnGuess.addEventListener('click', () => {
    tvGuessModal.style.display = 'flex';
    if (tvGuessInputModal) {
      setTimeout(() => tvGuessInputModal.focus(), 100);
    }
  });
}

function closeGuestGuessModal() {
  if (tvGuessModal) {
    tvGuessModal.style.display = 'none';
  }
}

if (tvBtnCloseGuess) tvBtnCloseGuess.addEventListener('click', closeGuestGuessModal);
if (tvBtnCancelGuess) tvBtnCancelGuess.addEventListener('click', closeGuestGuessModal);

function submitGuestGuess() {
  if (!tvGuessInputModal) return;
  const guessText = tvGuessInputModal.value.trim();
  if (!guessText) return;

  closeGuestGuessModal();
  tvGuessInputModal.value = '';

  const senderName = (typeof guestPlayerName !== 'undefined' && guestPlayerName) ? guestPlayerName : 'Invitado';

  // Transmitir intento de arriesgar a la sala (al Host y TV)
  sendTVMessage('guess-attempt', {
    sender: senderName,
    guess: guessText,
    type: 'guess',
    channel: 'questions'
  });
}

if (tvBtnSubmitGuess) {
  tvBtnSubmitGuess.addEventListener('click', submitGuestGuess);
}
if (tvGuessInputModal) {
  tvGuessInputModal.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitGuestGuess();
    }
  });
}

// ==========================================================================
// MODAL DE INSTRUCTIVO DE JUEGO Y REGLAS PARA EL INVITADO
// ==========================================================================
const tvInstructionsModal = document.getElementById('tv-instructions-modal');
const tvBtnOpenInstructions = document.getElementById('tv-btn-open-instructions');
const tvBtnCloseInstructions = document.getElementById('tv-btn-close-instructions');
const tvBtnUnderstandInstructions = document.getElementById('tv-btn-understand-instructions');

if (tvBtnOpenInstructions && tvInstructionsModal) {
  tvBtnOpenInstructions.addEventListener('click', () => {
    tvInstructionsModal.style.display = 'flex';
  });
}

function closeTVInstructions() {
  if (tvInstructionsModal) {
    tvInstructionsModal.style.display = 'none';
  }
}

if (tvBtnCloseInstructions) tvBtnCloseInstructions.addEventListener('click', closeTVInstructions);
if (tvBtnUnderstandInstructions) tvBtnUnderstandInstructions.addEventListener('click', closeTVInstructions);
