const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema({
  role: { type: String, required: true }, 
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  digitalSignature: { type: String, required: true }, // Store digital signature
  timestamp: { type: Date, default: Date.now }
});

const memoSchema = new mongoose.Schema({
  memo_id: {type: String, required: true},
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  status: { 
    type: String,
    enum: [
      "Pending", "Approved by Head", "Approved by AR", "Approved by Faculty AR",
      "Faculty Board Decision: Accepted", "Approved by Dean", "Approved by AR Campus", 
      "Campus Board Decision: Accepted","Campus Board Decision: Rejected","Faculty Board Decision: Rejected"
    ], 
    default: "Pending"
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  approvals: [approvalSchema],
  facultyBoardDecision: { type: String, enum: ["Accepted", "Rejected"], default: null },
  campusBoardDecision: { type: String, enum: ["Accepted", "Rejected"], default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Memo", memoSchema);
