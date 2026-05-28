const DAYS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
const STORAGE_KEY = "sharp_limpieza_board_v3";
const REMOTE_BOARD_PATH = "boards/main";
const SYNC_DEBOUNCE_MS = 250;

// Paste here the URL of your deployed Google Apps Script web app
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyUvGPTSyPC_jzlsyEgfrVaS-gxug_Z5QYyFeOuHAEQ7vcysHZ6WPAyKafBPmfTtgiYGQ/exec";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDvx6sjsvCEOiKQT6fbyx1SF7wuogZfOHI",
  authDomain: "sharplimpieza.firebaseapp.com",
  databaseURL: "https://sharplimpieza-default-rtdb.firebaseio.com",
  projectId: "sharplimpieza",
  storageBucket: "sharplimpieza.firebasestorage.app",
  messagingSenderId: "1066646996136",
  appId: "1:1066646996136:web:3f61f9101486b6d1a9ee9d"
};

const LEGEND = {
  red:    { symbol: "🟥", label: "Debe ser cada 1 dia",             short: "Cada 1 dia",          css: "lg-red"    },
  orange: { symbol: "🟧", label: "Debe ser cada 3 dias",            short: "Cada 3 dias",          css: "lg-orange" },
  yellow: { symbol: "🟨", label: "Puede ser cada 4 dias",           short: "Cada 4 dias",          css: "lg-yellow" },
  green:  { symbol: "🟩", label: "Puede ser una semana (mas trabajo)", short: "Semanal (mas trabajo)", css: "lg-green"  },
  purple: { symbol: "🟪", label: "Puede ser una semana (+)",         short: "Semanal (+)",          css: "lg-purple" },
  none:   { symbol: "⚪", label: "Sin color definido en PDF",        short: "Sin color",            css: "lg-none"   }
};

const TASK_LIBRARY = {
  Freidora: [
    { id: "canastas",            name: "Canastas",                              color: "orange" },
    { id: "tapas",               name: "Tapas",                                 color: "red"    },
    { id: "puertas",             name: "Puertas",                               color: "red"    },
    { id: "tubo-drenaje",        name: "Tubo de Drenaje",                       color: "red"    },
    { id: "laterales",           name: "Laterales",                             color: "red"    },
    { id: "parte-atras",         name: "Parte atras",                           color: "orange" },
    { id: "filtrar-aceite",      name: "Filtrar y limpiar el aceite",           color: "orange" },
    { id: "limpieza-interior",   name: "Limpieza interior",                     color: "yellow" },
    { id: "ruedas",              name: "Ruedas",                                color: "purple" },
    { id: "planchas-laterales",  name: "Planchas laterales",                    color: "yellow" },
    { id: "tuberia",             name: "Tuberia",                               color: "yellow" },
    { id: "paredes-izq-trasera", name: "Pared izquierda y pared trasera",       color: "orange" }
  ],
  Plancha: [
    { id: "laterales",            name: "Laterales",                                    color: "red"    },
    { id: "mesa",                 name: "Mesa",                                         color: "red"    },
    { id: "patas",                name: "Patas",                                        color: "red"    },
    { id: "parte-atras",          name: "Parte atras",                                  color: "purple" },
    { id: "cuberteria-utensilios",name: "Cuberteria (Donde se ponen los utensilios)",   color: "red"    },
    { id: "pared-trasera",        name: "Pared trasera",                                color: "none"   },
    { id: "tuberia",              name: "Tuberia",                                      color: "yellow" },
    { id: "botones",              name: "Botones",                                      color: "red"    }
  ],
  Grill: [
    { id: "hornillas",            name: "Hornillas",                                    color: "red"    },
    { id: "malla",                name: "Malla",                                        color: "orange" },
    { id: "quemadores",           name: "Quemadores",                                   color: "green"  },
    { id: "carcaza",              name: "Carcaza",                                      color: "purple" },
    { id: "laterales",            name: "Laterales",                                    color: "red"    },
    { id: "parte-atras",          name: "Parte atras",                                  color: "yellow" },
    { id: "patas",                name: "Patas",                                        color: "red"    },
    { id: "plancha",              name: "Plancha",                                      color: "red"    },
    { id: "botones",              name: "Botones",                                      color: "red"    },
    { id: "tuberia",              name: "Tuberia",                                      color: "yellow" },
    { id: "mesa",                 name: "Mesa",                                         color: "red"    },
    { id: "cuberteria-utensilios",name: "Cuberteria (Donde se ponen los utensilios)",   color: "red"    }
  ],
  Estufa: [
    { id: "hornillas",  name: "Hornillas",  color: "red"    },
    { id: "quemadores", name: "Quemadores", color: "yellow" },
    { id: "plancha",    name: "Plancha",    color: "red"    },
    { id: "carcaza",    name: "Carcaza",    color: "purple" },
    { id: "mesa",       name: "Mesa",       color: "red"    },
    { id: "botones",    name: "Botones",    color: "red"    },
    { id: "tuberia",    name: "Tuberia",    color: "yellow" },
    { id: "interior",   name: "Interior",   color: "purple" }
  ],
  "Bano Maria": [
    { id: "cuerpo",         name: "Cuerpo",             color: "red"  },
    { id: "bocas",          name: "Bocas",               color: "red"  },
    { id: "cuberteria",     name: "Cuberteria",          color: "red"  },
    { id: "cheffin",        name: "Cheffin",             color: "red"  },
    { id: "botones",        name: "Botones",             color: "red"  },
    { id: "microondas",     name: "Microondas",          color: "red"  },
    { id: "mesa-microondas",name: "Mesa del microondas", color: "none" },
    { id: "mesa-pilon",     name: "Mesa de Pilon",       color: "red"  },
    { id: "pilones",        name: "Pilones",             color: "red"  },
    { id: "mano-pilon",     name: "Mano de Pilon",       color: "red"  }
  ],
  "Nevera 1": [
    { id: "nevera",          name: "Nevera",                                                    color: "yellow" },
    { id: "limpieza-interior", name: "Limpieza interior",                                      color: "purple" },
    { id: "limpieza-exterior", name: "Limpieza exterior",                                      color: "orange" },
    { id: "organizacion",    name: "Organizacion",                                             color: "red"    },
    { id: "cambio-cambros",  name: "Limpieza y cambio de cambros plasticos (Si amerita)",      color: "red"    }
  ],
  "Nevera 2": [
    { id: "nevera",          name: "Nevera",                                                    color: "yellow" },
    { id: "limpieza-interior", name: "Limpieza interior",                                      color: "purple" },
    { id: "limpieza-exterior", name: "Limpieza exterior",                                      color: "orange" },
    { id: "organizacion",    name: "Organizacion",                                             color: "red"    },
    { id: "cambio-cambros",  name: "Limpieza y cambio de cambros plasticos (Si amerita)",      color: "red"    }
  ],
  "Nevera 3": [
    { id: "nevera",          name: "Nevera",                                                    color: "yellow" },
    { id: "limpieza-interior", name: "Limpieza interior",                                      color: "purple" },
    { id: "limpieza-exterior", name: "Limpieza exterior",                                      color: "orange" },
    { id: "organizacion",    name: "Organizacion",                                             color: "red"    },
    { id: "cambio-cambros",  name: "Limpieza y cambio de cambros plasticos (Si amerita)",      color: "red"    }
  ],
  "Mesa de trabajo trasera": [
    { id: "limpieza-completa",   name: "Limpieza de mesa completa, exterior y interior",       color: "purple" },
    { id: "organizar-productos", name: "Organizar y limpiar productos colocados",              color: "red"    },
    { id: "boca-biberones",      name: "Boca de Biberones",                                   color: "red"    },
    { id: "etiquetar-cambros",   name: "Etiquetar y fechar cambros en nevera 1",              color: "yellow" }
  ],
  Zafacones: [
    { id: "todos-zafacones",  name: "Todos los Zafacones", color: "red" },
    { id: "interior-exterior",name: "Interior y exterior",  color: "red" }
  ],
  "Mesa de despacho": [
    { id: "mesa-despacho",     name: "Mesa de despacho",              color: "red"    },
    { id: "lamparas",          name: "Lamparas",                      color: "none"   },
    { id: "bebedero",          name: "Bebedero",                      color: "purple" },
    { id: "canastas-vegetales",name: "Canastas de vegetales",         color: "orange" },
    { id: "escalera",          name: "Escalera",                      color: "purple" },
    { id: "planchas-nevera2",  name: "Planchas encima de nevera 2",   color: "purple" },
    { id: "plancha-nevera3",   name: "Plancha encima de nevera 3",    color: "purple" }
  ],
  Piso: [
    { id: "cepillado-desgrasante", name: "Cepillado con jabon y Desgrasante", color: "red" }
  ]
};

