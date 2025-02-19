document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location = 'login.html';
  }

  // Fetch tasks from the backend
  const response = await fetch('http://localhost:5000/api/tasks', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const tasks = await response.json();
  const taskList = document.getElementById('taskList');
  tasks.forEach(task => {
    taskList.innerHTML += `
      <div id="task-${task._id}">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <button onclick="editTask('${task._id}')">Edit</button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `;
  });
});

// Handle task creation
document.getElementById('addTaskBtn')?.addEventListener('click', () => {
  document.getElementById('addTaskModal').style.display = 'flex';
});

document.getElementById('closeModal')?.addEventListener('click', () => {
  document.getElementById('addTaskModal').style.display = 'none';
});

document.getElementById('taskForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;

  // Create a new task via API
  const response = await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });

  const task = await response.json();
  if (task._id) {
    document.getElementById('taskList').innerHTML += `
      <div id="task-${task._id}">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <button onclick="editTask('${task._id}')">Edit</button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `;
    document.getElementById('addTaskModal').style.display = 'none';
  }
});

// Handle task deletion
async function deleteTask(taskId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.ok) {
    document.getElementById(`task-${taskId}`).remove();
  }
}

// Handle task edit
function editTask(taskId) {
  const token = localStorage.getItem('token');
  fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  .then(response => response.json())
  .then(task => {
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('addTaskModal').style.display = 'flex';
    document.getElementById('taskForm').onsubmit = (e) => updateTask(e, taskId);
  })
  .catch(error => {
    console.error('Error fetching task for editing:', error);
  });
}

// Update existing task
async function updateTask(e, taskId) {
  e.preventDefault();
  
  const token = localStorage.getItem('token');
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;

  const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });

  const updatedTask = await response.json();

  if (updatedTask._id) {
    document.getElementById(`task-${taskId}`).innerHTML = `
      <h3>${updatedTask.title}</h3>
      <p>${updatedTask.description}</p>
      <button onclick="editTask('${updatedTask._id}')">Edit</button>
      <button onclick="deleteTask('${updatedTask._id}')">Delete</button>
    `;
    document.getElementById('addTaskModal').style.display = 'none';
  }
}
