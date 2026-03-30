const validateCreateTodo = (req, res, next) => {
  const { title, dueDate, reminder } = req.body;

  // title validation
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  // dueDate validation
  if (dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid due date" });
    }
  }

  // reminder validation
  if (reminder) {
    const date = new Date(reminder);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid reminder date" });
    }
  }

  next();
};

const validateUpdateTodo = (req, res, next) => {
  const { title, completed, dueDate, reminder } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({ error: "Invalid title" });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ error: "Completed must be boolean" });
  }

  if (dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid due date" });
    }
  }

  if (reminder) {
    const date = new Date(reminder);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: "Invalid reminder date" });
    }
  }

  next();
};

module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
};