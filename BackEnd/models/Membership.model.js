const mongoose = require("mongoose");
const MembershipSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: { type: String, enum: ["admin", "member"], required: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

MembershipSchema.index({ board: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Membership", MembershipSchema);
