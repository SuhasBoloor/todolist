const todoRepository = require("../repository/todo.repo");

// CREATE
const createTodo = async (data) => {
  if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
    throw new Error("Expiry date cannot be in the past");
  }

  return await todoRepository.createTodo(data);
};

// GET
const getTodos = async (userId) => {
  return await todoRepository.getTodosByUser(userId);
};

// UPDATE
const updateTodo = async (id, userId, data) => {
  const todo = await todoRepository.getTodoById(id);

  if (!todo) throw new Error("Todo not found");

  if (todo.user.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  if (todo.completed) {
    throw new Error("Cannot update completed task");
  }

  return await todoRepository.updateTodo(id, data);
};

// DELETE
const deleteTodo = async (id, userId) => {
  const todo = await todoRepository.getTodoById(id);

  if (!todo) throw new Error("Todo not found");

  if (todo.user.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  return await todoRepository.deleteTodo(id);
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
};