const TEAM_NAMES = Object.keys(TASK_LIBRARY);
const TASK_INDEX = buildTaskIndex();

// DOM refs
const collaboratorForm  = document.getElementById("collaborator-form");
const collaboratorInput = document.getElementById("collaborator-name");
const scheduleBody      = document.getElementById("schedule-body");
const taskTeam       = document.getElementById("task-team");
const taskChecklist  = document.getElementById("task-checklist");
const taskFree       = document.getElementById("task-free");
const addTaskBtn     = document.getElementById("add-task-btn");
const clearTaskButton   = document.getElementById("clear-task");
const syncStatus        = document.getElementById("sync-status");
const modalOverlay      = document.getElementById("cell-modal-overlay");
const modalCellLabel    = document.getElementById("modal-cell-label");
const modalCloseBtn     = document.getElementById("modal-close-btn");
const modalCancelBtn    = document.getElementById("modal-cancel-btn");
const modalTaskList     = document.getElementById("modal-task-list");

// Week nav DOM refs
const weekPrevBtn = document.getElementById("week-prev-btn");
const weekNextBtn = document.getElementById("week-next-btn");

// Realizadas panel DOM refs
const realizadasPanel    = document.getElementById("realizadas-panel");
const realizadasBtn      = document.getElementById("realizadas-btn");
const realizadasCloseBtn = document.getElementById("realizadas-close-btn");
const realizadasBackdrop = realizadasPanel.querySelector(".realizadas-backdrop");
const realizadasBody     = document.getElementById("realizadas-body");
const realizadasWeekLbl  = document.getElementById("realizadas-week-label");

// Photo evidence DOM refs
const photoModalOverlay  = document.getElementById("photo-modal-overlay");
const photoModalLabel    = document.getElementById("photo-modal-label");
const photoModalCloseBtn = document.getElementById("photo-modal-close-btn");
const photoCancelBtn     = document.getElementById("photo-cancel-btn");
const photoCaptureBtn    = document.getElementById("photo-capture-btn");
const photoConfirmBtn    = document.getElementById("photo-confirm-btn");
const photoRetakeBtn     = document.getElementById("photo-retake-btn");
const photoVideo         = document.getElementById("photo-video");
const photoCanvas        = document.getElementById("photo-canvas");
const photoOverlayMsg    = document.getElementById("photo-overlay-msg");
const photoStatusText    = document.getElementById("photo-status-text");

