const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // Enter your MySQL password here if applicable
  database: 'gestapp_db',
});

connection.connect((error) => {
  if (error) {
    console.error('Failed to connect to the database:', error);
  } else {
    console.log('Connected to the database!');
  }
});

app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Failed to fetch tasks from the database:', error);
      res.status(500).json({ error: 'Failed to fetch tasks from the database' });
    } else {
      res.json(results);
    }
  });
});

app.post('/tasks', (req, res) => {
  const newTask = req.body;

  const query = 'INSERT INTO tasks SET ?';

  connection.query(query, newTask, (error, result) => {
    if (error) {
      console.error('Failed to add task to the database:', error);
      res.status(500).json({ error: 'Failed to add task to the database' });
    } else {
      newTask.id = result.insertId;
      res.json(newTask);
    }
  });
});

app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTask = req.body;

  const query = 'UPDATE tasks SET ? WHERE id = ?';

  connection.query(query, [updatedTask, taskId], (error) => {
    if (error) {
      console.error('Failed to update task in the database:', error);
      res.status(500).json({ error: 'Failed to update task in the database' });
    } else {
      res.json(updatedTask);
    }
  });
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);

  const query = 'DELETE FROM tasks WHERE id = ?';

  connection.query(query, taskId, (error) => {
    if (error) {
      console.error('Failed to delete task from the database:', error);
      res.status(500).json({ error: 'Failed to delete task from the database' });
    } else {
      res.sendStatus(204);
    }
  });
});

app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Failed to fetch users from the database:', error);
      res.status(500).json({ error: 'Failed to fetch users from the database' });
    } else {
      res.json(results);
    }
  });
});

app.post('/users', (req, res) => {
  const newUser = req.body;

  const query = 'INSERT INTO users SET ?';

  connection.query(query, newUser, (error, result) => {
    if (error) {
      console.error('Failed to add user to the database:', error);
      res.status(500).json({ error: 'Failed to add user to the database' });
    } else {
      newUser.id = result.insertId;
      res.json(newUser);
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
