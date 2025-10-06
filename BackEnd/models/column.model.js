const mongoose = require("mongoose");
const ColumnSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

ColumnSchema.index({ board: 1, order: 1 }, { unique: true });

module.exports = mongoose.model("Column", ColumnSchema);
