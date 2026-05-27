const DAYS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
const STORAGE_KEY = "sharp_limpieza_board_v2";
const LEGACY_STORAGE_KEY = "sharp_limpieza_board_v1";

const LEGEND = {
  red: {
    symbol: "🟥",
    label: "Debe ser cada 1 dia",
    short: "Cada 1 dia",
    css: "lg-red"
  },
  orange: {
    symbol: "🟧",
    label: "Debe ser cada 3 dias",
    short: "Cada 3 dias",
    css: "lg-orange"
  },
  yellow: {
    symbol: "🟨",
    label: "Puede ser cada 4 dias",
    short: "Cada 4 dias",
    css: "lg-yellow"
  },
  green: {
    symbol: "🟩",
    label: "Puede ser una semana (mas trabajo)",
    short: "Semanal (mas trabajo)",
    css: "lg-green"
  },
  purple: {
    symbol: "🟪",
    label: "Puede ser una semana (+)",
    short: "Semanal (+)",
    css: "lg-purple"
  },
  none: {
    symbol: "⚪",
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
const taskForm = document.getElementById("task-form");
const taskTeam = document.getElementById("task-team");
const taskItem = document.getElementById("task-item");
const taskFree = document.getElementById("task-free");
const taskDone = document.getElementById("task-done");
const taskFrequencyHint = document.getElementById("task-frequency-hint");
const selectedCellLabel = document.getElementById("selected-cell-label");
const pendingList = document.getElementById("pending-list");
const doneList = document.getElementById("done-list");
const pendingCount = document.getElementById("pending-count");
const doneCount = document.getElementById("done-count");
const teamFilter = document.getElementById("team-filter");
const clearTaskButton = document.getElementById("clear-task");
const loadExampleButton = document.getElementById("load-example");
const legendList = document.getElementById("legend-list");

let state = loadState() || createExampleState();
let selectedCell = null;

clearEditor();
renderAll();

teamFilter.addEventListener("change", () => {
  renderSummary();
});

taskTeam.addEventListener("change", () => {
  updateTaskOptions(taskTeam.value, "");
  syncDoneToggle();
});

taskItem.addEventListener("change", () => {
  updateTaskHint(taskTeam.value, taskItem.value);
  syncDoneToggle();
});

taskFree.addEventListener("change", () => {
  if (taskFree.checked) {
    taskTeam.value = "";
    updateTaskOptions("", "");
    taskDone.checked = false;
    taskFrequencyHint.textContent = "FREE: colaborador libre (no trabaja).";
  } else {
    updateTaskOptions(taskTeam.value, taskItem.value);
  }
  syncDoneToggle();
});

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
    const collaboratorId = removeBtn.getAttribute("data-remove-collaborator");
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
      clearEditor();
    }

    saveState();
    renderAll();
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

  selectedCell = { collaboratorId, dayIndex };
  loadSelectedCellInEditor();
  renderTable();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedCell) {
    return;
  }

  if (taskFree.checked) {
    const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
    state.tasks[key] = { free: true };
    saveState();
    renderAll();
    return;
  }

  const team = taskTeam.value.trim();
  const taskId = taskItem.value.trim();
  if (!team) {
    window.alert("Selecciona un equipo primero.");
    return;
  }
  if (!taskId) {
    window.alert("Selecciona una tarea del equipo.");
    return;
  }

  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  state.tasks[key] = {
    team,
    taskId,
    done: taskDone.checked
  };

  saveState();
  renderAll();
});

clearTaskButton.addEventListener("click", () => {
  if (!selectedCell) {
    return;
  }

  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  delete state.tasks[key];
  saveState();
  renderAll();
});

