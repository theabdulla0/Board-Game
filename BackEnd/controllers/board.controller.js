const Board = require("../models/board.model");
const User = require("../models/auth.model");
const Column = require("../models/column.model");
const Membership = require("../models/Membership.model");
const mongoose = require('mongoose')
const listBoards = async (req, res, next) => {
  try {
    const memberships = await Membership.find({ user: req.user.id }).select(
      "board role"
    );
    const boardIds = memberships.map((m) => m.board);
    const boards = await Board.find({
      _id: { $in: boardIds },
      isDeleted: false,
    }).sort({ updatedAt: -1 });
    const roleMap = Object.fromEntries(
      memberships.map((m) => [m.board.toString(), m.role])
    );
    res.json(
      boards.map((b) => ({ ...b.toObject(), role: roleMap[b._id.toString()] }))
    );
  } catch (err) {
    next(err);
  }
};

const createBoard = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction();
  try {
    const { title } = req.body;
    if (!title?.trim())
      return res.status(400).json({ message: "Title is required" });

    const board = await Board.create(
      [{ title: title.trim(), createdBy: req.user.id }],
      { session }
    );
    const boardDoc = board[0];

    await Membership.create(
      [{ board: boardDoc._id, user: req.user.id, role: "admin" }],
      { session }
    );

    // Optional default columns
    const defaults = ["Todo", "In Progress", "Done"];
    await Column.insertMany(
      defaults.map((t, i) => ({ board: boardDoc._id, title: t, order: i })),
      { session }
    );

    await session.commitTransaction();
    res.status(201).json(boardDoc);
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

const getBoard = async (req, res, next) => {
  try {
    const columns = await Column.find({ board: req.board._id }).sort({
      order: 1,
    });
    res.json({ board: req.board, columns });
  } catch (err) {
    next(err);
  }
};

const updateBoard = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title?.trim())
      return res.status(400).json({ message: "Title required" });
    const updated = await Board.findOneAndUpdate(
      { _id: req.board._id },
      { $set: { title: title.trim() } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteBoard = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const boardId = req.board._id;

    await Board.updateOne(
      { _id: boardId },
      { $set: { isDeleted: true } },
      { session }
    );
    await session.commitTransaction();
    res.json({ message: "Board deleted" });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

const addMember = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !["admin", "member"].includes(role)) {
      return res
        .status(400)
        .json({ message: "userId and valid role required" });
    }
    const doc = await Membership.findOneAndUpdate(
      { board: req.board._id, user: userId },
      { $set: { role, invitedBy: req.user.id } },
      { new: true, upsert: true }
    );
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (
      req.user.id.toString() === userId.toString() &&
      req.membership.role === "admin"
    ) {
      // prevent removing last admin in your own project if needed; for now allow
    }
    await Membership.deleteOne({ board: req.board._id, user: userId });
    res.json({ message: "Member removed" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createBoard,
  getBoard,
  deleteBoard,
  listBoards,
  addMember,
  removeMember,
  updateBoard
};
