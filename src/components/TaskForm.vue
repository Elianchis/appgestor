<template>
    <div>
      <h2>Añadir Tarea</h2>
      <form @submit.prevent="createTask">
        <div>
          <label for="title">Título</label>
          <input type="text" v-model="title" required />
        </div>
        <div>
          <label for="description">Descripción</label>
          <textarea v-model="description"></textarea>
        </div>
        <div>
          <button type="submit">Añadir Tarea</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TaskForm',
    data() {
      return {
        title: '',
        description: ''
      };
    },
    methods: {
      createTask() {
        const task = {
          id: new Date().getTime(),
          title: this.title,
          description: this.description,
          completed: false
        };
        this.$emit('new-task', task);
        this.title = '';
        this.description = '';
      }
    }
  };
  </script>
  
  <style scoped>
  form {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 5px;
    background-color: #f8f8f8;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input,
  textarea {
    display: block;
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button[type='submit'] {
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
  }
  </style>
  