const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});
app.use(express.json());

app.use(cors());

app.use("/auth", require("./routes/auth.route"));
app.use("/board", require("./routes/board.route"));
app.use("/task", require("./routes/task.route"));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8000;

// Start the server
httpServer.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running with Socket.IO on port ${PORT}`);
});
