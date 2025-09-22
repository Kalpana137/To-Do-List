let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [
  { name: "All-Tasks", theme: "theme-pink" },
  { name: "Personal", theme: "theme-pink" },
  { name: "My-Work", theme: "theme-green" },
  { name: "Shopping", theme: "theme-yellow" },
  { name: "Projects", theme: "theme-blue" }
];

function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("categories", JSON.stringify(categories));
}

// INDEX PAGE
function addQuickTask() {
  const input = document.getElementById("quickTask");
  const categorySelect = document.getElementById("category-select");
  const taskText = input.value.trim();
  const category = categorySelect.value;

  if (!taskText || !category) {
    alert("Please enter task and select a category");
    return;
  }

  const task = {
    text: taskText,
    category: category,
    done: false
  };

  tasks.push(task);
  saveData();
  input.value = "";
  categorySelect.value = "";

  alert("Task added successfully!");
  updateCategoryCounts();
  updateCategoryDropdown();
}

// Dynamically update category dropdown on home page
function updateCategoryDropdown() {
  const select = document.getElementById("category-select");
  if (!select) return;
  select.length = 1;
  categories.forEach(cat => {
    if (cat.name !== "All-Tasks") {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name.replace(/-/g, " ");
      select.appendChild(option);
    }
  });
  select.options[0].textContent = `Add Category (${categories.filter(c => c.name !== "All-Tasks").length})`;
}

// Show category count on Add Category button (home page)
function updateCategoryCountOnHome() {
  const countSpan = document.getElementById("category-count");
  if (countSpan) {
    const count = categories.filter(cat => cat.name !== "All-Tasks").length;
    countSpan.textContent = count;
  }
}

// CATEGORIES PAGE
function renderCategoryCards() {
  const grid = document.querySelector(".card-grid");
  if (!grid) return;
  grid.innerHTML = "";
  categories.forEach(cat => {
    const count = tasks.filter(task => cat.name === "All-Tasks" || task.category === cat.name).length;
    const card = document.createElement("div");
    card.className = `card ${cat.theme}`;
    card.innerHTML = `
      <span class="dot ${cat.theme.replace('theme-', 'dot-')}"></span>
      <h3>${cat.name.replace(/-/g, " ")}</h3>
      <p id="count-${cat.name}">${count} items</p>
      ${cat.name !== "All-Tasks" ? `<button onclick="deleteCategory(event, '${cat.name}')">🗑️ Delete</button>` : ""}
    `;
    card.onclick = (e) => {
      if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
      openCategory(cat.name);
    };
    grid.appendChild(card);
  });
  updateCategoryCounts();
}

// Delete a category and update dropdown/count
function deleteCategory(event, categoryName) {
  event.stopPropagation();
  if (categoryName === "All-Tasks") {
    alert("Cannot delete All Tasks category!");
    return;
  }
  categories = categories.filter(cat => cat.name !== categoryName);
  tasks = tasks.filter(task => task.category !== categoryName);
  saveData();
  renderCategoryCards();
  updateCategoryCounts();
  updateCategoryDropdown();
  updateCategoryCountOnHome();
}

// Update counts on category cards
function updateCategoryCounts() {
  categories.forEach(cat => {
    const countElement = document.getElementById(`count-${cat.name}`);
    if (countElement) {
      const count = tasks.filter(task => cat.name === "All-Tasks" || task.category === cat.name).length;
      countElement.textContent = `${count} items`;
    }
  });
}

// Open a category card
function openCategory(categoryName) {
  document.querySelector(".category-list").style.display = "none";
  const taskPage = document.getElementById("task-page");
  taskPage.style.display = "block";
  document.getElementById("category-title").innerText = categoryName;
  renderCategoryTasks(categoryName);
}

// Close category view
function closeCategoryPage() {
  document.getElementById("task-page").style.display = "none";
  document.querySelector(".category-list").style.display = "block";
}

// Render tasks for a category (add/delete here)
function renderCategoryTasks(categoryName) {
  const list = document.getElementById("category-task-list");
  list.innerHTML = "";

  let filteredTasks = tasks;
  if (categoryName !== "All-Tasks") {
    filteredTasks = tasks.filter(task => task.category === categoryName);
  }

  filteredTasks.forEach(task => {
    const index = tasks.indexOf(task);
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" onchange="toggleTask(${index})" ${task.done ? "checked" : ""}>
      <span style="text-decoration:${task.done ? 'line-through' : 'none'}">${task.text}</span>
      <button onclick="deleteTask(${index})">❌</button>
    `;
    list.appendChild(li);
  });

  // Show input box for adding new tasks in this category
  const inputBox = document.querySelector(".input-boxess");
  if (inputBox) inputBox.style.display = "block";
  const input = document.getElementById("task-input");
  if (input) input.value = "";
}

// Add a task in category view
function addTask() {
  const input = document.getElementById("task-input");
  const taskText = input.value.trim();
  const categoryName = document.getElementById("category-title").innerText;

  if (!taskText) {
    alert("Please enter a task");
    return;
  }

  const task = {
    text: taskText,
    category: categoryName,
    done: false
  };

  tasks.push(task);
  saveData();
  input.value = "";

  renderCategoryTasks(categoryName);
  updateCategoryCounts();
}

// Toggle task done/undone
function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveData();
  renderCategoryTasks(document.getElementById("category-title").innerText);
  updateCategoryCounts();
}

// Delete a task in category view
function deleteTask(index) {
  tasks.splice(index, 1);
  saveData();
  renderCategoryTasks(document.getElementById("category-title").innerText);
  updateCategoryCounts();
}

// ADD CATEGORY PAGE
function createCategory() {
  const categoryName = document.getElementById("categoryName").value.trim();
  const theme = document.querySelector('input[name="theme"]:checked').value;

  if (!categoryName) {
    alert("Please enter category name");
    return;
  }

  if (categories.some(cat => cat.name === categoryName)) {
    alert("Category already exists!");
    return;
  }

  categories.push({ name: categoryName, theme: theme });
  saveData();

  alert("Category created successfully!");
  updateCategoryDropdown();
  updateCategoryCountOnHome();
  window.location.href = "categories.html";
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
  updateCategoryDropdown();
  if (document.querySelector(".card-grid")) {
    renderCategoryCards();
  }
  updateCategoryCountOnHome();
});