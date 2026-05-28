const DAYS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
const STORAGE_KEY = "sharp_limpieza_board_v3";
const PREVIOUS_STORAGE_KEYS = ["sharp_limpieza_board_v2", "sharp_limpieza_board_v1"];
const REMOTE_BOARD_PATH = "boards/main";
const SYNC_DEBOUNCE_MS = 250;

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
  red: {
    symbol: "\uD83D\uDFE5",
    label: "Debe ser cada 1 dia",
    short: "Cada 1 dia",
    css: "lg-red"
  },
  orange: {
    symbol: "\uD83D\uDFE7",
    label: "Debe ser cada 3 dias",
    short: "Cada 3 dias",
    css: "lg-orange"
  },
  yellow: {
    symbol: "\uD83D\uDFE8",
    label: "Puede ser cada 4 dias",
    short: "Cada 4 dias",
    css: "lg-yellow"
  },
  green: {
    symbol: "\uD83D\uDFE9",
    label: "Puede ser una semana (mas trabajo)",
    short: "Semanal (mas trabajo)",
    css: "lg-green"
  },
  purple: {
    symbol: "\uD83D\uDFEA",
    label: "Puede ser una semana (+)",
    short: "Semanal (+)",
    css: "lg-purple"
  },
  none: {
    symbol: "\u26AA",
    label: "Sin color definido en PDF",
    short: "Sin color",
    css: "lg-none"
  }
};