let currentWeekStart  = getActiveWeekMondayStr();
let isOnAutoWeek      = true;

let state = loadState() || createInitialState();
let selectedCell = null;
let remoteBoardRef = null;
let remoteSaveTimer = null;
let isApplyingRemoteState = false;
let hasRemoteSnapshot = false;

let firebaseStorage   = null;
let photoStream       = null;
let photoBlob         = null;
let photoModalResolve = null;
let pendingPhotoMeta  = null;

updateTeamSelectors();
renderTable();
renderWeekLabel();
initRemoteSync();

// Auto-rollover: check every 60 s if we need to advance the week
setInterval(() => {
  if (!isOnAutoWeek) return;
  const auto = getActiveWeekMondayStr();
  if (auto !== currentWeekStart) {
    currentWeekStart = auto;
    renderWeekLabel();
    renderTable();
  }
}, 60_000);

// ── Event listeners ──────────────────────────────────────────────────

collaboratorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = collaboratorInput.value.trim();
  if (!name) { collaboratorInput.focus(); return; }
  state.collaborators.push({ id: createId(), name });
  collaboratorInput.value = "";
  saveState();
  updateTeamSelectors();
  renderTable();
});

scheduleBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const removeBtn = target.closest("[data-remove-collaborator]");
  if (removeBtn) {
    const cid = removeBtn.getAttribute("data-remove-collaborator");
    const collaborator = state.collaborators.find((c) => c.id === cid);
    if (!collaborator) return;
    if (!window.confirm(`Eliminar a ${collaborator.name} del calendario?`)) return;
    state.collaborators = state.collaborators.filter((c) => c.id !== cid);
    for (const key of Object.keys(state.tasks)) {
      if (key.startsWith(`${cid}__`) || key.includes(`__${cid}__`)) delete state.tasks[key];
    }
    if (selectedCell && selectedCell.collaboratorId === cid) closeModal();
    saveState();
    renderTable();
    return;
  }

  const cellBtn = target.closest("[data-cell]");
  if (!cellBtn) return;
  const collaboratorId = cellBtn.getAttribute("data-collaborator");
  const dayIndex = Number(cellBtn.getAttribute("data-day"));
  if (!collaboratorId || Number.isNaN(dayIndex)) return;
  selectedCell = { collaboratorId, dayIndex };
  renderTable();
  openModal();
});

taskTeam.addEventListener("change", () => {
  renderTaskChecklist(taskTeam.value);
});

taskChecklist.addEventListener("change", () => {
  syncAddForm();
});

taskFree.addEventListener("change", () => {
  if (!selectedCell) return;
  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  if (taskFree.checked) {
    state.tasks[key] = { free: true, items: [] };
  } else {
    delete state.tasks[key];
  }
  saveState();
  renderTable();
  renderModalTaskList();
  renderTaskChecklist(taskFree.checked ? "" : taskTeam.value);
});

addTaskBtn.addEventListener("click", () => {
  if (!selectedCell) return;
  const team = taskTeam.value.trim();
  if (!team) return;

  const checked = Array.from(taskChecklist.querySelectorAll("input[type='checkbox']:checked:not(:disabled)"));
  if (checked.length === 0) return;

  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  if (!state.tasks[key]) state.tasks[key] = { free: false, items: [] };
  const cellData = state.tasks[key];
  if (cellData.free) return;

  for (const cb of checked) {
    const taskId = cb.value;
    if (!cellData.items.some((item) => item.team === team && item.taskId === taskId)) {
      cellData.items.push({ id: createId(), team, taskId, done: false });
    }
  }

  saveState();
  renderTable();
  renderModalTaskList();
  renderTaskChecklist(team);
});

// Event delegation para lista de tareas del modal
modalTaskList.addEventListener("change", (event) => {
  const target = event.target;
  if (target.dataset.toggleDone !== undefined) {
    toggleTaskDone(Number(target.dataset.toggleDone), target.checked);
  }
});

modalTaskList.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-remove-task]");
  if (btn) removeTask(Number(btn.dataset.removeTask));
});

clearTaskButton.addEventListener("click", () => {
  if (!selectedCell) return;
  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  delete state.tasks[key];
  taskFree.checked = false;
  saveState();
  renderTable();
  renderModalTaskList();
  renderTaskChecklist(taskTeam.value);
});

modalCloseBtn.addEventListener("click", closeModal);
modalCancelBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) closeModal();
});

// Week navigation
weekPrevBtn.addEventListener("click", () => navigateWeek(-1));
weekNextBtn.addEventListener("click", () => navigateWeek(1));

// Realizadas panel
realizadasBtn.addEventListener("click", () => {
  renderRealizadasPanel();
  realizadasPanel.classList.remove("hidden");
});
realizadasCloseBtn.addEventListener("click", () => realizadasPanel.classList.add("hidden"));
realizadasBackdrop.addEventListener("click", () => realizadasPanel.classList.add("hidden"));

// ── Modal ─────────────────────────────────────────────────────────────

function openModal() {
  if (!selectedCell) return;
  const collaborator = state.collaborators.find((c) => c.id === selectedCell.collaboratorId);
  if (!collaborator) return;

  modalCellLabel.textContent = `${collaborator.name} — ${DAYS[selectedCell.dayIndex]}`;

  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  const cellData = state.tasks[key];
  taskFree.checked = Boolean(cellData && cellData.free);

  taskTeam.value = "";
  renderTaskChecklist("");

  renderModalTaskList();
  syncAddForm();
  modalOverlay.classList.remove("hidden");
  taskTeam.focus();
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  selectedCell = null;
  renderTable();
}

