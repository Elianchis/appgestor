<template>
  <div class="container">
    <h1 class="title">GESTAPP</h1>
    <div class="task-container">
      <TaskForm @new-task="addTask" />
    </div>
    <div class="task-container">
      <h2 class="subtitle">Tareas Pendientes</h2>
      <TaskList :tasks="tasks.filter(task => !task.completed)" @update-task="updateTask" @delete-task="deleteTask" />
    </div>
    <div class="task-container">
      <h2 class="subtitle">Tareas Completadas</h2>
      <TaskList :tasks="tasks.filter(task => task.completed)" @update-task="updateTask" @delete-task="deleteTask" />
    </div>
  </div>
</template>

<script>
import TaskForm from './components/TaskForm.vue';
import TaskList from './components/TaskList.vue';

export default {
  name: 'App',
  components: {
    TaskForm,
    TaskList
  },
  data() {
    return {
      tasks: []
    };
  },
  methods: {
    addTask(task) {
      this.tasks.push(task);
    },
    updateTask(updatedTask) {
      const taskIndex = this.tasks.findIndex(
        (task) => task.id === updatedTask.id
      );
      this.tasks.splice(taskIndex, 1, updatedTask);
    },
    deleteTask(id) {
      const taskIndex = this.tasks.findIndex(task => task.id === id);
      this.tasks.splice(taskIndex, 1);
    }
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f2f2f2;
}

.title {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.subtitle {
  color: #333;
  text-align: center;
  margin-bottom: 10px;
}

.task-container {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  width: 50%;
  padding: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
}

.task-container button {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.task-container button.add-button {
  float: right;
  margin-bottom: 10px;
}

.task-container button.delete-button {
  float: right;
}
</style>
