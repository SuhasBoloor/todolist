const todoService = require("../service/todo.service");

// CREATE
const createTodo = async (req, res) => {
  try {
    const data = {
      ...req.body,
      user: req.user.id,
    };

    const todo = await todoService.createTodo(data);

    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET
const getTodos = async (req, res) => {
  try {
    const todos = await todoService.getTodos(req.user.id);
    res.json(todos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
const updateTodo = async (req, res) => {
  try {
    const todo = await todoService.updateTodo(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
const deleteTodo = async (req, res) => {
  try {
    await todoService.deleteTodo(req.params.id, req.user.id);

    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
};