const express = require("express");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createMemo,
  editMemo,
  approveByHead,
  approveByAR,
  facultyBoardDecision,
  approveByDean,
  approveByCampusAR,
  campusBoardDecision,
  getMemoStatus,
  getAllMemos ,
  signMemo,
  signARMemo,
  signDeanMemo,
  signARCampusMemo,
  signMemoAR
} = require("../controllers/memoController");

const router = express.Router();


// Get all memos (authenticated users only)
router.put("/approve-ar/:memoId", authMiddleware, authorizeRoles(["AR_Faculty"]), approveByAR);
router.get("/all", authMiddleware, authorizeRoles(["CAA_Department", "CAA_Faculty","Head_Department","Dean_Faculty","Campus Board","AR_Faculty","AR_Campus","Rector"]), getAllMemos);


// Only "CAA_Department" and "CAA_Faculty" can create memos
router.post("/create", authMiddleware, authorizeRoles(["CAA_Department", "CAA_Faculty"]), createMemo);

// Edit a memo (Only CAA_Department and Head_Department can edit)
router.put("/edit/:memoId", authMiddleware, authorizeRoles(["CAA_Faculty","CAA_Department", "Head_Department"]), editMemo);

router.put("/sign/:memoId", authMiddleware, authorizeRoles([ "Head_Department"]), signMemo);
router.put("/signAR/:memoId", authMiddleware, authorizeRoles([ "AR_Faculty"]), signARMemo);
router.put("/signDean/:memoId", authMiddleware, authorizeRoles([ "Dean_Faculty"]), signDeanMemo);
router.put("/signARCampus/:memoId", authMiddleware, authorizeRoles([ "AR_Campus"]), signARCampusMemo);
router.put("/signAR2/:memoId", authMiddleware, authorizeRoles([ "AR_Faculty"]), signMemoAR);



// Approve memo at different levels (Signature Required)
router.put("/approve-head/:memoId", authMiddleware, authorizeRoles(["Head_Department"]), approveByHead);
router.put("/approve-ar/:memoId", authMiddleware, authorizeRoles(["AR_Faculty"]), approveByAR);

router.put("/campus-board/:memoId", authMiddleware, authorizeRoles(["AR_Campus"]), campusBoardDecision);
router.put("/faculty-board/:memoId", authMiddleware, authorizeRoles(["AR_Faculty"]), facultyBoardDecision);

router.put("/approve-dean/:memoId", authMiddleware, authorizeRoles(["Dean_Faculty"]), approveByDean);
router.put("/approve-campus-ar/:memoId", authMiddleware, authorizeRoles(["AR_Campus"]), approveByCampusAR);

// Get memo status (Any authenticated user)
router.get("/status/:memoId", authMiddleware, getMemoStatus);

// Get memo status (Any authenticated user)
router.get("/status/:memoId", authMiddleware, getMemoStatus);

module.exports = router;
