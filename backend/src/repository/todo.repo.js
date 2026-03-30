const Todo = require("../model/todo.model");

const createTodo = (data) => {
  return Todo.create(data);
};

const getTodosByUser = (userId) => {
  return Todo.find({ user: userId });
};

const getTodoById = (id) => {
  return Todo.findById(id);
};

const updateTodo = (id, data) => {
  return Todo.findByIdAndUpdate(id, data, { new: true });
};

const deleteTodo = (id) => {
  return Todo.findByIdAndDelete(id);
};

module.exports = {
  createTodo,
  getTodosByUser,
  getTodoById,
  updateTodo,
  deleteTodo,
};