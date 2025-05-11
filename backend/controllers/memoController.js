const crypto = require("crypto");
const Memo = require("../models/Memo");
const User = require("../models/User");
const { io } = require("../server");

exports.getAllMemos = async (req, res) => {
  try {
    const memos = await Memo.find().populate('createdBy', 'email role'); // Optional: populate createdBy details
    res.json(memos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};




// Create Memo (Only CAA of the Department & CAA of the Faculty)
exports.createMemo = async (req, res) => {
  try {
    const {memo_id, title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    if (!memo_id) {
      return res.status(400).json({ message: "id required" });
    }

    if (!["CAA_Department", "CAA_Faculty"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Only CAA can create memos." });
    }

    const existingMemo = await Memo.findOne({ memo_id });

    if (existingMemo) {
      return res.status(400).json({ message: "memo_id already exists." });
    }
    const newMemo = await Memo.create({
      memo_id,
      title,
      content,
      createdBy: req.user.id,
      approvals: [],
      status: "Pending"
    });

    res.status(201).json(newMemo);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.signARCampusMemo = async (req, res) => {

  try {
    const { memoId } = req.params;
    const { digitalSignature } = req.body;

    const memo = await Memo.findById(memoId);
    if (!memo) return res.status(404).json({ message: "Memo not found" });

    // Prevent duplicate signatures by the same user
    const alreadyApproved = memo.approvals.find(
      (approval) => approval.approvedBy.toString() === req.user.id.toString()
    );
    if (alreadyApproved) {
      return res.status(400).json({ message: "You have already signed this memo." });
    }

    // Add a new approval object with a snapshot of the memo at the time of approval
    memo.approvals.push({
      role: req.user.role,
      approvedBy: req.user.id,
      digitalSignature: digitalSignature,
      timestamp: Date.now()
    });

    // Optional: update status
    if (req.user.role === "AR_Campus") {
      memo.status = "Approved by AR Campus";
    }

    memo.updatedAt = Date.now();
    await memo.save();

    res.json(memo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.signARMemo = async (req, res) => {

  try {
    const { memoId } = req.params;
    const { digitalSignature } = req.body;

    const memo = await Memo.findById(memoId);
    if (!memo) return res.status(404).json({ message: "Memo not found" });

    // Prevent duplicate signatures by the same user
    const alreadyApproved = memo.approvals.find(
      (approval) => approval.approvedBy.toString() === req.user.id.toString()
    );
    if (alreadyApproved) {
      return res.status(400).json({ message: "You have already signed this memo." });
    }

    // Add a new approval object with a snapshot of the memo at the time of approval
    memo.approvals.push({
      role: req.user.role,
      approvedBy: req.user.id,
      digitalSignature: digitalSignature,
      timestamp: Date.now()
    });

    // Optional: update status
    if (req.user.role === "AR_Faculty") {
      memo.status = "Approved by AR";
    }

    memo.updatedAt = Date.now();
    await memo.save();

    res.json(memo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.signDeanMemo = async (req, res) => {
  try {
    const { memoId } = req.params;
    const { digitalSignature, title, content , memo_id} = req.body;

    const memo = await Memo.findById(memoId);
    if (!memo) return res.status(404).json({ message: "Memo not found" });

    // Prevent duplicate signatures by the same user
    const alreadyApproved = memo.approvals.find(
      (approval) => approval.approvedBy.toString() === req.user.id.toString()
    );
    if (alreadyApproved) {
      return res.status(400).json({ message: "You have already signed this memo." });
    }

    // Add a new approval object with a snapshot of the memo at the time of approval
    memo.approvals.push({
      role: req.user.role,
      approvedBy: req.user.id,
      digitalSignature: digitalSignature,
      memo_id: memo_id || memo.memo_id,
      title: title || memo.title,
      content: content || memo.content,
      timestamp: Date.now()
    });

    // Optional: update status
    if (req.user.role === "Dean_Faculty") {
      memo.status = "Approved by Dean";
    }

    memo.updatedAt = Date.now();
    await memo.save();

    res.json(memo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.signMemoAR = async (req, res) => {
  try {
    const { memoId } = req.params;
    const { digitalSignature, title, content , memo_id} = req.body;

    const memo = await Memo.findById(memoId);
    if (!memo) return res.status(404).json({ message: "Memo not found" });

    // Prevent duplicate signatures by the same user
    const alreadyApproved = memo.approvals.find(
      (approval) => approval.approvedBy.toString() === req.user.id.toString()
    );
    if (alreadyApproved) {
      return res.status(400).json({ message: "You have already signed this memo." });
    }

    // Add a new approval object with a snapshot of the memo at the time of approval
    memo.approvals.push({
      role: req.user.role,
      approvedBy: req.user.id,
      digitalSignature: digitalSignature,
      memo_id: memo_id || memo.memo_id,
      title: title || memo.title,
      content: content || memo.content,
      timestamp: Date.now()
    });

    // Optional: update status
    if (req.user.role === "AR_Faculty") {
      memo.status = "Approved by Faculty AR";
    }

    memo.updatedAt = Date.now();
    await memo.save();

    res.json(memo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Sign Memo (store digital signature along with title/content snapshot)
exports.signMemo = async (req, res) => {
  try {
    const { memoId } = req.params;
    const { digitalSignature, title, content , memo_id } = req.body;

    const memo = await Memo.findById(memoId);
    if (!memo) return res.status(404).json({ message: "Memo not found" });

    // Prevent duplicate signatures by the same user
    const alreadyApproved = memo.approvals.find(
      (approval) => approval.approvedBy.toString() === req.user.id.toString()
    );
    if (alreadyApproved) {
      return res.status(400).json({ message: "You have already signed this memo." });
    }

    // Add a new approval object with a snapshot of the memo at the time of approval
    memo.approvals.push({
      role: req.user.role,
      approvedBy: req.user.id,
      digitalSignature: digitalSignature,
      memo_id: memo_id || memo.memo_id,
      title: title || memo.title,
      content: content || memo.content,
      timestamp: Date.now()
    });

    // Optional: update status
    if (req.user.role === "Head_Department") {
      memo.status = "Approved by Head";
    }

    memo.updatedAt = Date.now();
    await memo.save();

    res.json(memo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Edit Memo (Only the creator can edit)
exports.editMemo = async (req, res) => {
  try {
    const { memoId } = req.params;
    const {memo_id,  title, content } = req.body;

    const memo = await Memo.findById(memoId);
    if (!memo) return res.status(404).json({ message: "Memo not found" });

    if (req.user.id.toString() !== memo.createdBy.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this memo" });
    }
    memo.memo_id = memo_id || memo.memo_id;
    memo.title = title || memo.title;
    memo.content = content || memo.content;
    memo.updatedAt = Date.now();
    await memo.save();

    res.json(memo);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Approve Memo with Digital Signature
exports.approveMemo = async (req, res) => {
  try {
    const { memoId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const memo = await Memo.findById(memoId);
    if (!memo) return res.status(404).json({ message: "Memo not found" });

    // Generate digital signature using user's private key
    const sign = crypto.createSign("SHA256");
    sign.update(memo.content);
    sign.end();
    const digitalSignature = sign.sign(user.privateKey, "hex");

    // Prevent duplicate approvals
    const alreadyApproved = memo.approvals.some(approval => approval.approvedBy.toString() === user._id.toString());
    if (alreadyApproved) {
      return res.status(400).json({ message: "You have already approved this memo." });
    }

    // Add approval entry
    memo.approvals.push({
      role: user.role,
      approvedBy: user._id,
      digitalSignature,
    });

    if (memo.approvals.length >= 3) {
      memo.status = "Approved";
    }

    await memo.save();

    io.emit("memoUpdated", { memoId: memo._id, status: memo.status, approvals: memo.approvals });

    res.json({ message: "Memo approved successfully", memo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.verifySignatures = async (req, res) => {
  try {
    const { memoId } = req.params;
    const memo = await Memo.findById(memoId).populate("approvals.approvedBy");
    if (!memo) return res.status(404).json({ message: "Memo not found" });

    let valid = true;
    for (const approval of memo.approvals) {
      const user = approval.approvedBy;
      const verify = crypto.createVerify("SHA256");
      verify.update(memo.content);
      verify.end();
      const isValid = verify.verify(user.privateKey, approval.digitalSignature, "hex");

      if (!isValid) {
        valid = false;
        break;
      }
    }

    res.json({ isValid, message: valid ? "All signatures are valid" : "Invalid signatures found" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Approve by Head of Department
exports.approveByHead = (req, res) => approveMemo(req, res, "Head_of_Department", "Approved by Head");

// Approve by AR of Faculty
exports.approveByAR = (req, res) => approveMemo(req, res, "AR_Faculty", "Approved by AR");

// Approve by Dean of Faculty
exports.approveByDean = (req, res) => approveMemo(req, res, "Dean_Faculty", "Approved by Dean");

// Approve by AR of Campus
exports.approveByCampusAR = (req, res) => approveMemo(req, res, "AR_Campus", "Approved by AR Campus");

// Faculty Board Decision
exports.facultyBoardDecision = async (req, res) => {
  try {
    const { memoId } = req.params;
    const { decision } = req.body;

    if (!["Accepted", "Rejected"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision. Must be 'Accepted' or 'Rejected'." });
    }

    const memo = await Memo.findById(memoId);
    if (!memo) return res.status(404).json({ message: "Memo not found" });


    memo.status = "Faculty Board Decision: " + decision;
    memo.facultyBoardDecision = decision;
  
    await memo.save();

    res.json(memo);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Campus Board Decision
exports.campusBoardDecision = async (req, res) => {
  try {
    const { memoId } = req.params;
    const { decision} = req.body;

    if (!["Accepted", "Rejected"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision. Must be 'Accepted' or 'Rejected'." });
    }

    const memo = await Memo.findById(memoId);
    if (!memo) return res.status(404).json({ message: "Memo not found" });

    memo.status = "Campus Board Decision: " + decision;
    memo.campusBoardDecision =  decision ;
    await memo.save();

    res.json(memo);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


// Get Memo Status
exports.getMemoStatus = async (req, res) => {
  try {
    const { memoId } = req.params;
    const memo = await Memo.findById(memoId);
    if (!memo) return res.status(404).json({ message: "Memo not found" });

    res.json({
      memo_id: memo.memo_id,
      title: memo.title,
      content: memo.content,
      status: memo.status,
      approvals: memo.approvals,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
