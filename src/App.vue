<template>
  <div>
    <nav class="navbar">
      <div class="navbar-logo">
        <h1>GESTAPP</h1>
      </div>
      <div class="navbar-links">
        <a href="#">Inicio</a>
        <a href="#">Tareas</a>
        <a href="#">Configuración</a>
      </div>
    </nav>

    <div class="container">
      <h1>GESTAPP</h1>

      <form @submit.prevent="addTask">
        <label for="title">Título:</label>
        <input type="text" id="title" v-model="newTask.title" />

        <label for="description">Descripción:</label>
        <textarea id="description" v-model="newTask.description"></textarea>

        <button>Agregar Tarea</button>
      </form>

      <div class="task-list">
        <h2>Tareas Pendientes</h2>

        <div v-if="pendingTasks.length === 0">No hay tareas pendientes.</div>

        <div v-for="task in pendingTasks" :key="task.id" class="task">
          <div class="task-content">
            <h3>{{ task.title }}</h3>
            <p>{{ task.description }}</p>
          </div>

          <div class="task-actions">
            <button @click="completeTask(task.id)">Completar</button>
            <button @click="editTask(task)">Editar</button>
            <button class="delete-button" @click="deleteTask(task.id)">Eliminar</button>
          </div>
        </div>
      </div>

      <div class="task-list">
        <h2>Tareas Completadas</h2>

        <div v-if="completedTasks.length === 0">No hay tareas completadas.</div>

        <div v-for="task in completedTasks" :key="task.id" class="task">
          <div class="task-content">
            <h3>{{ task.title }}</h3>
            <p>{{ task.description }}</p>
          </div>

          <div class="task-actions">
            <button @click="uncompleteTask(task.id)">Descompletar</button>
            <button @click="editTask(task)">Editar</button>
            <button class="delete-button" @click="deleteTask(task.id)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  data() {
    return {
      newTask: {
        title: '',
        description: '',
        completed: false,
        id: 1,
      },
      tasks: [],
      editMode: false,
      editedTask: null,
    };
  },

  computed: {
    pendingTasks() {
      return this.tasks.filter((task) => !task.completed);
    },

    completedTasks() {
      return this.tasks.filter((task) => task.completed);
    },
  },

  methods: {
    addTask() {
      if (!this.newTask.title || !this.newTask.description) {
        alert('Por favor ingrese un título y una descripción para la tarea.');
        return;
      }
      if (this.editMode) {
        this.updateTask();
      } else {
        this.tasks.push({ ...this.newTask, id: this.newTask.id++ });
      }
      this.resetForm();
    },

    deleteTask(taskId) {
  this.tasks = this.tasks.filter((task) => task.id !== taskId);
},

completeTask(taskId) {
  const task = this.tasks.find((task) => task.id === taskId);
  task.completed = true;
},

uncompleteTask(taskId) {
  const task = this.tasks.find((task) => task.id === taskId);
  task.completed = false;
},

editTask(task) {
  this.editMode = true;
  this.editedTask = { ...task };
  this.newTask = { ...task };
},

updateTask() {
  const taskIndex = this.tasks.findIndex((task) => task.id === this.editedTask.id);
  this.tasks.splice(taskIndex, 1, { ...this.newTask });
  this.resetForm();
},

resetForm() {
  this.newTask = {
    title: '',
    description: '',
    completed: false,
    id: this.newTask.id + 1,
  };
  this.editMode = false;
  this.editedTask = null;
},
},
};
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

form {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

form label {
  margin-bottom: 10px;
  font-size: 1.2rem;
}

form input,
form textarea {
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  background-color: #f2f2f2;
  border-radius: 5px;
  font-size: 1.2rem;
}

form button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

form button:hover {
  background-color: #388e3c;
}

.task-list {
  margin-top: 30px;
}

.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  transition: all 0.2s ease-in-out;
}

.task:hover {
  transform: translateY(-5px);
}

.task-actions {
  display: flex;
}

.task-actions button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.task-actions button:hover {
  background-color: #388e3c;
}

.delete-button {
  background-color: #f44336;
}

.navbar {
  background-color: #28a745;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.navbar-logo {
  display: flex;
  align-items: center;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.navbar-logo h1 {
  margin: 0;
  font-size: 18px;
  color: #fff;
  transition: transform 0.3s ease;
}

.navbar-logo h1:hover {
  transform: scale(1.1);
  animation: logoAnimation 1s infinite;
  cursor: pointer;
}

.navbar-links a {
  color: #fff;
  text-decoration: none;
  margin-left: 10px;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.navbar-links a:hover {
  background-color: #333;
  transform: scale(1.1);
}

@keyframes logoAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>