// ── Evidencia fotográfica ──────────────────────────────────

async function openPhotoModal(taskLabel, team, taskName) {
  pendingPhotoMeta = team && taskName ? { team, taskName } : null;
  photoBlob    = null;
  photoCanvas.classList.remove("visible");
  photoVideo.style.display      = "";
  photoOverlayMsg.textContent   = "";
  photoOverlayMsg.className     = "photo-overlay-msg";
  photoModalLabel.textContent   = taskLabel;
  photoStatusText.textContent   = "Iniciando cámara trasera...";
  photoCaptureBtn.disabled      = true;
  photoCaptureBtn.style.display = "";
  photoConfirmBtn.style.display = "none";
  photoRetakeBtn.style.display  = "none";
  photoModalOverlay.classList.remove("hidden");

  try {
    photoStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 960 } }
    });
    photoVideo.srcObject = photoStream;
    await new Promise((resolve, reject) => {
      photoVideo.onloadedmetadata = resolve;
      setTimeout(() => reject(new Error("timeout")), 8000);
    });
    photoVideo.play();
    photoStatusText.textContent = "Apunta la cámara a la tarea y toma la foto.";
    photoCaptureBtn.disabled    = false;
  } catch (_) {
    photoStatusText.textContent = "No se pudo abrir la cámara. Cierra (✕) para cancelar.";
  }

  return new Promise((resolve) => { photoModalResolve = resolve; });
}

photoCaptureBtn.addEventListener("click", () => {
  const w = 600;
  const h = Math.round(w * (photoVideo.videoHeight / photoVideo.videoWidth)) || 450;
  photoCanvas.width  = w;
  photoCanvas.height = h;
  photoCanvas.getContext("2d").drawImage(photoVideo, 0, 0, w, h);

  photoCanvas.toBlob((blob) => {
    photoBlob = blob;
    photoCanvas.classList.add("visible");
    photoVideo.style.display      = "none";
    photoOverlayMsg.textContent   = "¿Usar esta foto?";
    photoOverlayMsg.className     = "photo-overlay-msg";
    photoStatusText.textContent   = "Confirma la foto o tómala de nuevo.";
    photoCaptureBtn.style.display = "none";
    photoConfirmBtn.style.display = "";
    photoRetakeBtn.style.display  = "";
    photoConfirmBtn.disabled      = false;
    photoRetakeBtn.disabled       = false;
  }, "image/jpeg", 0.70);
});

photoRetakeBtn.addEventListener("click", () => {
  photoBlob    = null;
  photoCanvas.classList.remove("visible");
  photoVideo.style.display      = "";
  photoOverlayMsg.textContent   = "";
  photoStatusText.textContent   = "Apunta la cámara a la tarea realizada y toma la foto.";
  photoCaptureBtn.style.display = "";
  photoConfirmBtn.style.display = "none";
  photoRetakeBtn.style.display  = "none";
});

photoConfirmBtn.addEventListener("click", async () => {
  if (!photoBlob) return;
  photoConfirmBtn.disabled    = true;
  photoRetakeBtn.disabled     = true;
  photoStatusText.textContent = "Subiendo foto...";

  // Build compressed base64 (600px, q=0.70) — used both for Drive and fallback
  const tmp = document.createElement("canvas");
  const w   = Math.min(600, photoCanvas.width);
  const h   = Math.round(w * photoCanvas.height / (photoCanvas.width || 1));
  tmp.width  = w;
  tmp.height = h;
  tmp.getContext("2d").drawImage(photoCanvas, 0, 0, w, h);
  const imageBase64 = tmp.toDataURL("image/jpeg", 0.70);

  let photoUrl = null;

  if (APPS_SCRIPT_URL && selectedCell) {
    try {
      const collaborator = state.collaborators.find((c) => c.id === selectedCell.collaboratorId);
      const collabName   = collaborator ? collaborator.name : "Desconocido";
      const fileName     = pendingPhotoMeta
        ? `${pendingPhotoMeta.team}-${pendingPhotoMeta.taskName}-${collabName}`
        : photoModalLabel.textContent;
      const body = JSON.stringify({
        imageBase64,
        weekLabel:  getWeekFolderLabel(),
        fileName
      });
      const resp = await Promise.race([
        fetch(APPS_SCRIPT_URL, { method: "POST", body }),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 15000))
      ]);
      const result = await resp.json();
      if (result.ok) photoUrl = result.url;
    } catch (err) {
      console.warn("Drive upload failed, using base64 fallback:", err.message);
    }
  }

  // Fallback: store base64 directly in Firebase Database
  if (!photoUrl) photoUrl = imageBase64;

  photoOverlayMsg.textContent = "✓ Foto guardada";
  photoOverlayMsg.className   = "photo-overlay-msg success";
  photoStatusText.textContent = "Evidencia guardada. Tarea marcada como realizada.";
  setTimeout(() => closePhotoModal(photoUrl), 800);
});

photoModalCloseBtn.addEventListener("click", () => closePhotoModal(null));

function closePhotoModal(photoUrl) {
  if (photoStream) {
    photoStream.getTracks().forEach((t) => t.stop());
    photoStream = null;
  }
  photoVideo.srcObject = null;
  photoCanvas.classList.remove("visible");
  photoVideo.style.display = "";
  photoModalOverlay.classList.add("hidden");
  if (photoModalResolve) {
    photoModalResolve(photoUrl);
    photoModalResolve = null;
  }
}