const TASK_LIBRARY = {
  Freidora: [
    { id: "canastas", name: "Canastas", color: "orange" },
    { id: "tapas", name: "Tapas", color: "red" },
    { id: "puertas", name: "Puertas", color: "red" },
    { id: "tubo-drenaje", name: "Tubo de Drenaje", color: "red" },
    { id: "laterales", name: "Laterales", color: "red" },
    { id: "parte-atras", name: "Parte atras", color: "orange" },
    { id: "filtrar-aceite", name: "Filtrar y limpiar el aceite", color: "orange" },
    { id: "limpieza-interior", name: "Limpieza interior", color: "yellow" },
    { id: "ruedas", name: "Ruedas", color: "purple" },
    { id: "planchas-laterales", name: "Planchas laterales", color: "yellow" },
    { id: "tuberia", name: "Tuberia", color: "yellow" },
    { id: "paredes-izq-trasera", name: "Pared izquierda y pared trasera", color: "orange" }
  ],
  Plancha: [
    { id: "laterales", name: "Laterales", color: "red" },
    { id: "mesa", name: "Mesa", color: "red" },
    { id: "patas", name: "Patas", color: "red" },
    { id: "parte-atras", name: "Parte atras", color: "purple" },
    { id: "cuberteria-utensilios", name: "Cuberteria (Donde se ponen los utensilios)", color: "red" },
    { id: "pared-trasera", name: "Pared trasera", color: "none" },
    { id: "tuberia", name: "Tuberia", color: "yellow" },
    { id: "botones", name: "Botones", color: "red" }
  ],
  Grill: [
    { id: "hornillas", name: "Hornillas", color: "red" },
    { id: "malla", name: "Malla", color: "orange" },
    { id: "quemadores", name: "Quemadores", color: "green" },
    { id: "carcaza", name: "Carcaza", color: "purple" },
    { id: "laterales", name: "Laterales", color: "red" },
    { id: "parte-atras", name: "Parte atras", color: "yellow" },
    { id: "patas", name: "Patas", color: "red" },
    { id: "plancha", name: "Plancha", color: "red" },
    { id: "botones", name: "Botones", color: "red" },
    { id: "tuberia", name: "Tuberia", color: "yellow" },
    { id: "mesa", name: "Mesa", color: "red" },
    { id: "cuberteria-utensilios", name: "Cuberteria (Donde se ponen los utensilios)", color: "red" }
  ],
  Estufa: [
    { id: "hornillas", name: "Hornillas", color: "red" },
    { id: "quemadores", name: "Quemadores", color: "yellow" },
    { id: "plancha", name: "Plancha", color: "red" },
    { id: "carcaza", name: "Carcaza", color: "purple" },
    { id: "mesa", name: "Mesa", color: "red" },
    { id: "botones", name: "Botones", color: "red" },
    { id: "tuberia", name: "Tuberia", color: "yellow" },
    { id: "interior", name: "Interior", color: "purple" }
  ],
  "Bano Maria": [
    { id: "cuerpo", name: "Cuerpo", color: "red" },
    { id: "bocas", name: "Bocas", color: "red" },
    { id: "cuberteria", name: "Cuberteria", color: "red" },
    { id: "cheffin", name: "Cheffin", color: "red" },
    { id: "botones", name: "Botones", color: "red" },
    { id: "microondas", name: "Microondas", color: "red" },
    { id: "mesa-microondas", name: "Mesa del microondas", color: "none" },
    { id: "mesa-pilon", name: "Mesa de Pilon", color: "red" },
    { id: "pilones", name: "Pilones", color: "red" },
    { id: "mano-pilon", name: "Mano de Pilon", color: "red" }
  ],
  "Nevera 1": [
    { id: "nevera", name: "Nevera", color: "yellow" },
    { id: "limpieza-interior", name: "Limpieza interior", color: "purple" },
    { id: "limpieza-exterior", name: "Limpieza exterior", color: "orange" },
    { id: "organizacion", name: "Organizacion", color: "red" },
    { id: "cambio-cambros", name: "Limpieza y cambio de cambros plasticos (Si amerita)", color: "red" }
  ],
  "Nevera 2": [
    { id: "nevera", name: "Nevera", color: "yellow" },
    { id: "limpieza-interior", name: "Limpieza interior", color: "purple" },
    { id: "limpieza-exterior", name: "Limpieza exterior", color: "orange" },
    { id: "organizacion", name: "Organizacion", color: "red" },
    { id: "cambio-cambros", name: "Limpieza y cambio de cambros plasticos (Si amerita)", color: "red" }
  ],
  "Nevera 3": [
    { id: "nevera", name: "Nevera", color: "yellow" },
    { id: "limpieza-interior", name: "Limpieza interior", color: "purple" },
    { id: "limpieza-exterior", name: "Limpieza exterior", color: "orange" },
    { id: "organizacion", name: "Organizacion", color: "red" },
    { id: "cambio-cambros", name: "Limpieza y cambio de cambros plasticos (Si amerita)", color: "red" }
  ],
  "Mesa de trabajo trasera": [
    { id: "limpieza-completa", name: "Limpieza de mesa completa, exterior y interior", color: "purple" },
    { id: "organizar-productos", name: "Organizar y limpiar productos colocados", color: "red" },
    { id: "boca-biberones", name: "Boca de Biberones", color: "red" },
    { id: "etiquetar-cambros", name: "Etiquetar y fechar cambros en nevera 1", color: "yellow" }
  ],
  Zafacones: [
    { id: "todos-zafacones", name: "Todos los Zafacones", color: "red" },
    { id: "interior-exterior", name: "Interior y exterior", color: "red" }
  ],
  "Mesa de despacho": [
    { id: "mesa-despacho", name: "Mesa de despacho", color: "red" },
    { id: "lamparas", name: "Lamparas", color: "none" },
    { id: "bebedero", name: "Bebedero", color: "purple" },
    { id: "canastas-vegetales", name: "Canastas de vegetales", color: "orange" },
    { id: "escalera", name: "Escalera", color: "purple" },
    { id: "planchas-nevera2", name: "Planchas encima de nevera 2", color: "purple" },
    { id: "plancha-nevera3", name: "Plancha encima de nevera 3", color: "purple" }
  ],
  Piso: [
    { id: "cepillado-desgrasante", name: "Cepillado con jabon y Desgrasante", color: "red" }
  ]
};

const TEAM_NAMES = Object.keys(TASK_LIBRARY);
const TASK_INDEX = buildTaskIndex();

