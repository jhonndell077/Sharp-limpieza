const DAYS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
const STORAGE_KEY = "sharp_limpieza_board_v1";
const TEAM_OPTIONS = [
  "Freidora",
  "Plancha",
  "Grill",
  "Estufa",
  "Bano Maria",
  "Nevera 1",
  "Nevera 2",
  "Nevera 3",
  "Mesa de trabajo trasera",
  "Zafacones",
  "Mesa de despacho",
  "Piso"
];

const collaboratorForm = document.getElementById("collaborator-form");
const collaboratorInput = document.getElementById("collaborator-name");
const scheduleBody = document.getElementById("schedule-body");
const taskForm = document.getElementById("task-form");
const taskText = document.getElementById("task-text");
const taskTeam = document.getElementById("task-team");
const taskDone = document.getElementById("task-done");
const selectedCellLabel = document.getElementById("selected-cell-label");
const pendingList = document.getElementById("pending-list");
const doneList = document.getElementById("done-list");
const pendingCount = document.getElementById("pending-count");
const doneCount = document.getElementById("done-count");
const teamFilter = document.getElementById("team-filter");
const clearTaskButton = document.getElementById("clear-task");
const loadExampleButton = document.getElementById("load-example");

let state = loadState() || createExampleState();
let selectedCell = null;

updateTeamSelectors();
clearEditor();
renderAll();

teamFilter.addEventListener("change", () => {
  renderSummary();
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

  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  const text = taskText.value.trim();
  const team = taskTeam.value.trim();
  const done = taskDone.checked;

  if (!text) {
    delete state.tasks[key];
  } else {
    state.tasks[key] = { text, done, team };
  }

  saveState();
  renderAll();
  loadSelectedCellInEditor();
});

clearTaskButton.addEventListener("click", () => {
  if (!selectedCell) {
    return;
  }

  const key = buildCellKey(selectedCell.collaboratorId, selectedCell.dayIndex);
  delete state.tasks[key];
  saveState();
  renderAll();
  loadSelectedCellInEditor();
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
  putTask(tasks, collaborators[0].id, 1, "Canastas y tapas", false, "Freidora");
  putTask(tasks, collaborators[1].id, 0, "Hornillas y botones", false, "Estufa");
  putTask(tasks, collaborators[2].id, 2, "Limpieza de plancha", false, "Plancha");
  putTask(tasks, collaborators[3].id, 3, "Tuberia y laterales", true, "Freidora");
  putTask(tasks, collaborators[4].id, 2, "Mesa y cuberteria", false, "Grill");

  return { collaborators, tasks };
}

function putTask(tasks, collaboratorId, dayIndex, text, done, team = "") {
  tasks[buildCellKey(collaboratorId, dayIndex)] = { text, done, team };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
      if (!value || typeof value.text !== "string" || typeof value.done !== "boolean") {
        continue;
      }
      const team = typeof value.team === "string" ? value.team.trim() : "";
      tasks[key] = { text: value.text, done: value.done, team };
    }

    return { collaborators, tasks };
  } catch (_) {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderAll() {
  updateTeamSelectors();
  renderTable();
  renderSummary();
  loadSelectedCellInEditor();
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
      const task = state.tasks[key];
      const isSelected = Boolean(
        selectedCell &&
        selectedCell.collaboratorId === collaborator.id &&
        selectedCell.dayIndex === dayIndex
      );

      const statusClass = !task ? "" : task.done ? "done" : "pending";
      const selectedClass = isSelected ? "selected" : "";
      const preview = task ? escapeHtml(trimText(task.text, 42)) : "Asignar tarea";
      const statusText = task
        ? `${task.done ? "Realizada" : "Pendiente"}${task.team ? ` - ${task.team}` : ""}`
        : "Sin tarea";

      return `
        <td class="task-cell">
          <button
            type="button"
            class="cell-btn ${statusClass} ${selectedClass}"
            data-cell="1"
            data-collaborator="${collaborator.id}"
            data-day="${dayIndex}"
            title="${task ? escapeHtml(task.text) : "Sin tarea"}"
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
      const task = state.tasks[key];
      if (!task || !task.text.trim()) {
        continue;
      }

      const detail = {
        day: DAYS[dayIndex],
        collaborator: collaborator.name,
        text: task.text.trim(),
        team: task.team || ""
      };

      if (task.done) {
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
      `<li class="pending"><strong>${escapeHtml(item.day)}</strong> - ${escapeHtml(item.collaborator)}: ${escapeHtml(item.text)}${item.team ? ` (${escapeHtml(item.team)})` : ""}</li>`
    )).join("")
    : `<li class="empty-text">No hay tareas pendientes.</li>`;

  doneList.innerHTML = doneItems.length > 0
    ? doneItems.map((item) => (
      `<li class="done"><strong>${escapeHtml(item.day)}</strong> - ${escapeHtml(item.collaborator)}: ${escapeHtml(item.text)}${item.team ? ` (${escapeHtml(item.team)})` : ""}</li>`
    )).join("")
    : `<li class="empty-text">No hay tareas realizadas${selectedTeam ? ` para ${escapeHtml(selectedTeam)}` : ""}.</li>`;
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
  const task = state.tasks[key];

  selectedCellLabel.textContent = `${collaborator.name} - ${DAYS[selectedCell.dayIndex]}`;
  taskText.disabled = false;
  taskTeam.disabled = false;
  taskDone.disabled = false;
  clearTaskButton.disabled = false;
  taskText.value = task ? task.text : "";
  taskTeam.value = task && task.team ? task.team : "";
  taskDone.checked = task ? task.done : false;
  taskText.focus();
}

function clearEditor() {
  selectedCellLabel.textContent = "Selecciona una casilla del calendario para cargar la tarea.";
  taskText.value = "";
  taskTeam.value = "";
  taskDone.checked = false;
  taskText.disabled = true;
  taskTeam.disabled = true;
  taskDone.disabled = true;
  clearTaskButton.disabled = true;
}

function updateTeamSelectors() {
  const teamItems = collectTeamsFromState();
  setSelectOptions(
    taskTeam,
    [{ value: "", label: "Seleccionar equipo" }, ...teamItems.map((team) => ({ value: team, label: team }))],
    taskTeam.value
  );
  setSelectOptions(
    teamFilter,
    [{ value: "", label: "Todos los equipos" }, ...teamItems.map((team) => ({ value: team, label: team }))],
    teamFilter.value
  );
}

function collectTeamsFromState() {
  const set = new Set(TEAM_OPTIONS);
  for (const task of Object.values(state.tasks)) {
    if (!task || typeof task.team !== "string") {
      continue;
    }
    const team = task.team.trim();
    if (team) {
      set.add(team);
    }
  }
  return Array.from(set);
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
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
