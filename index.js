// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authContainer = document.getElementById('auth-container');
const todoContainer = document.getElementById('todo-container');
const todoList = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo');

// Toggle between login and register forms
function toggleForms() {
    loginForm.style.display = loginForm.style.display === 'none' ? 'flex' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'flex' : 'none';
}

// Register new user
async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            toggleForms();
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        alert('Error during registration');
    }
}

// Login user
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            authContainer.style.display = 'none';
            todoContainer.style.display = 'block';
            loadTodos();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('Error during login');
    }
}

// Logout user
async function logout() {
    try {
        await fetch('/logout');
        authContainer.style.display = 'block';
        todoContainer.style.display = 'none';
        todoList.innerHTML = '';
    } catch (error) {
        alert('Error during logout');
    }
}

// Load todos
async function loadTodos() {
    try {
        const response = await fetch('/todos');
        if (response.ok) {
            const todos = await response.json();
            renderTodos(todos);
        } else {
            throw new Error('Failed to load todos');
        }
    } catch (error) {
        alert('Error loading todos');
    }
}

// Render todos
function renderTodos(todos) {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.onclick = () => toggleTodo(todo.id, !todo.completed);
        
        const span = document.createElement('span');
        span.textContent = todo.title;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteTodo(todo.id);
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// Add new todo
async function addTodo() {
    const title = newTodoInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });

        if (response.ok) {
            newTodoInput.value = '';
            loadTodos();
        } else {
            throw new Error('Failed to add todo');
        }
    } catch (error) {
        alert('Error adding todo');
    }
}

// Toggle todo completion
async function toggleTodo(id, completed) {
    try {
        const response = await fetch(`/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });

        if (response.ok) {
            loadTodos();
        } else {
            throw new Error('Failed to update todo');
        }
    } catch (error) {
        alert('Error updating todo');
    }
}

// Delete todo
async function deleteTodo(id) {
    try {
        const response = await fetch(`/todos/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            loadTodos();
        } else {
            throw new Error('Failed to delete todo');
        }
    } catch (error) {
        alert('Error deleting todo');
    }
}

// Event listener for Enter key in new todo input
newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Add event listener to task list items
document.getElementById('taskList').addEventListener('mouseover', function(event) {
    if (event.target.tagName === 'LI') {
        const taskIndex = Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        event.target.title = tasks[taskIndex].taskData;
    }
});

document.getElementById('taskList').addEventListener('mouseout', function(event) {
    if (event.target.tagName === 'LI') {
        event.target.title = '';
    }
});

const animatedText = document.getElementById('animated-text');
const phrases = [
  'add what ever task you want  ',
  'tap on the task after you completed   ',
  'click on the clear button   ',
  'or you can remove them individually   '
];

let currentPhraseIndex = 0;
let currentCharacterIndex = 0;
let typingInterval;

function typePhrase() {
  const phrase = phrases[currentPhraseIndex];
  const character = phrase[currentCharacterIndex];

  animatedText.textContent += character;

  currentCharacterIndex++;

  if (currentCharacterIndex >= phrase.length) {
    currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
    currentCharacterIndex = 0;
    animatedText.textContent = '';
  }
}

typingInterval = setInterval(typePhrase, 150);

let tasks = [];

function addTask() {
    let taskInput = document.getElementById('taskInput');
    let taskDataInput = document.getElementById('taskDataInput');
    let task = taskInput.value.trim();
    let taskData = taskDataInput.value.trim();
    if (task === '' || taskData === '') return;

    let taskList = document.getElementById('taskList');
    let listItem = document.createElement('li');
    listItem.innerHTML = `${task} <button class="remove-btn" onclick="removeTask(this)">Remove</button>`;
    listItem.onclick = () => listItem.classList.toggle('completed');

    tasks.push({ task, taskData });

    taskList.appendChild(listItem);
    taskInput.value = '';
    taskDataInput.value = '';
}

function removeTask(button) {
    const listItem = button.parentNode;
    const taskIndex = Array.prototype.indexOf.call(listItem.parentNode.children, listItem);
    tasks.splice(taskIndex, 1);
    listItem.remove();
}

function clearCompletedTasks() {
    let taskList = document.getElementById('taskList');
    let completedTasks = taskList.querySelectorAll('.completed');
    completedTasks.forEach(task => {
        const taskIndex = Array.prototype.indexOf.call(task.parentNode.children, task);
        tasks.splice(taskIndex, 1);
        task.remove();
    });
}