const collaboratorForm = document.getElementById("collaborator-form");
const collaboratorInput = document.getElementById("collaborator-name");
const scheduleBody = document.getElementById("schedule-body");
const loadExampleButton = document.getElementById("load-example");
const syncStatus = document.getElementById("sync-status");
const editorBackdrop = document.getElementById("editor-backdrop");
const editorTitle = document.getElementById("editor-title");
const editorSubtitle = document.getElementById("editor-subtitle");
const editorTeam = document.getElementById("editor-team");
const editorTaskList = document.getElementById("editor-task-list");
const editorCloseButton = document.getElementById("editor-close");
const editorCancelButton = document.getElementById("editor-cancel");
const editorClearButton = document.getElementById("editor-clear");
const editorSaveButton = document.getElementById("editor-save");

let state = loadState() || createExampleState();
let selectedCell = null;
let selectedEditorTeam = TEAM_NAMES[0] || "";
let remoteBoardRef = null;
let remoteSaveTimer = null;
let isApplyingRemoteState = false;
let hasRemoteSnapshot = false;

renderAll();
initRemoteSync();

collaboratorForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = collaboratorInput.value.trim();
  if (!name) {
    collaboratorInput.focus();
    return;
  }

  state.collaborators.push({
    id: createId(),
    name
  });

  collaboratorInput.value = "";
  saveState();
  renderAll();
});

scheduleBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const removeBtn = target.closest("[data-remove-collaborator]");
  if (removeBtn) {
    removeCollaborator(removeBtn.getAttribute("data-remove-collaborator"));
    return;
  }

  const cellBtn = target.closest("[data-cell]");
  if (!cellBtn) {
    return;
  }

  const collaboratorId = cellBtn.getAttribute("data-collaborator");
  const dayIndex = Number(cellBtn.getAttribute("data-day"));
  if (!collaboratorId || Number.isNaN(dayIndex)) {
    return;
  }

  openTaskEditor(collaboratorId, dayIndex);
});

loadExampleButton.addEventListener("click", () => {
  const ok = window.confirm("Esto reemplazara la data actual. Quieres continuar?");
  if (!ok) {
    return;
  }

  state = createExampleState();
  selectedCell = null;
  closeTaskEditor();
  saveState();
  renderAll();
});

editorTeam.addEventListener("change", () => {
  selectedEditorTeam = editorTeam.value;
  renderEditorTasks();
});

editorCloseButton.addEventListener("click", closeTaskEditor);
editorCancelButton.addEventListener("click", closeTaskEditor);

editorBackdrop.addEventListener("click", (event) => {
  if (event.target === editorBackdrop) {
    closeTaskEditor();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isEditorOpen()) {
    closeTaskEditor();
  }
});

editorClearButton.addEventListener("click", () => {
  if (!selectedCell) {
    return;
  }

  delete state.tasks[getSelectedCellKey()];
  saveState();
  renderAll();
});

editorSaveButton.addEventListener("click", () => {
  saveEditorSelection();
});

function createExampleState() {
  const collaborators = ["Daniela", "Victor", "Erick", "Sabrina", "Jhonn"].map((name) => ({
    id: createId(),
    name
  }));

  const tasks = {};
  putTask(tasks, collaborators[0].id, 1, "Freidora", "canastas", false);
  putTask(tasks, collaborators[1].id, 0, "Estufa", "hornillas", false);
  putTask(tasks, collaborators[2].id, 2, "Plancha", "mesa", false);
  putTask(tasks, collaborators[3].id, 3, "Freidora", "tuberia", true);
  putTask(tasks, collaborators[4].id, 2, "Grill", "malla", false);

  return { collaborators, tasks };
}

function putTask(tasks, collaboratorId, dayIndex, team, taskId, done) {
  const key = buildCellKey(collaboratorId, dayIndex);
  const currentItems = getAssignmentItems(tasks[key]);
  tasks[key] = {
    items: dedupeAssignmentItems([
      ...currentItems,
      { team, taskId, done: Boolean(done) }
    ])
  };
}

