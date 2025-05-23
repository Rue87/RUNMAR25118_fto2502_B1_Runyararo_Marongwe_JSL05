import { initialTasks } from "./initialData.js";

// ==============================
// DOM Ready Handler
// ==============================

/**
 * Show the Add Task modal when the "+Add Task" button is clicked.
 * Waits for DOM content to fully load before attaching event listener
 */
document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("open-add-task-modal");
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
      const modal = document.getElementById("add-task-modal");
      if (modal) modal.showModal();
    });
  }
});

// ==============================
// Local Storage Utilities
// ==============================
/**
 * Save an array of tasks to localStorage.
 * @param {Array<Object>} tasks-List of tasks to store.
 */
export function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}
/**
 * Get task data from localStorage.
 * @returns {Array<Object>}The parsed task array, or an empty array if none exists.
 */
export function getTasksFromLocalStorage() {
  const taskJson = localStorage.getItem("kanbanTasks");
  return taskJson ? JSON.parse(taskJson) : [];
}

// ==============================
// Task Rendering Logic
// ==============================

/**
 * Create a task element for display in the UI
 * @param {object} task-The task object to render.
 * @returns {HTMLElement} The constructed task DOM element.
 */
function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.textContent = task.title;
  taskDiv.dataset.taskId = task.id;

  taskDiv.addEventListener("click", () => {
    openTaskModal(task);
  });

  return taskDiv;
}

/**
 * Finds the task container element based on task status.
 * @param {string} status - The task status ('todo', 'doing', or 'done').
 * @returns {HTMLElement|null} The container element, or null if not found.
 */
function getTaskContainerByStatus(status) {
  const column = document.querySelector(`.column-div[data-status="${status}"]`);
  return column ? column.querySelector(".tasks-container") : null;
}
/**
 * Clears all existing tasks-from UI
 */
function clearExistingTasks() {
  document.querySelectorAll(".tasks-container").forEach((container) => {
    container.innerHTML = "";
  });
}

/**
 * Renders all tasks from initial data to the UI.
 * Groups tasks by status and appends them to their respective columns.
 * @param {Array<Object>} tasks - Array of task objects.
 */
function renderTasks(tasks) {
  tasks.forEach((task) => {
    const container = getTaskContainerByStatus(task.status);
    if (container) {
      const taskElement = createTaskElement(task);
      container.appendChild(taskElement);
    }
  });
  saveTasksToLocalStorage(tasks);
}

// ==============================
// Modal Handling
// ==============================

/**
 * Opens the modal dialog with pre-filled task details.
 * @param {Object} task - The task object to display in the modal.
 */
function openTaskModal(task) {
  const modal = document.getElementById("task-modal");
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const statusSelect = document.getElementById("task-status");

  titleInput.value = task.title;
  descInput.value = task.description;
  statusSelect.value = task.status;

  modal.showModal();
}

/**
 * Handle closing of the task modal.
 */
function setupModalCloseHandler() {
  const modal = document.getElementById("task-modal");
  const closeBtn = document.getElementById("close-modal-btn");

  closeBtn.addEventListener("click", () => {
    modal.close();
  });
}
/** Handle closing of the Add Task modal */
function setupAddTaskModalCloseHandler() {
  const modal = document.getElementById("add-task-modal");
  const closeBtn = document.getElementById("close-add-task-btn");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.close();
    });
  }
}
// ==============================
// Initialization & Form Handling
// ==============================

/**
 * Initializes the task board and load tasks.
 * * Loads tasks from localStorage or fallback to initialTasks.
 */
function initTaskBoard() {
  let savedTasks = getTasksFromLocalStorage();

  if (!savedTasks || savedTasks.length === 0) {
    savedTasks = initialTasks;
    saveTasksToLocalStorage(initialTasks);
  }
  clearExistingTasks();
  renderTasks(savedTasks);
  setupModalCloseHandler();
  setupAddTaskModalCloseHandler();
}

/**
 * Handles the submission of the Add Task form.
 * Adds new task to localStorage and updates the UI.
 */
function setupAddTaskFormHandler() {
  const addTaskForm = document.getElementById("add-task-form");
  const addTaskModal = document.getElementById("add-task-modal");

  // Use explicit element IDs
  const titleInput = document.getElementById("new-task-title");
  const descInput = document.getElementById("new-task-desc");
  const statusSelect = document.getElementById("new-task-status");

  addTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get existing tasks from localStorage
    const tasks = getTasksFromLocalStorage();

    const newTask = {
      id: Date.now(),
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      status: statusSelect.value,
    };

    // Validate required field title (should be handled by HTML 'required', but double-check)
    if (!newTask.title) {
      alert("Please enter a task title.");
      return;
    }

    tasks.push(newTask);
    saveTasksToLocalStorage(tasks);
    clearExistingTasks();
    renderTasks(tasks);

    // Reset and close modal
    addTaskForm.reset();
    addTaskModal.close();
  });
}
// Initialize board and form handler
document.addEventListener("DOMContentLoaded", initTaskBoard);

/**
 * Enables the Add Task form handling.
 */

setupAddTaskFormHandler();
