require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// ✅ Validate env properly
if (!process.env.PORT) {
  console.error("PORT missing in .env");
  process.exit(1);
}

if (!process.env.DB_URL) {
  console.error("MONGO_URI missing in .env");
  process.exit(1);
}

// ✅ Connect DB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health route
app.get("/", (req, res) => {
  res.send("API running");
});

// ✅ Socket.io
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Attach io to app for use in routes/controllers
app.set("io", io);

// ✅ Reminder Job
const initReminderJob = require("./src/jobs/reminder.job");
initReminderJob(io);

// ✅ User routes
app.use("/api/users", require("./src/route/user.route"));

// ✅ Todo routes
app.use("/api/todos", require("./src/route/todo.route"));

const PORT = process.env.PORT || 5000;

// ✅ Start server
server.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);