function removeCollaborator(collaboratorId) {
  if (!collaboratorId) {
    return;
  }

  const collaborator = state.collaborators.find((item) => item.id === collaboratorId);
  if (!collaborator) {
    return;
  }

  const ok = window.confirm(`Eliminar a ${collaborator.name} del calendario?`);
  if (!ok) {
    return;
  }

  state.collaborators = state.collaborators.filter((item) => item.id !== collaboratorId);

  for (const key of Object.keys(state.tasks)) {
    if (key.startsWith(`${collaboratorId}__`)) {
      delete state.tasks[key];
    }
  }

  if (selectedCell && selectedCell.collaboratorId === collaboratorId) {
    selectedCell = null;
    closeTaskEditor();
  }

  saveState();
  renderAll();
}

function openTaskEditor(collaboratorId, dayIndex) {
  selectedCell = { collaboratorId, dayIndex };
  selectedEditorTeam = chooseInitialEditorTeam();
  editorBackdrop.hidden = false;
  document.body.classList.add("modal-open");
  renderAll();
  editorTeam.focus();
}

function closeTaskEditor() {
  editorBackdrop.hidden = true;
  document.body.classList.remove("modal-open");
  renderTable();
}

function isEditorOpen() {
  return !editorBackdrop.hidden;
}

function saveEditorSelection() {
  if (!selectedCell) {
    return;
  }

  const team = editorTeam.value;
  if (!hasTeam(team)) {
    window.alert("Selecciona un equipo primero.");
    return;
  }

  const cellKey = getSelectedCellKey();
  const assignmentsByTask = collectAssignmentsByTask();
  const checkedInputs = editorTaskList.querySelectorAll('input[type="checkbox"]:checked:not(:disabled)');
  const selectedIds = [...checkedInputs].map((input) => input.value);
  const currentItems = getCellItems(cellKey);
  const currentTeamItems = currentItems.filter((item) => item.team === team);
  const otherTeamItems = currentItems.filter((item) => item.team !== team);
  const existingByTask = new Map(currentTeamItems.map((item) => [item.taskId, item]));
  const selectedTeamItems = [];

  for (const taskId of selectedIds) {
    const lockKey = buildTaskLockKey(team, taskId);
    const lockedElsewhere = (assignmentsByTask.get(lockKey) || []).some((assignment) => (
      assignment.cellKey !== cellKey
    ));

    if (lockedElsewhere || !findTask(team, taskId)) {
      continue;
    }

    const existing = existingByTask.get(taskId);
    selectedTeamItems.push({
      team,
      taskId,
      done: existing ? Boolean(existing.done) : false
    });
  }

  setCellItems(cellKey, [...otherTeamItems, ...selectedTeamItems]);
  saveState();
  renderAll();
  closeTaskEditor();
}

function loadState() {
  try {
    const keys = [STORAGE_KEY, ...PREVIOUS_STORAGE_KEYS];
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw) {
        continue;
      }

      const parsed = normalizeState(JSON.parse(raw));
      if (parsed) {
        return parsed;
      }
    }

    return null;
  } catch (_) {
    return null;
  }
}

function saveState(options = {}) {
  saveLocalState();

  if (!options.localOnly && !isApplyingRemoteState) {
    queueRemoteSave();
  }
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  for (const key of PREVIOUS_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}

function normalizeState(parsed) {
  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.collaborators)) {
    return null;
  }

  const sourceTasks = parsed.tasks && typeof parsed.tasks === "object" ? parsed.tasks : {};
  const collaborators = parsed.collaborators
    .filter((item) => item && typeof item.id === "string" && typeof item.name === "string")
    .map((item) => ({ id: item.id, name: item.name.trim() }))
    .filter((item) => item.name.length > 0);
  const collaboratorIds = new Set(collaborators.map((item) => item.id));
  const tasks = {};

  for (const [key, value] of Object.entries(sourceTasks)) {
    if (!collaboratorIds.has(parseCellKey(key).collaboratorId)) {
      continue;
    }

    const assignment = normalizeAssignment(value);
    if (assignment) {
      tasks[key] = assignment;
    }
  }

  return { collaborators, tasks };
}