function renderModalTaskList() {
  if (!selectedCell) return;
  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  const cellData = state.tasks[key];
  const isFree = Boolean(cellData && cellData.free);
  const items = (!isFree && cellData && Array.isArray(cellData.items)) ? cellData.items : [];

  if (items.length === 0) {
    modalTaskList.innerHTML = '<p class="modal-no-tasks">Sin tareas asignadas. Agrega una abajo.</p>';
    return;
  }

  modalTaskList.innerHTML = items.map((item, index) => {
    const meta = resolveTaskMeta(item);
    const doneClass = item.done ? "done" : "";
    const thumbHtml = item.done && item.evidencePhotoUrl
      ? `<a href="${escapeHtml(item.evidencePhotoUrl)}" target="_blank" rel="noopener" title="Ver evidencia fotográfica">
           <img src="${escapeHtml(item.evidencePhotoUrl)}" class="task-evidence-thumb" alt="Evidencia" loading="lazy">
         </a>`
      : "";
    const lockBadge = item.done
      ? `<span class="task-done-badge" title="Tarea realizada — no puede desmarcarse">🔒 Realizada</span>`
      : "";
    return `
      <div class="modal-task-item ${doneClass}">
        <label class="modal-task-check ${item.done ? "task-check-locked" : ""}">
          <input type="checkbox" ${item.done ? "checked disabled" : ""} data-toggle-done="${index}">
          <span>${meta.legend.symbol} <strong>${escapeHtml(meta.taskName)}</strong> — ${escapeHtml(meta.team)}</span>
        </label>
        ${lockBadge}
        ${thumbHtml}
        ${item.done ? "" : `<button type="button" class="modal-task-remove" data-remove-task="${index}" title="Eliminar">✕</button>`}
      </div>
    `;
  }).join("");
}

async function toggleTaskDone(index, done) {
  if (!selectedCell) return;

  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  const cellData = state.tasks[key];
  if (!cellData || !Array.isArray(cellData.items) || !cellData.items[index]) return;

  // Una vez marcada, no puede desmarcarse
  if (!done && cellData.items[index].done) {
    const cb = modalTaskList.querySelector(`[data-toggle-done="${index}"]`);
    if (cb) cb.checked = true;
    return;
  }

  if (!done) {
    cellData.items[index].done = false;
    delete cellData.items[index].completedAt;
    delete cellData.items[index].evidencePhotoUrl;
    saveState();
    renderTable();
    renderModalTaskList();
    return;
  }

  // ── Foto de evidencia REQUERIDA antes de marcar ──
  const capturedCollabId = selectedCell.collaboratorId;
  const capturedDayIndex = selectedCell.dayIndex;
  const meta  = resolveTaskMeta(cellData.items[index]);
  const label = `${meta.taskName} · ${DAYS[capturedDayIndex]}`;
  const photoUrl = await openPhotoModal(label, meta.team, meta.taskName);

  // If user closed without photo (✕), leave task undone
  if (!photoUrl) {
    const cb = modalTaskList.querySelector(`[data-toggle-done="${index}"]`);
    if (cb) cb.checked = false;
    return;
  }

  const k  = buildCellKey(capturedCollabId, capturedDayIndex);
  const cd = state.tasks[k];
  if (!cd?.items?.[index]) return;
  cd.items[index].done             = true;
  cd.items[index].completedAt      = new Date().toISOString();
  cd.items[index].evidencePhotoUrl = photoUrl;
  saveState();
  renderTable();
  if (selectedCell?.collaboratorId === capturedCollabId &&
      selectedCell?.dayIndex === capturedDayIndex) {
    renderModalTaskList();
  }
}

function removeTask(index) {
  if (!selectedCell) return;
  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  const cellData = state.tasks[key];
  if (!cellData || !Array.isArray(cellData.items)) return;
  if (cellData.items[index]?.done) return; // locked — cannot remove completed tasks
  cellData.items.splice(index, 1);
  if (cellData.items.length === 0) {
    delete state.tasks[key];
  }
  saveState();
  renderTable();
  renderModalTaskList();
}

function syncAddForm() {
  const isFree = taskFree.checked;
  taskTeam.disabled = isFree;
  const hasChecked = taskChecklist.querySelectorAll("input[type='checkbox']:checked:not(:disabled)").length > 0;
  addTaskBtn.disabled = isFree || !taskTeam.value || !hasChecked;
}

function renderTaskChecklist(team) {
  if (!team || !hasTeam(team)) {
    taskChecklist.innerHTML = '<p class="checklist-empty">Selecciona un equipo primero.</p>';
    syncAddForm();
    return;
  }

  const tasks = TASK_LIBRARY[team] || [];
  taskChecklist.innerHTML = tasks.map((task) => {
    const legend = LEGEND[task.color] || LEGEND.none;
    const assignee = getTaskAssignee(team, task.id);
    const assignedClass = assignee ? "checklist-item-assigned" : "";
    const disabledAttr = assignee ? "disabled checked" : "";
    const assigneeLabel = assignee
      ? `<span class="checklist-assignee">${escapeHtml(assignee)}</span>`
      : "";
    return `
      <label class="checklist-item ${assignedClass}">
        <input type="checkbox" value="${task.id}" ${disabledAttr}>
        <span>${legend.symbol}</span>
        <span class="checklist-name">${escapeHtml(task.name)}</span>
        ${assigneeLabel}
        <span class="checklist-freq">${escapeHtml(legend.short)}</span>
      </label>`;
  }).join("");

  syncAddForm();
}

