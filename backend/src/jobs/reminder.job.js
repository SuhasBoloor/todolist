const cron = require("node-cron");
const Todo = require("../model/todo.model");

const initReminderJob = (io) => {
  // Check every minute: * * * * *
  cron.schedule("* * * * *", async () => {
    console.log("Running reminder check...");
    
    const now = new Date();
    const oneMinuteLater = new Date(now.getTime() + 60000);

    try {
      // Find todos where reminder is between now and 1 minute later
      // and task is not completed
      const pendingReminders = await Todo.find({
        reminder: {
          $gte: now,
          $lt: oneMinuteLater,
        },
        completed: false,
      }).populate("user");

      pendingReminders.forEach((todo) => {
        const userId = todo.user._id || todo.user;
        console.log(`Sending reminder to user ${userId} for todo: ${todo.title}`);
        
        // Emit to the user's specific room
        io.to(userId.toString()).emit("reminder", {
          id: todo._id,
          title: todo.title,
          dueDate: todo.dueDate,
          message: `Reminder: ${todo.title} is due soon!`,
        });
      });
    } catch (err) {
      console.error("Error in reminder job:", err);
    }
  });
};

module.exports = initReminderJob;