function normalizeAssignment(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const text = typeof value.text === "string" ? value.text.trim() : "";
  if (Boolean(value.free) || normalizeText(text) === "free") {
    return { free: true };
  }

  const sourceItems = Array.isArray(value.items) ? value.items : [value];
  const items = dedupeAssignmentItems(sourceItems.map(normalizeTaskItem).filter(Boolean));

  return items.length > 0 ? { items } : null;
}

function normalizeTaskItem(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const done = Boolean(value.done);
  const team = typeof value.team === "string" ? value.team.trim() : "";
  let taskId = typeof value.taskId === "string" ? value.taskId.trim() : "";
  const text = typeof value.text === "string" ? value.text.trim() : "";
  const colorKey = typeof value.colorKey === "string" && LEGEND[value.colorKey]
    ? value.colorKey
    : "none";

  if (team && !taskId && text) {
    taskId = findTaskIdByText(team, text);
  }

  if (team && taskId && findTask(team, taskId)) {
    return { team, taskId, done };
  }

  if (text) {
    return {
      team: team || "Sin equipo",
      text,
      colorKey,
      done
    };
  }

  return null;
}

function initRemoteSync() {
  if (!window.firebase || typeof firebase.initializeApp !== "function" || typeof firebase.database !== "function") {
    setSyncStatus("Modo local", "offline");
    return;
  }

  try {
    const app = firebase.apps && firebase.apps.length > 0
      ? firebase.app()
      : firebase.initializeApp(FIREBASE_CONFIG);
    const database = firebase.database(app);
    remoteBoardRef = database.ref(REMOTE_BOARD_PATH);
    setSyncStatus("Conectando...", "busy");

    database.ref(".info/connected").on("value", (snapshot) => {
      if (snapshot.val() === true) {
        setSyncStatus(hasRemoteSnapshot ? "Sincronizado" : "Conectado", "online");
      } else {
        setSyncStatus("Sin conexion", "offline");
      }
    });

    remoteBoardRef.on("value", (snapshot) => {
      hasRemoteSnapshot = true;
      const remoteState = parseRemoteState(snapshot.val());

      if (!remoteState) {
        setSyncStatus("Subiendo datos iniciales...", "busy");
        queueRemoteSave({ immediate: true });
        return;
      }

      isApplyingRemoteState = true;
      state = remoteState;
      saveState({ localOnly: true });
      isApplyingRemoteState = false;
      renderAll();
      setSyncStatus("Sincronizado", "online");
    }, (error) => {
      console.error("Firebase sync error", error);
      setSyncStatus("Error de sincronizacion", "error");
    });
  } catch (error) {
    console.error("Firebase init error", error);
    setSyncStatus("Modo local", "offline");
  }
}

function parseRemoteState(value) {
  try {
    if (!value) {
      return null;
    }
    if (typeof value === "string") {
      return normalizeState(JSON.parse(value));
    }
    if (typeof value.stateJson === "string") {
      return normalizeState(JSON.parse(value.stateJson));
    }
    return normalizeState(value);
  } catch (_) {
    return null;
  }
}

function queueRemoteSave(options = {}) {
  if (!remoteBoardRef) {
    return;
  }

  window.clearTimeout(remoteSaveTimer);
  const delay = options.immediate ? 0 : SYNC_DEBOUNCE_MS;
  remoteSaveTimer = window.setTimeout(() => {
    setSyncStatus("Guardando...", "busy");
    remoteBoardRef.set({
      stateJson: JSON.stringify(state),
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
      setSyncStatus("Sincronizado", "online");
    }).catch((error) => {
      console.error("Firebase save error", error);
      setSyncStatus("Error al guardar", "error");
    });
  }, delay);
}

function setSyncStatus(message, stateName) {
  if (!syncStatus) {
    return;
  }
  syncStatus.textContent = message;
  syncStatus.dataset.state = stateName || "busy";
}

function renderAll() {
  validateSelectedCell();
  renderTable();

  if (isEditorOpen()) {
    renderEditor();
  }
}