function isTaskAssigned(team, taskId) {
  return getTaskAssignee(team, taskId) !== null;
}

// Returns how many consecutive days a task's color blocks after assignment.
// red=1 (daily), orange=3, yellow=4, green/purple=7 (whole week).
function getBlockDays(color) {
  if (color === "red")    return 1;
  if (color === "orange") return 3;
  if (color === "yellow") return 4;
  if (color === "green" || color === "purple") return 7;
  return 1;
}

function getTaskAssignee(team, taskId) {
  if (!selectedCell) return null;
  const { dayIndex } = selectedCell;
  const task      = findTask(team, taskId);
  const blockDays = getBlockDays(task ? task.color : "none");
  const isWeekly  = blockDays >= 7;

  for (const collaborator of state.collaborators) {
    for (let d = 0; d <= 6; d++) {
      const key      = buildCellKey(collaborator.id, d);
      const cellData = state.tasks[key];
      if (!cellData || !Array.isArray(cellData.items)) continue;
      if (!cellData.items.some((item) => item.team === team && item.taskId === taskId)) continue;
      const blocked = isWeekly || (dayIndex >= d && dayIndex < d + blockDays);
      if (!blocked) continue;
      return d === dayIndex
        ? collaborator.name
        : `${collaborator.name} (${DAYS[d]})`;
    }
  }
  return null;
}

// ── State ─────────────────────────────────────────────────────────────

function createInitialState() {
  return { collaborators: [], tasks: {} };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeState(JSON.parse(raw));
  } catch (_) {
    return null;
  }
}

function saveState(options = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!options.localOnly && !isApplyingRemoteState) queueRemoteSave();
}

function normalizeState(parsed) {
  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.collaborators)) return null;

  const collaborators = parsed.collaborators
    .filter((c) => c && typeof c.id === "string" && typeof c.name === "string")
    .map((c) => ({ id: c.id, name: c.name.trim() }))
    .filter((c) => c.name.length > 0);

  const sourceTasks = parsed.tasks && typeof parsed.tasks === "object" ? parsed.tasks : {};
  const tasks = {};
  const activeWeek = getActiveWeekMondayStr();

  for (const [key, value] of Object.entries(sourceTasks)) {
    if (!value || typeof value !== "object") continue;

    // Detect key format: old = "collabId__dayIndex" (2 parts), new = "week__collabId__dayIndex" (3 parts)
    const parts = key.split("__");
    const targetKey = parts.length === 2 ? `${activeWeek}__${key}` : key;

    // Formato nuevo: tiene array items
    if (Array.isArray(value.items)) {
      if (value.free) {
        tasks[targetKey] = { free: true, items: [] };
      } else {
        const items = value.items.map(normalizeTaskItem).filter(Boolean);
        if (items.length > 0) tasks[targetKey] = { free: false, items };
      }
      continue;
    }

    // Formato antiguo: { free } o { team, taskId, done }
    if (value.free) {
      tasks[targetKey] = { free: true, items: [] };
      continue;
    }
    const item = normalizeTaskItem(value);
    if (item) tasks[targetKey] = { free: false, items: [item] };
  }

  return { collaborators, tasks };
}

function normalizeTaskItem(value) {
  if (!value || typeof value !== "object") return null;
  const done = Boolean(value.done);
  const team = typeof value.team === "string" ? value.team.trim() : "";
  let taskId = typeof value.taskId === "string" ? value.taskId.trim() : "";
  const text = typeof value.text === "string" ? value.text.trim() : "";
  const colorKey = typeof value.colorKey === "string" ? value.colorKey.trim() : "";
  const id = typeof value.id === "string" ? value.id : createId();

  if (!taskId && team && text) taskId = findTaskIdByText(team, text);

  const completedAt      = typeof value.completedAt === "string" ? value.completedAt : undefined;
  const evidencePhotoUrl = typeof value.evidencePhotoUrl === "string" ? value.evidencePhotoUrl : undefined;
  const extra = { ...(completedAt ? { completedAt } : {}), ...(evidencePhotoUrl ? { evidencePhotoUrl } : {}) };

  if (taskId && findTask(team, taskId)) return { id, team, taskId, done, ...extra };
  if (text) return { id, team, taskId: "", text, colorKey: LEGEND[colorKey] ? colorKey : "none", done, ...extra };
  return null;
}

// ── Firebase sync ─────────────────────────────────────────────────────

function initRemoteSync() {
  if (!window.firebase || typeof firebase.initializeApp !== "function" || typeof firebase.database !== "function") {
    setSyncStatus("Modo local", "offline");
    return;
  }
  try {
    const app = firebase.apps && firebase.apps.length > 0 ? firebase.app() : firebase.initializeApp(FIREBASE_CONFIG);
    const database = firebase.database(app);
    remoteBoardRef = database.ref(REMOTE_BOARD_PATH);

    if (typeof firebase.storage === "function") {
      try { firebaseStorage = firebase.storage(app); } catch (_) {}
    }

    setSyncStatus("Conectando...", "busy");

    database.ref(".info/connected").on("value", (snap) => {
      setSyncStatus(snap.val() === true ? (hasRemoteSnapshot ? "Sincronizado" : "Conectado") : "Sin conexion",
                    snap.val() === true ? "online" : "offline");
    });

    remoteBoardRef.on("value", (snap) => {
      hasRemoteSnapshot = true;
      const remoteState = parseRemoteState(snap.val());
      if (!remoteState) {
        setSyncStatus("Subiendo datos iniciales...", "busy");
        queueRemoteSave({ immediate: true });
        return;
      }
      isApplyingRemoteState = true;
      state = remoteState;
      saveState({ localOnly: true });
      isApplyingRemoteState = false;
      updateTeamSelectors();
      renderTable();
      setSyncStatus("Sincronizado", "online");
    }, (err) => {
      console.error("Firebase sync error", err);
      setSyncStatus("Error de sincronizacion", "error");
    });
  } catch (err) {
    console.error("Firebase init error", err);
    setSyncStatus("Modo local", "offline");
  }
}

