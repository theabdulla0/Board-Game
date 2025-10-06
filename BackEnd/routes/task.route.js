const express = require("express");
const router = express.Router();
const {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { requireBoardMember } = require("../middlewares/boardAccess");


router.use(authMiddleware);
// Query/filter/pagination
router.get("/boards/:boardId/tasks", requireBoardMember("boardId"), listTasks);

// Create in a column within a board
router.post(
  "/boards/:boardId/tasks",
  requireBoardMember("boardId"),
  createTask
);

// Update/delete by task id (membership validated by controller via task.board)
router.patch("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTask);

// Drag-and-drop move
router.post(
  "/boards/:boardId/tasks/:taskId/move",
  requireBoardMember("boardId"),
  moveTask
);

module.exports = router;