function renderTable() {
  if (state.collaborators.length === 0) {
    scheduleBody.innerHTML = `
      <tr>
        <td class="row-name" colspan="${DAYS.length + 1}">
          No hay colaboradores. Agrega uno para iniciar.
        </td>
      </tr>
    `;
    return;
  }

  const rows = state.collaborators.map((collaborator) => {
    const dayCells = DAYS.map((day, dayIndex) => buildDayCellHtml(collaborator, day, dayIndex)).join("");

    return `
      <tr>
        <td class="row-name">
          <div class="name-wrap">
            <span>${escapeHtml(collaborator.name)}</span>
            <button
              type="button"
              class="remove-btn"
              data-remove-collaborator="${escapeHtml(collaborator.id)}"
              title="Eliminar colaborador"
              aria-label="Eliminar colaborador ${escapeHtml(collaborator.name)}"
            >
              x
            </button>
          </div>
        </td>
        ${dayCells}
      </tr>
    `;
  }).join("");

  scheduleBody.innerHTML = rows;
}

function buildDayCellHtml(collaborator, day, dayIndex) {
  const key = buildCellKey(collaborator.id, dayIndex);
  const assignment = state.tasks[key];
  const items = getAssignmentItems(assignment);
  const isFree = Boolean(assignment && assignment.free);
  const isSelected = Boolean(
    selectedCell &&
    selectedCell.collaboratorId === collaborator.id &&
    selectedCell.dayIndex === dayIndex
  );
  const hasItems = items.length > 0;
  const allDone = hasItems && items.every((item) => item.done);
  const statusClass = isFree ? "free" : hasItems ? allDone ? "done" : "pending" : "";
  const selectedClass = isSelected ? "selected" : "";
  const cellClass = hasItems || isFree ? "has-task" : "";
  const title = buildCellTitle(assignment, items);

  return `
    <td class="task-cell ${cellClass}" data-day-label="${escapeHtml(day)}">
      <button
        type="button"
        class="cell-btn ${statusClass} ${selectedClass}"
        data-cell="1"
        data-collaborator="${escapeHtml(collaborator.id)}"
        data-day="${dayIndex}"
        title="${escapeHtml(title)}"
      >
        ${buildCellContentHtml(assignment, items)}
      </button>
    </td>
  `;
}

function buildCellContentHtml(assignment, items) {
  if (assignment && assignment.free) {
    return `
      <span class="free-label">FREE</span>
      <span class="status-preview">Colaborador libre</span>
    `;
  }

  if (items.length === 0) {
    return `
      <span class="task-preview">Asignar tarea</span>
      <span class="status-preview">Sin tarea</span>
    `;
  }

  const chips = items.map((item) => {
    const meta = resolveTaskMeta(item);
    const doneClass = item.done ? "chip-done" : "";

    return `
      <span class="task-chip chip-locked ${doneClass}">
        ${meta.legend.symbol} ${escapeHtml(trimText(meta.taskName, 24))} &middot; ${escapeHtml(meta.team)}
      </span>
    `;
  }).join("");

  return `<span class="task-chip-list">${chips}</span>`;
}

function buildCellTitle(assignment, items) {
  if (assignment && assignment.free) {
    return "FREE - colaborador libre";
  }

  if (items.length === 0) {
    return "Sin tarea";
  }

  return items.map((item) => {
    const meta = resolveTaskMeta(item);
    return `${meta.team}: ${meta.taskName}`;
  }).join(" | ");
}

function renderEditor() {
  if (!selectedCell) {
    closeTaskEditor();
    return;
  }

  const collaborator = findCollaborator(selectedCell.collaboratorId);
  if (!collaborator) {
    selectedCell = null;
    closeTaskEditor();
    return;
  }

  editorTitle.textContent = "Editar casilla";
  editorSubtitle.textContent = `${collaborator.name} - ${DAYS[selectedCell.dayIndex]}`;

  setSelectOptions(
    editorTeam,
    TEAM_NAMES.map((team) => ({ value: team, label: team })),
    selectedEditorTeam
  );

  selectedEditorTeam = editorTeam.value;
  renderEditorTasks();
}

