const express = require("express");
const router = express.Router();

const todoController = require("../controller/todo.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { validateCreateTodo, validateUpdateTodo } = require("../middleware/todo.validator");

// protect all routes
router.use(authMiddleware);


router.post("/", validateCreateTodo, todoController.createTodo);

router.put("/:id", validateUpdateTodo, todoController.updateTodo);
router.get("/", todoController.getTodos);
router.delete("/:id", todoController.deleteTodo);

module.exports = router;