loadExampleButton.addEventListener("click", () => {
  const ok = window.confirm("Esto reemplazara la data actual. Quieres continuar?");
  if (!ok) {
    return;
  }

  state = createExampleState();
  selectedCell = null;
  saveState();
  renderAll();
  clearEditor();
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
  tasks[buildCellKey(collaboratorId, dayIndex)] = { team, taskId, done };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.collaborators) || !parsed.tasks || typeof parsed.tasks !== "object") {
      return null;
    }

    const collaborators = parsed.collaborators
      .filter((item) => item && typeof item.id === "string" && typeof item.name === "string")
      .map((item) => ({ id: item.id, name: item.name.trim() }))
      .filter((item) => item.name.length > 0);

    const tasks = {};
    for (const [key, value] of Object.entries(parsed.tasks)) {
      if (!value || typeof value !== "object") {
        continue;
      }

      const done = Boolean(value.done);
      const free = Boolean(value.free);
      const team = typeof value.team === "string" ? value.team.trim() : "";
      let taskId = typeof value.taskId === "string" ? value.taskId.trim() : "";
      const text = typeof value.text === "string" ? value.text.trim() : "";
      const colorKey = typeof value.colorKey === "string" ? value.colorKey.trim() : "";

      if (free || normalizeText(text) === "free") {
        tasks[key] = { free: true };
        continue;
      }

      if (!taskId && team && text) {
        taskId = findTaskIdByText(team, text);
      }

      const normalized = { done };
      if (team) {
        normalized.team = team;
      }
      if (taskId && findTask(team, taskId)) {
        normalized.taskId = taskId;
      } else if (text) {
        if (taskId) {
          normalized.taskId = "";
        }
        normalized.text = text;
        normalized.colorKey = LEGEND[colorKey] ? colorKey : "none";
      } else {
        continue;
      }

      tasks[key] = normalized;
    }

    return { collaborators, tasks };
  } catch (_) {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

function renderAll() {
  renderLegend();
  updateTeamSelectors();
  renderTable();
  renderSummary();
  loadSelectedCellInEditor();
}

function renderLegend() {
  const order = ["red", "orange", "yellow", "green", "purple", "none"];
  legendList.innerHTML = order.map((colorKey) => {
    const item = LEGEND[colorKey];
    return `
      <li>
        <span class="legend-chip ${item.css}">${item.symbol} ${escapeHtml(item.short)}</span>
        <span>${escapeHtml(item.label)}</span>
      </li>
    `;
  }).join("");
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
    clearEditor();
    return;
  }

  const rows = state.collaborators.map((collaborator) => {
    const dayCells = DAYS.map((_, dayIndex) => {
      const key = buildCellKey(collaborator.id, dayIndex);
      const assignment = state.tasks[key];
      const isFree = Boolean(assignment && assignment.free);
      const meta = assignment && !isFree ? resolveTaskMeta(assignment) : null;
      const isSelected = Boolean(
        selectedCell &&
        selectedCell.collaboratorId === collaborator.id &&
        selectedCell.dayIndex === dayIndex
      );

      const statusClass = !assignment ? "" : isFree ? "free" : assignment.done ? "done" : "pending";
      const selectedClass = isSelected ? "selected" : "";
      const preview = isFree
        ? `<span class="free-label">FREE</span>`
        : meta
        ? `${meta.legend.symbol} ${escapeHtml(trimText(meta.taskName, 36))}`
        : "Asignar tarea";
      const statusText = isFree
        ? "Colaborador libre"
        : meta
        ? `${assignment.done ? "Realizada" : "Pendiente"} - ${escapeHtml(meta.team)}`
        : "Sin tarea";
      const title = isFree
        ? "FREE - colaborador libre (no trabaja)"
        : meta
        ? `${meta.team} | ${meta.taskName} | ${meta.legend.label}`
        : "Sin tarea";

      return `
        <td class="task-cell">
          <button
            type="button"
            class="cell-btn ${statusClass} ${selectedClass}"
            data-cell="1"
            data-collaborator="${collaborator.id}"
            data-day="${dayIndex}"
            title="${escapeHtml(title)}"
          >
            <span class="task-preview">${preview}</span>
            <span class="status-preview">${statusText}</span>
          </button>
        </td>
      `;
    }).join("");

    return `
      <tr>
        <td class="row-name">
          <div class="name-wrap">
            <span>${escapeHtml(collaborator.name)}</span>
            <button
              type="button"
              class="remove-btn"
              data-remove-collaborator="${collaborator.id}"
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

function renderSummary() {
  const selectedTeam = teamFilter.value;
  const pendingItems = [];
  const doneItems = [];

  for (const collaborator of state.collaborators) {
    for (let dayIndex = 0; dayIndex < DAYS.length; dayIndex += 1) {
      const key = buildCellKey(collaborator.id, dayIndex);
      const assignment = state.tasks[key];
      if (!assignment || assignment.free) {
        continue;
      }

      const meta = resolveTaskMeta(assignment);
      const detail = {
        day: DAYS[dayIndex],
        collaborator: collaborator.name,
        team: meta.team,
        taskName: meta.taskName,
        legend: meta.legend
      };

      if (assignment.done) {
        if (selectedTeam && detail.team !== selectedTeam) {
          continue;
        }
        doneItems.push(detail);
      } else {
        pendingItems.push(detail);
      }
    }
  }

  pendingCount.textContent = String(pendingItems.length);
  doneCount.textContent = String(doneItems.length);

  pendingList.innerHTML = pendingItems.length > 0
    ? pendingItems.map((item) => (
      `<li class="pending">${buildSummaryItemHtml(item)}</li>`
    )).join("")
    : `<li class="empty-text">No hay tareas pendientes.</li>`;

  doneList.innerHTML = doneItems.length > 0
    ? doneItems.map((item) => (
      `<li class="done">${buildSummaryItemHtml(item)}</li>`
    )).join("")
    : `<li class="empty-text">No hay tareas realizadas${selectedTeam ? ` para ${escapeHtml(selectedTeam)}` : ""}.</li>`;
}

function buildSummaryItemHtml(item) {
  return `
    <div class="task-line">
      <span class="legend-chip ${item.legend.css}">${item.legend.symbol} ${escapeHtml(item.legend.short)}</span>
      <span><strong>${escapeHtml(item.day)}</strong> - ${escapeHtml(item.collaborator)}: ${escapeHtml(item.taskName)} (${escapeHtml(item.team)})</span>
    </div>
  `;
}

function loadSelectedCellInEditor() {
  if (!selectedCell) {
    clearEditor();
    return;
  }

  const collaborator = state.collaborators.find((item) => item.id === selectedCell.collaboratorId);
  if (!collaborator) {
    clearEditor();
    return;
  }

  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  const assignment = state.tasks[key];

  selectedCellLabel.textContent = `${collaborator.name} - ${DAYS[selectedCell.dayIndex]}`;
  taskFree.disabled = false;
  clearTaskButton.disabled = false;

  if (assignment) {
    if (assignment.free) {
      taskFree.checked = true;
      taskTeam.value = "";
      updateTaskOptions("", "");
      taskDone.checked = false;
      taskFrequencyHint.textContent = "FREE: colaborador libre (no trabaja).";
    } else {
      taskFree.checked = false;
      taskTeam.value = assignment.team && hasTeam(assignment.team) ? assignment.team : "";
      updateTaskOptions(taskTeam.value, assignment.taskId || "");
      taskDone.checked = Boolean(assignment.done);

      if (!assignment.taskId && assignment.text) {
        taskFrequencyHint.textContent = `Tarea existente fuera del catalogo: ${assignment.text}.`;
      }
    }
  } else {
    taskFree.checked = false;
    taskTeam.value = "";
    updateTaskOptions("", "");
    taskDone.checked = false;
  }

  syncDoneToggle();
  taskTeam.focus();
}

function clearEditor() {
  selectedCellLabel.textContent = "Selecciona una casilla del calendario para cargar la tarea.";
  taskFree.checked = false;
  taskTeam.value = "";
  taskItem.value = "";
  taskDone.checked = false;
  taskFree.disabled = true;
  taskTeam.disabled = true;
  taskItem.disabled = true;
  taskDone.disabled = true;
  clearTaskButton.disabled = true;
  taskFrequencyHint.textContent = "Selecciona equipo y tarea para ver la frecuencia del sharp.";
}

function syncDoneToggle() {
  const hasSelection = Boolean(selectedCell);
  const isFree = taskFree.checked;

  taskFree.disabled = !hasSelection;
  taskTeam.disabled = !hasSelection || isFree;

  if (isFree) {
    taskItem.disabled = true;
  } else if (!hasSelection) {
    taskItem.disabled = true;
  } else if (!taskTeam.value || !hasTeam(taskTeam.value)) {
    taskItem.disabled = true;
  } else {
    taskItem.disabled = false;
  }

  taskDone.disabled = !hasSelection || isFree || !taskTeam.value || !taskItem.value;
}

function updateTeamSelectors() {
  const teams = collectTeamsFromState();
  setSelectOptions(
    taskTeam,
    [{ value: "", label: "Seleccionar equipo" }, ...teams.map((team) => ({ value: team, label: team }))],
    taskTeam.value
  );
  setSelectOptions(
    teamFilter,
    [{ value: "", label: "Todos los equipos" }, ...teams.map((team) => ({ value: team, label: team }))],
    teamFilter.value
  );
  updateTaskOptions(taskTeam.value, taskItem.value);
}

function updateTaskOptions(team, selectedTaskId) {
  if (!team || !hasTeam(team)) {
    setSelectOptions(
      taskItem,
      [{ value: "", label: "Selecciona un equipo primero" }],
      ""
    );
    taskItem.disabled = true;
    updateTaskHint("", "");
    return;
  }

  const tasks = TASK_LIBRARY[team] || [];
  const options = tasks.map((task) => {
    const legend = LEGEND[task.color] || LEGEND.none;
    return {
      value: task.id,
      label: `${legend.symbol} ${task.name} - ${legend.short}`
    };
  });

  setSelectOptions(
    taskItem,
    [{ value: "", label: "Seleccionar tarea" }, ...options],
    selectedTaskId
  );
  taskItem.disabled = false;
  updateTaskHint(team, taskItem.value);
}

function updateTaskHint(team, taskId) {
  if (!team || !taskId) {
    taskFrequencyHint.textContent = "Selecciona equipo y tarea para ver la frecuencia del sharp.";
    return;
  }

  const task = findTask(team, taskId);
  if (!task) {
    taskFrequencyHint.textContent = "No se encontro la tarea seleccionada.";
    return;
  }

  const legend = LEGEND[task.color] || LEGEND.none;
  taskFrequencyHint.textContent = `${legend.symbol} ${task.name}: ${legend.label}`;
}

function collectTeamsFromState() {
  const knownTeams = new Set(TEAM_NAMES);
  const extraTeams = [];

  for (const assignment of Object.values(state.tasks)) {
    if (!assignment || typeof assignment.team !== "string") {
      continue;
    }
    const team = assignment.team.trim();
    if (!team || knownTeams.has(team)) {
      continue;
    }
    knownTeams.add(team);
    extraTeams.push(team);
  }

  return [...TEAM_NAMES, ...extraTeams];
}

function setSelectOptions(selectElement, options, currentValue) {
  const selectedValue = options.some((option) => option.value === currentValue)
    ? currentValue
    : options[0].value;

  selectElement.innerHTML = "";
  for (const option of options) {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    selectElement.append(optionElement);
  }
  selectElement.value = selectedValue;
}

function resolveTaskMeta(assignment) {
  const team = assignment.team && assignment.team.trim() ? assignment.team.trim() : "Sin equipo";
  const task = findTask(team, assignment.taskId);

  if (task) {
    const legend = LEGEND[task.color] || LEGEND.none;
    return {
      team,
      taskName: task.name,
      legend
    };
  }

  const fallbackText = assignment.text && assignment.text.trim()
    ? assignment.text.trim()
    : "Tarea sin catalogo";
  const colorKey = LEGEND[assignment.colorKey] ? assignment.colorKey : "none";
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
  return TASK_INDEX.get(`${team}__${taskId}`) || null;
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
  return value
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
      map.set(`${team}__${task.id}`, task);
    }
  }
  return map;
}

function buildCellKey(collaboratorId, dayIndex) {
  return `${collaboratorId}__${dayIndex}`;
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