function renderEditorTasks() {
  if (!selectedCell) {
    editorTaskList.innerHTML = "";
    return;
  }

  const team = editorTeam.value;
  if (!hasTeam(team)) {
    editorTaskList.innerHTML = `<p class="empty-text">No hay equipo seleccionado.</p>`;
    return;
  }

  const cellKey = getSelectedCellKey();
  const currentItems = getCellItems(cellKey);
  const currentTaskIds = new Set(
    currentItems
      .filter((item) => item.team === team && item.taskId)
      .map((item) => item.taskId)
  );
  const assignmentsByTask = collectAssignmentsByTask();
  const tasks = TASK_LIBRARY[team] || [];

  editorTaskList.innerHTML = tasks.map((task) => {
    const lockKey = buildTaskLockKey(team, task.id);
    const taskAssignments = assignmentsByTask.get(lockKey) || [];
    const assignedOutside = taskAssignments.find((assignment) => assignment.cellKey !== cellKey);
    const assignedHere = currentTaskIds.has(task.id);
    const checked = assignedHere || Boolean(assignedOutside);
    const disabled = Boolean(assignedOutside) && !assignedHere;
    const legend = LEGEND[task.color] || LEGEND.none;
    const itemClasses = [
      "checklist-item",
      disabled ? "checklist-item-assigned" : "",
      assignedHere ? "checklist-item-current" : ""
    ].filter(Boolean).join(" ");
    const assignee = disabled ? assignedOutside.collaboratorName : assignedHere ? "Esta casilla" : "";
    const assigneeTitle = disabled
      ? `${assignedOutside.collaboratorName} - ${assignedOutside.dayName}`
      : assignedHere
      ? "Asignada en esta casilla"
      : "";

    return `
      <label class="${itemClasses}" title="${escapeHtml(assigneeTitle)}">
        <input
          type="checkbox"
          value="${escapeHtml(task.id)}"
          ${checked ? "checked" : ""}
          ${disabled ? "disabled" : ""}
        >
        <span>${legend.symbol}</span>
        <span class="checklist-name">${escapeHtml(task.name)}</span>
        <span class="checklist-assignee">${escapeHtml(assignee)}</span>
        <span class="checklist-freq">${escapeHtml(legend.short)}</span>
      </label>
    `;
  }).join("");
}

function chooseInitialEditorTeam() {
  if (!selectedCell) {
    return TEAM_NAMES[0] || "";
  }

  const currentItems = getCellItems(getSelectedCellKey());
  const firstKnownTeam = currentItems.find((item) => hasTeam(item.team));

  if (firstKnownTeam) {
    return firstKnownTeam.team;
  }

  if (hasTeam(selectedEditorTeam)) {
    return selectedEditorTeam;
  }

  return TEAM_NAMES[0] || "";
}

function validateSelectedCell() {
  if (!selectedCell) {
    return;
  }

  const collaboratorExists = state.collaborators.some((item) => item.id === selectedCell.collaboratorId);
  const dayExists = selectedCell.dayIndex >= 0 && selectedCell.dayIndex < DAYS.length;

  if (!collaboratorExists || !dayExists) {
    selectedCell = null;
    closeTaskEditor();
  }
}

function collectAssignmentsByTask() {
  const assignmentsByTask = new Map();
  const collaboratorsById = new Map(state.collaborators.map((item) => [item.id, item]));

  for (const [cellKey, assignment] of Object.entries(state.tasks)) {
    const parsedKey = parseCellKey(cellKey);
    const collaborator = collaboratorsById.get(parsedKey.collaboratorId);
    if (!collaborator) {
      continue;
    }

    for (const item of getAssignmentItems(assignment)) {
      if (!item.team || !item.taskId) {
        continue;
      }

      const lockKey = buildTaskLockKey(item.team, item.taskId);
      const list = assignmentsByTask.get(lockKey) || [];
      list.push({
        cellKey,
        collaboratorId: collaborator.id,
        collaboratorName: collaborator.name,
        dayIndex: parsedKey.dayIndex,
        dayName: DAYS[parsedKey.dayIndex] || "",
        team: item.team,
        taskId: item.taskId
      });
      assignmentsByTask.set(lockKey, list);
    }
  }

  return assignmentsByTask;
}

