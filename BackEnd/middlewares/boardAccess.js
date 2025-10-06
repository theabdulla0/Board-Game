const Membership = require("../models/Membership.model");
const Board = require("../models/board.model");

const requireBoardMember = (paramName = "boardId") => {
  return async (req, res, next) => {
    try {
      const boardId = req.params[paramName] || req.body.boardId;
      if (!boardId)
        return res.status(400).json({ message: "boardId required" });

      const board = await Board.findById(boardId);
      if (!board || board.isDeleted)
        return res.status(404).json({ message: "Board not found" });

      const membership = await Membership.findOne({
        board: boardId,
        user: req.user.id,
      });
      if (!membership)
        return res
          .status(403)
          .json({ message: "Access denied (not a member)" });

      req.board = board;
      req.membership = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
};

const requireBoardAdmin = (req, res, next) => {
  if (!req.membership || req.membership.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

module.exports = { requireBoardMember, requireBoardAdmin };