function parseRemoteState(value) {
  try {
    if (!value) return null;
    if (typeof value === "string") return normalizeState(JSON.parse(value));
    if (typeof value.stateJson === "string") return normalizeState(JSON.parse(value.stateJson));
    return normalizeState(value);
  } catch (_) {
    return null;
  }
}

function queueRemoteSave(options = {}) {
  if (!remoteBoardRef) return;
  window.clearTimeout(remoteSaveTimer);
  remoteSaveTimer = window.setTimeout(() => {
    setSyncStatus("Guardando...", "busy");
    remoteBoardRef.set({
      stateJson: JSON.stringify(state),
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    }).then(() => setSyncStatus("Sincronizado", "online"))
      .catch((err) => { console.error("Firebase save error", err); setSyncStatus("Error al guardar", "error"); });
  }, options.immediate ? 0 : SYNC_DEBOUNCE_MS);
}

function setSyncStatus(message, stateName) {
  if (!syncStatus) return;
  syncStatus.textContent = message;
  syncStatus.dataset.state = stateName || "busy";
}

// ── Render ────────────────────────────────────────────────────────────

function renderTable() {
  if (state.collaborators.length === 0) {
    scheduleBody.innerHTML = `
      <tr>
        <td class="row-name" colspan="${DAYS.length + 1}" style="padding:1rem;text-align:center;color:#7a8677;">
          No hay colaboradores. Agrega uno para iniciar.
        </td>
      </tr>`;
    return;
  }

  scheduleBody.innerHTML = state.collaborators.map((collaborator) => {
    const dayCells = DAYS.map((_, dayIndex) => {
      const key = buildCellKey(collaborator.id, dayIndex);
      const cellData = state.tasks[key];
      const isFree = Boolean(cellData && cellData.free);
      const items = (!isFree && cellData && Array.isArray(cellData.items)) ? cellData.items : [];
      const isSelected = Boolean(
        selectedCell &&
        selectedCell.collaboratorId === collaborator.id &&
        selectedCell.dayIndex === dayIndex
      );

      let statusClass = "";
      if (isFree) {
        statusClass = "free";
      } else if (items.length > 0) {
        statusClass = items.every((i) => i.done) ? "done" : "pending";
      }

      const weekendClass = dayIndex >= 5 ? "weekend" : "";
      const selectedClass = isSelected ? "selected" : "";

      let cellContent = "";
      if (isFree) {
        cellContent = `<span class="free-label">FREE</span>`;
      } else if (items.length > 0) {
        cellContent = items.map((item) => {
          const meta = resolveTaskMeta(item);
          const chipDone = item.done ? "chip-done" : "";
          return `<span class="task-chip ${chipDone}">${meta.legend.symbol} ${escapeHtml(trimText(meta.taskName, 16))} · ${escapeHtml(trimText(meta.team, 14))}</span>`;
        }).join("");
      } else {
        cellContent = `<span class="task-empty">+ Asignar tarea</span>`;
      }

      const titleParts = isFree
        ? ["FREE - colaborador libre"]
        : items.length > 0
        ? items.map((i) => { const m = resolveTaskMeta(i); return `${m.team}: ${m.taskName}`; })
        : ["Sin tarea"];

      return `
        <td class="task-cell ${weekendClass}" data-day-label="${escapeHtml(DAYS[dayIndex])}">
          <button
            type="button"
            class="cell-btn ${statusClass} ${selectedClass}"
            data-cell="1"
            data-collaborator="${collaborator.id}"
            data-day="${dayIndex}"
            title="${escapeHtml(titleParts.join(" | "))}"
          >${cellContent}</button>
        </td>`;
    }).join("");

    return `
      <tr>
        <td class="row-name">
          <div class="name-wrap">
            <span>${escapeHtml(collaborator.name)}</span>
            <button type="button" class="remove-btn"
              data-remove-collaborator="${collaborator.id}"
              title="Eliminar colaborador"
              aria-label="Eliminar colaborador ${escapeHtml(collaborator.name)}">x</button>
          </div>
        </td>
        ${dayCells}
      </tr>`;
  }).join("");
}

// ── Selectors ─────────────────────────────────────────────────────────

function updateTeamSelectors() {
  const teams = collectTeamsFromState();
  setSelectOptions(
    taskTeam,
    [{ value: "", label: "Seleccionar equipo" }, ...teams.map((t) => ({ value: t, label: t }))],
    taskTeam.value
  );
}


function collectTeamsFromState() {
  const known = new Set(TEAM_NAMES);
  const extra = [];
  for (const cellData of Object.values(state.tasks)) {
    if (!cellData || !Array.isArray(cellData.items)) continue;
    for (const item of cellData.items) {
      if (typeof item.team === "string" && item.team && !known.has(item.team)) {
        known.add(item.team);
        extra.push(item.team);
      }
    }
  }
  return [...TEAM_NAMES, ...extra];
}