function getSelectedCellKey() {
  return buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
}

function getCellItems(cellKey) {
  return getAssignmentItems(state.tasks[cellKey]);
}

function getAssignmentItems(assignment) {
  if (!assignment || typeof assignment !== "object" || assignment.free) {
    return [];
  }

  if (Array.isArray(assignment.items)) {
    return assignment.items;
  }

  if (assignment.team || assignment.taskId || assignment.text) {
    return [assignment];
  }

  return [];
}

function setCellItems(cellKey, items) {
  const normalizedItems = dedupeAssignmentItems(items);

  if (normalizedItems.length === 0) {
    delete state.tasks[cellKey];
    return;
  }

  state.tasks[cellKey] = { items: normalizedItems };
}

function dedupeAssignmentItems(items) {
  const unique = [];
  const seen = new Set();

  for (const item of items) {
    const normalized = normalizeTaskItem(item);
    if (!normalized) {
      continue;
    }

    const key = normalized.taskId
      ? buildTaskLockKey(normalized.team, normalized.taskId)
      : `${normalized.team}__${normalizeText(normalized.text)}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(normalized);
  }

  return unique;
}

function findCollaborator(collaboratorId) {
  return state.collaborators.find((item) => item.id === collaboratorId) || null;
}

function resolveTaskMeta(item) {
  const team = item.team && item.team.trim() ? item.team.trim() : "Sin equipo";
  const task = findTask(team, item.taskId);

  if (task) {
    const legend = LEGEND[task.color] || LEGEND.none;
    return {
      team,
      taskName: task.name,
      legend
    };
  }

  const fallbackText = item.text && item.text.trim()
    ? item.text.trim()
    : "Tarea sin catalogo";
  const colorKey = LEGEND[item.colorKey] ? item.colorKey : "none";
  return {
    team,
    taskName: fallbackText,
    legend: LEGEND[colorKey]
  };
}

function findTask(team, taskId) {
  if (!team || !taskId) {
    return null;
  }
  return TASK_INDEX.get(buildTaskLockKey(team, taskId)) || null;
}

function findTaskIdByText(team, text) {
  if (!hasTeam(team) || !text) {
    return "";
  }

  const normalizedTarget = normalizeText(text);
  if (!normalizedTarget) {
    return "";
  }

  for (const task of TASK_LIBRARY[team]) {
    const candidate = normalizeText(task.name);
    if (
      candidate === normalizedTarget ||
      candidate.includes(normalizedTarget) ||
      normalizedTarget.includes(candidate)
    ) {
      return task.id;
    }
  }

  return "";
}

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function hasTeam(team) {
  return Object.prototype.hasOwnProperty.call(TASK_LIBRARY, team);
}

function buildTaskIndex() {
  const map = new Map();
  for (const [team, tasks] of Object.entries(TASK_LIBRARY)) {
    for (const task of tasks) {
      map.set(buildTaskLockKey(team, task.id), task);
    }
  }
  return map;
}

function buildTaskLockKey(team, taskId) {
  return `${team}__${taskId}`;
}

function buildCellKey(collaboratorId, dayIndex) {
  return `${collaboratorId}__${dayIndex}`;
}

function parseCellKey(cellKey) {
  const [collaboratorId = "", dayValue = ""] = String(cellKey).split("__");
  return {
    collaboratorId,
    dayIndex: Number(dayValue)
  };
}

function setSelectOptions(selectElement, options, currentValue) {
  const selectedValue = options.some((option) => option.value === currentValue)
    ? currentValue
    : options[0]?.value || "";

  selectElement.innerHTML = "";
  for (const option of options) {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    selectElement.append(optionElement);
  }
  selectElement.value = selectedValue;
}

function trimText(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 1)}...`;
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
