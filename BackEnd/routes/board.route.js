const express = require("express");
const route = express.Router();
const {
  createBoard,
  getBoard,
  deleteBoard,
  listBoards,
  addMember,
  removeMember,
  updateBoard,
} = require("../controllers/board.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  requireBoardAdmin,
  requireBoardMember,
} = require("../middlewares/boardAccess");

route.use(authMiddleware);

route.post("/create", createBoard);
route.get("/", getBoard);

route.get("/:boardId", requireBoardMember("boardId"), getBoard);
route.patch(
  "/:boardId",
  requireBoardMember("boardId"),
  requireBoardAdmin,
  updateBoard
);
route.delete(
  "/:boardId",
  requireBoardMember("boardId"),
  requireBoardAdmin,
  deleteBoard
);
//  Membership management (admin only)
route.post(
  "/:boardId/members",
  requireBoardMember("boardId"),
  requireBoardAdmin,
  addMember
);
route.delete(
  "/:boardId/members/:userId",
  requireBoardMember("boardId"),
  requireBoardAdmin,
  removeMember
);

module.exports = route;