function setSelectOptions(el, options, currentValue) {
  const selected = options.some((o) => o.value === currentValue) ? currentValue : options[0].value;
  el.innerHTML = "";
  for (const o of options) {
    const opt = document.createElement("option");
    opt.value = o.value;
    opt.textContent = o.label;
    el.append(opt);
  }
  el.value = selected;
}

// ── Helpers ───────────────────────────────────────────────────────────

function resolveTaskMeta(item) {
  const team = item.team && item.team.trim() ? item.team.trim() : "Sin equipo";
  const task = findTask(team, item.taskId);
  if (task) return { team, taskName: task.name, legend: LEGEND[task.color] || LEGEND.none };
  const fallback = item.text && item.text.trim() ? item.text.trim() : "Tarea sin catalogo";
  const colorKey = LEGEND[item.colorKey] ? item.colorKey : "none";
  return { team, taskName: fallback, legend: LEGEND[colorKey] };
}

function findTask(team, taskId) {
  if (!team || !taskId) return null;
  return TASK_INDEX.get(`${team}__${taskId}`) || null;
}

function findTaskIdByText(team, text) {
  if (!hasTeam(team) || !text) return "";
  const target = normalizeText(text);
  if (!target) return "";
  for (const task of TASK_LIBRARY[team]) {
    const candidate = normalizeText(task.name);
    if (candidate === target || candidate.includes(target) || target.includes(candidate)) return task.id;
  }
  return "";
}

function normalizeText(value) {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function hasTeam(team) {
  return Object.prototype.hasOwnProperty.call(TASK_LIBRARY, team);
}

function buildTaskIndex() {
  const map = new Map();
  for (const [team, tasks] of Object.entries(TASK_LIBRARY)) {
    for (const task of tasks) map.set(`${team}__${task.id}`, task);
  }
  return map;
}

function buildCellKey(collaboratorId, dayIndex) {
  return `${currentWeekStart}__${collaboratorId}__${dayIndex}`;
}

function trimText(value, maxLength) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`;
}

function createId() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

// Returns "YYYY-MM-DD" of the active week's Monday.
// If today is Sunday at or after 05:00, the active week is next week.
function getActiveWeekMondayStr() {
  const now  = new Date();
  const day  = now.getDay(); // 0 = Sunday
  const isLateNightSunday = day === 0 && now.getHours() >= 5;
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday + (isLateNightSunday ? 7 : 0));
  monday.setHours(0, 0, 0, 0);
  return mondayToStr(monday);
}

function mondayToStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function strToMonday(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function navigateWeek(delta) {
  const monday = strToMonday(currentWeekStart);
  monday.setDate(monday.getDate() + delta * 7);
  currentWeekStart = mondayToStr(monday);
  isOnAutoWeek = currentWeekStart === getActiveWeekMondayStr();
  renderWeekLabel();
  renderTable();
}

function renderWeekLabel() {
  const monday = strToMonday(currentWeekStart);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  };
  const el = document.getElementById("week-range");
  if (el) el.textContent = `Del ${fmt(monday)} Hasta ${fmt(sunday)}`;
}

function getWeekFolderLabel() {
  const monday = strToMonday(currentWeekStart);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `${fmt(monday)} - ${fmt(sunday)}`;
}

function renderRealizadasPanel() {
  const monday = strToMonday(currentWeekStart);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  };
  if (realizadasWeekLbl) realizadasWeekLbl.textContent = `${fmt(monday)} – ${fmt(sunday)}`;

  const groups = [];
  for (const collab of state.collaborators) {
    const doneTasks = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const key = buildCellKey(collab.id, dayIndex);
      const cellData = state.tasks[key];
      if (!cellData || !Array.isArray(cellData.items)) continue;
      for (const item of cellData.items) {
        if (!item.done) continue;
        doneTasks.push({ item, dayIndex, meta: resolveTaskMeta(item) });
      }
    }
    if (doneTasks.length > 0) groups.push({ collab, doneTasks });
  }

  if (groups.length === 0) {
    realizadasBody.innerHTML = '<p class="realizadas-empty">No hay tareas realizadas esta semana.</p>';
    return;
  }

  realizadasBody.innerHTML = groups.map(({ collab, doneTasks }) => {
    const rows = doneTasks.map(({ item, dayIndex, meta }) => {
      const timeStr = item.completedAt
        ? new Date(item.completedAt).toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" })
        : "";
      const thumbHtml = item.evidencePhotoUrl
        ? `<a href="${escapeHtml(item.evidencePhotoUrl)}" target="_blank" rel="noopener">
             <img src="${escapeHtml(item.evidencePhotoUrl)}" class="realizadas-thumb" alt="Evidencia" loading="lazy">
           </a>`
        : `<span class="realizadas-no-photo">Sin foto</span>`;
      return `
        <div class="realizadas-row">
          <div class="realizadas-row-info">
            <span class="realizadas-day">${escapeHtml(DAYS[dayIndex])}</span>
            <span class="realizadas-task">${meta.legend.symbol} ${escapeHtml(meta.taskName)} &middot; ${escapeHtml(meta.team)}</span>
            ${timeStr ? `<span class="realizadas-time">${escapeHtml(timeStr)}</span>` : ""}
          </div>
          ${thumbHtml}
        </div>`;
    }).join("");
    return `
      <div class="realizadas-group">
        <div class="realizadas-collab-name">${escapeHtml(collab.name)}</div>
        ${rows}
      </div>`;
  }).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
