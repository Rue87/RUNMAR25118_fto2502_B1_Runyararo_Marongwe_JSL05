import { initialTasks } from "./initialData.js";
//---Local Storage Helpers---

document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("open-add-task-modal");
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
      const modal = document.getElementById("add-task-modal");
      if (modal) modal.showModal();
    })
  }
  });

export function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}
export function getTasksFromLocalStorage() {
  const taskJson = localStorage.getItem("kanbanTasks");
  return taskJson ? JSON.parse(taskJson) : [];
}

/**
 * Creates a single task DOM element.
 * @param {Object} task - Task data object.
 * @param {string} task.title - Title of the task.
 * @param {number} task.id - Unique task ID.
 * @param {string} task.status - Status column: 'todo', 'doing', or 'done'.
 * @returns {HTMLElement} The created task div element.
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
 * Clears all existing task-divs from all task containers.
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
 * Sets up modal close behavior.
 */
function setupModalCloseHandler() {
  const modal = document.getElementById("task-modal");
  const closeBtn = document.getElementById("close-modal-btn");

  closeBtn.addEventListener("click", () => {
    modal.close();
  });
}

/**
 * Initializes the task board and modal handlers.
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
function setupAddTaskModalCloseHandler() {
  const modal = document.getElementById("add-task-modal");
  const closeBtn = document.getElementById("close-add-task-btn");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.close();
    });
  }
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
// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", initTaskBoard);
