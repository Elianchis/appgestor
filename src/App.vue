<template>
  <div>
    <div v-if="!isLoggedIn">
      <div v-if="showRegister" class="register-form">
        <h2>Registrarse</h2>
        <input type="text" v-model="registerForm.username" placeholder="Usuario" />
        <input type="password" v-model="registerForm.password" placeholder="Contraseña" />
        <button @click="registerUser">Registrarse</button>
        <button @click="showLoginForm">Iniciar Sesión</button>
      </div>

      <div v-else class="login-form">
        <h2>Iniciar Sesión</h2>
        <input type="text" v-model="loginForm.username" placeholder="Usuario" />
        <input type="password" v-model="loginForm.password" placeholder="Contraseña" />
        <button @click="loginUser">Iniciar Sesión</button>
        <button @click="showRegisterForm">Registrarse</button>
      </div>
    </div>

    <div v-else>
      <nav class="navbar">
        <div class="navbar-logo">
          <h1>GESTAPP</h1>
        </div>
        <div class="navbar-links">
          <span class="username">{{ loggedInUser }}</span>
          <button class="logout-button" @click="logout">Cerrar Sesión</button>
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newTask: {
        title: "",
        description: "",
        completed: false,
        id: 1,
      },
      tasks: [],
      editMode: false,
      editedTask: null,
      isLoggedIn: false,
      showRegister: false,
      registerForm: {
        username: "",
        password: "",
      },
      loginForm: {
        username: "",
        password: "",
      },
      loggedInUser: "",
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
    async addTask() {
      if (!this.newTask.title || !this.newTask.description) {
        alert('Por favor ingrese un título y una descripción para la tarea.');
        return;
      }
      if (this.editMode) {
        await this.updateTask();
      } else {
        try {
          const response = await axios.post('http://localhost:3000/tasks', this.newTask);
          const task = response.data;
          this.tasks.push(task);
        } catch (error) {
          console.error('Failed to add task:', error);
        }
      }
      this.resetForm();
    },

    async deleteTask(taskId) {
      try {
        await axios.delete(`http://localhost:3000/tasks/${taskId}`);
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    },

    async completeTask(taskId) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task && !task.completed) {
        task.completed = true;
        await this.updateTaskCompletion(task);
      } else {
        console.error('Task not found or already completed.');
      }
    },

    async uncompleteTask(taskId) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task && task.completed) {
        task.completed = false;
        await this.updateTaskCompletion(task);
      } else {
        console.error('Task not found or already uncompleted.');
      }
    },

    async updateTaskCompletion(task) {
      try {
        await axios.put(`http://localhost:3000/tasks/${task.id}`, task);
      } catch (error) {
        console.error('Failed to update task completion:', error);
      }
    },

    editTask(task) {
      this.editMode = true;
      this.editedTask = task;
      this.newTask = { ...task };
    },

    async updateTask() {
      if (!this.editedTask) {
        console.error('No task is being edited.');
        return;
      }

      try {
        await axios.put(`http://localhost:3000/tasks/${this.editedTask.id}`, this.newTask);
        Object.assign(this.editedTask, this.newTask);
        this.resetForm();
      } catch (error) {
        console.error('Failed to update task:', error);
      }
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

    showRegisterForm() {
      this.showRegister = true;
    },

    showLoginForm() {
      this.showRegister = false;
    },

    async registerUser() {
      if (!this.registerForm.username || !this.registerForm.password) {
        alert('Por favor ingrese un usuario y una contraseña válidos.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/users', this.registerForm);
        const user = response.data;
        this.users.push(user);
        alert('Usuario registrado exitosamente.');
        this.showLoginForm();
        this.resetForm();
      } catch (error) {
        console.error('Failed to register user:', error);
      }
    },

    async loginUser() {
      if (!this.loginForm.username || !this.loginForm.password) {
        alert("Por favor ingrese un usuario y una contraseña válidos.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/users?username=${this.loginForm.username}&password=${this.loginForm.password}`);
        const users = response.data;
        if (users.length === 0) {
          alert("Credenciales inválidas. Por favor, intente nuevamente.");
          return;
        }
        this.isLoggedIn = true;
        this.loggedInUser = this.loginForm.username;
        localStorage.setItem("loggedInUser", this.loginForm.username);
        alert("Inicio de sesión exitoso.");
      } catch (error) {
        console.error('Failed to login:', error);
      }
    },

    logout() {
      this.isLoggedIn = false;
      this.loggedInUser = "";
      localStorage.removeItem("loggedInUser");
      alert("Sesión cerrada exitosamente.");
    },
  },

  async created() {
    try {
      const response = await axios.get('http://localhost:3000/users');
      this.users = response.data;

      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        this.isLoggedIn = true;
        this.loggedInUser = loggedInUser;
      }

      const tasksResponse = await axios.get('http://localhost:3000/tasks');
      this.tasks = tasksResponse.data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
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

/* Estilos para el formulario de inicio de sesión */
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease-in-out;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}

.login-form input[type="text"],
.login-form input[type="password"] {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 2px solid #ccc;
  background-color: transparent;
  font-size: 1.2rem;
  color: #333;
  transition: border-color 0.3s ease-in-out;
}

.login-form input[type="text"]:focus,
.login-form input[type="password"]:focus {
  border-color: #45a049;
}

.login-form button {
  width: 100%;
  padding: 12px;
  background-color: #45a049;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.login-form button:hover {
  background-color: #388e3c;
}

/* Estilos para el formulario de registro */
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease-in-out;
}

.register-form h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}

.register-form input[type="text"],
.register-form input[type="password"] {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 2px solid #ccc;
  background-color: transparent;
  font-size: 1.2rem;
  color: #333;
  transition: border-color 0.3s ease-in-out;
}

.register-form input[type="text"]:focus,
.register-form input[type="password"]:focus {
  border-color: #45a049;
}

.register-form button {
  width: 100%;
  padding: 12px;
  background-color: #45a049;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.register-form button:hover {
  background-color: #388e3c;
}

/* Animación para mostrar los formularios */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.logout-button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.logout-button:hover {
  background-color: #45a049;
}

.logout-button:focus {
  outline: none;
}

.logout-button:active {
  background-color: #3c893d;
}

.login-form button,
.register-form button {
  margin-top: 20px;
}

.username {
  margin-right: 10px;
  font-size: 18px;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  cursor: pointer;
  transition: color 0.3s;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.username:hover {
  color: #000000;
}

.username::before {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000000;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.3s;
}

.username:hover::before {
  transform: scaleX(1);
}

</style>