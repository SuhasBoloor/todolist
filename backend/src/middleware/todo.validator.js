const validateCreateTodo = (req, res, next) => {
  const { title, dueDate, reminder, color, board } = req.body;

  // title validation
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  if (color !== undefined && typeof color !== "string") {
    return res.status(400).json({ error: "Invalid color format" });
  }

  if (board !== undefined && typeof board !== "string") {
    return res.status(400).json({ error: "Invalid board name" });
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
  const { title, completed, dueDate, reminder, color, board } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({ error: "Invalid title" });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ error: "Completed must be boolean" });
  }

  if (color !== undefined && typeof color !== "string") {
    return res.status(400).json({ error: "Invalid color format" });
  }

  if (board !== undefined && typeof board !== "string") {
    return res.status(400).json({ error: "Invalid board name" });
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