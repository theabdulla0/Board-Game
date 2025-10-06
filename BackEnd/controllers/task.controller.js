const mongoose = require("mongoose");
const Task = require("../models/task.model");
const Column = require("../models/column.model");
const Membership = require("../models/Membership.model");

// Helpers
const ensureMember = async (userId, boardId) => {
  const mem = await Membership.findOne({ board: boardId, user: userId });
  if (!mem) throw Object.assign(new Error("Forbidden"), { status: 403 });
  return mem;
};

const listTasks = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    await ensureMember(req.user.id, boardId);

    const {
      q,
      assignedTo,
      dueFrom,
      dueTo,
      columnId,
      page = 1,
      limit = 10,
    } = req.query;
    const filter = { board: boardId };
    if (columnId) filter.column = columnId;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (q) filter.$text = { $search: q };
    if (dueFrom || dueTo) {
      filter.dueDate = {};
      if (dueFrom) filter.dueDate.$gte = new Date(dueFrom);
      if (dueTo) filter.dueDate.$lte = new Date(dueTo);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Task.find(filter)
        .sort({ column: 1, order: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pageCount: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err.status ? err : Object.assign(err, { status: 500 }));
  }
};

const createTask = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const {
      columnId,
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      labels,
    } = req.body;

    await ensureMember(req.user.id, boardId);
    const col = await Column.findOne({ _id: columnId, board: boardId });
    if (!col) return res.status(400).json({ message: "Invalid column" });

    const last = await Task.findOne({ column: col._id })
      .sort({ order: -1 })
      .select("order");
    const order = last ? last.order + 1 : 0;

    const task = await Task.create({
      board: boardId,
      column: col._id,
      title: title?.trim(),
      description: description || "",
      assignedTo: assignedTo || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || "medium",
      labels: Array.isArray(labels) ? labels : [],
      order,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await ensureMember(req.user.id, task.board);

    const { title, description, assignedTo, dueDate, priority, labels } =
      req.body;

    const updated = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: {
          ...(title !== undefined ? { title: title.trim() } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(assignedTo !== undefined ? { assignedTo } : {}),
          ...(dueDate !== undefined
            ? { dueDate: dueDate ? new Date(dueDate) : null }
            : {}),
          ...(priority !== undefined ? { priority } : {}),
          ...(labels !== undefined ? { labels } : {}),
          updatedBy: req.user.id,
        },
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await ensureMember(req.user.id, task.board);
    await Task.deleteOne({ _id: taskId });

    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

// Server-authoritative drag-and-drop move
// body: { toColumnId, toIndex }
const moveTask = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { boardId, taskId } = req.params;
    const { toColumnId, toIndex } = req.body;

    if (toIndex === undefined || toIndex < 0) {
      return res.status(400).json({ message: "toIndex required and >= 0" });
    }

    await ensureMember(req.user.id, boardId);

    const task = await Task.findOne({ _id: taskId, board: boardId }).session(
      session
    );
    if (!task) return res.status(404).json({ message: "Task not found" });

    const fromColumnId = task.column.toString();
    const toColumn = await Column.findOne({
      _id: toColumnId,
      board: boardId,
    }).session(session);
    if (!toColumn)
      return res.status(400).json({ message: "Invalid destination column" });

    // Fetch tasks in both columns to recompute order numbers
    const [fromTasks, toTasksRaw] = await Promise.all([
      Task.find({ column: fromColumnId }).sort({ order: 1 }).session(session),
      Task.find({ column: toColumnId }).sort({ order: 1 }).session(session),
    ]);

    // Remove the moved task from its current list
    const toTasks = toTasksRaw.map((t) => t.toObject());
    const moving = task.toObject();

    // If moving within same column, work with one array
    if (fromColumnId === toColumnId) {
      const items = fromTasks.map((t) => t.toObject());
      const curIndex = items.findIndex((t) => t._id.toString() === taskId);
      if (curIndex === -1) throw new Error("Task not in expected column");

      const [removed] = items.splice(curIndex, 1);
      items.splice(toIndex, 0, removed);

      // Reindex only if needed
      await Promise.all(
        items.map((t, idx) =>
          Task.updateOne({ _id: t._id }, { $set: { order: idx } }, { session })
        )
      );
      await session.commitTransaction();
      return res.json({ message: "Moved", fromColumnId, toColumnId, toIndex });
    }

    // Across columns
    const fromItems = fromTasks
      .map((t) => t.toObject())
      .filter((t) => t._id.toString() !== taskId);
    toTasks.splice(Math.min(toIndex, toTasks.length), 0, moving);

    // Reindex both columns
    await Promise.all([
      ...fromItems.map((t, idx) =>
        Task.updateOne({ _id: t._id }, { $set: { order: idx } }, { session })
      ),
      ...toTasks.map((t, idx) =>
        Task.updateOne(
          { _id: t._id },
          { $set: { column: toColumnId, order: idx, updatedBy: req.user.id } },
          { session }
        )
      ),
    ]);

    await session.commitTransaction();
    res.json({ message: "Moved", fromColumnId, toColumnId, toIndex });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
};
