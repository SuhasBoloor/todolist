const cron = require("node-cron");
const Todo = require("../models/todo.model");

// runs every minute
const startTodoJob = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running Todo Cron Job...");

    const now = new Date();

    try {
      // 1. Find expired todos
      const expiredTodos = await Todo.find({
        expiryDate: { $lt: now },
        completed: false,
      });

      // 2. Mark them completed (auto-expire)
      for (let todo of expiredTodos) {
        todo.completed = true;
        await todo.save();

        console.log(`Todo expired: ${todo.title}`);
      }

      // 3. Reminder logic
      const reminderTodos = await Todo.find({
        reminder: true,
        expiryDate: { $gte: now },
        completed: false,
      });

      reminderTodos.forEach((todo) => {
        console.log(`Reminder: ${todo.title} is pending`);
      });

    } catch (err) {
      console.error("Cron error:", err.message);
    }
  });
};

module.exports = startTodoJob;