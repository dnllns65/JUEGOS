// Lógica principal - Pantalla Espectador (TV)

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
const tvChatContainer = document.getElementById('tv-chat-container');

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
function addTVChatBubble(sender, text, type = '', questionCount = 0) {
  // Limpiar mensaje inicial si existe
  if (tvChatContainer.innerHTML.includes('El historial de preguntas se mostrará')) {
    tvChatContainer.innerHTML = '';
  }

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble tv-chat-bubble ${sender} ${type}`;

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
  tvChatContainer.appendChild(bubble);

  // Auto-scroll hacia abajo
  tvChatContainer.scrollTop = tvChatContainer.scrollHeight;
}

// Sincronizar historial de chat completo
function syncTVChat(history) {
  tvChatContainer.innerHTML = '';
  if (history.length === 0) {
    tvChatContainer.innerHTML = `
      <div class="chat-bubble player tv-chat-bubble" style="font-style: italic; color: var(--text-muted); align-self: center; text-align: center; max-width: 100%;">
        El historial de preguntas se mostrará aquí en tiempo real.
      </div>
    `;
    return;
  }

  let pCount = 0;
  history.forEach(msg => {
    if (msg.sender === 'player' && !msg.text.includes('[Pregunta')) {
      pCount++;
    }
    addTVChatBubble(msg.sender, msg.text, msg.type, pCount);
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
    case 'update-music':
      const spotifyContainer = document.getElementById('tv-spotify-container');
      if (data.playlistId) {
        spotifyContainer.innerHTML = `<iframe src="https://open.spotify.com/embed/playlist/${data.playlistId}?utm_source=generator&theme=0" width="100%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style="border-radius: 12px; border: none;"></iframe>`;
        spotifyContainer.style.display = 'block';
      } else {
        spotifyContainer.innerHTML = '';
        spotifyContainer.style.display = 'none';
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

function connectToRoom(salaCode) {
  if (sseSource) {
    sseSource.close();
  }

  tvStatus.innerHTML = `<i class="fa-solid fa-circle-dot pulse-success-active" style="color: var(--accent); margin-right: 8px;"></i> Sala Remota: ${salaCode}`;
  tvRoomConnectionStatus.textContent = `Conectado a Sala: ${salaCode}`;
  tvRoomConnectionStatus.style.color = 'var(--accent)';
  
  welcomeSetupBox.style.display = 'none';
  welcomeStatusBox.style.display = 'block';

  sseSource = new EventSource(`https://ntfy.sh/adivina_ai_sala_${salaCode}/sse`);
  
  sseSource.onopen = () => {
    console.log(`Conexión SSE establecida con la sala ${salaCode}`);
  };

  sseSource.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.message) {
        const innerMsg = JSON.parse(payload.message);
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

if (salaParam) {
  connectToRoom(salaParam);
} else {
  tvBtnJoin.addEventListener('click', () => {
    const code = tvRoomInput.value.trim();
    if (code.length === 4 && /^\d+$/.test(code)) {
      connectToRoom(code);
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
