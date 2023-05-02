<template>
  <ul>
    <li v-for="task in tasks" :key="task.id" :class="{ completed: task.completed }">
      <input type="checkbox" v-model="task.completed" @change="updateTask(task)" />
      <span>{{ task.title }}</span>
      <button @click="deleteTask(task)" class="delete-button">Eliminar</button>
      <p v-if="task.description">{{ task.description }}</p>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TaskList',
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  methods: {
    updateTask(task) {
      this.$emit('update-task', task);
    },
    deleteTask(task) {
      const confirmDelete = confirm(`¿Seguro que quieres eliminar la tarea "${task.title}"?`);
      if (confirmDelete) {
        const taskIndex = this.tasks.findIndex(t => t.id === task.id);
        this.tasks.splice(taskIndex, 1);
      }
    }
  }
};
</script>

<style scoped>
.completed {
  text-decoration: line-through;
}
.delete-button {
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
