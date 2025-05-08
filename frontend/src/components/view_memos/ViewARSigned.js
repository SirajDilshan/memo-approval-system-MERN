import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SignaturePad from "../sign_decision/SignaturePad";

const ViewARSigned = () => {
  const {
    memos,
    viewId,
    currentUser,
    signatureDataURL,
    setSignatureDataURL,
    setMemos,
    setActiveView,
  } = useAuth();

  const selectedMemo = memos?.find((memo) => memo._id === viewId);

  // Inside HeadApprove component
  useEffect(() => {
    // Clear previous signature when opening a new memo
    setSignatureDataURL(null);
  }, [viewId,setSignatureDataURL]); // Runs when a new memo is selected

  if (!selectedMemo) {
    return (
      <div className="p-6 text-center text-gray-600">
        No memo selected or memo not found.
      </div>
    );
  }

  const handleApprove = async () => {
    if (!signatureDataURL) {
      alert("Please sign before approving the memo.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/memos/signDean/${selectedMemo._id}`,
        { digitalSignature: signatureDataURL },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local memo state
      setMemos((prev) =>
        prev.map((memo) =>
          memo._id === selectedMemo._id ? response.data : memo
        )
      );

      alert("Memo approved successfully!");
      setActiveView("deanallmemos");
    } catch (error) {
      console.error("Error approving memo:", error);
      alert("An error occurred while approving the memo.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Memo Details</h2>

      {/* Memo Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <strong>Title:</strong> {selectedMemo.title}
        </div>
        <div>
          <strong>Status:</strong> {selectedMemo.status}
        </div>
        <div>
          <strong>Created By:</strong> {selectedMemo.createdBy?.email} (
          {selectedMemo.createdBy?.role})
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {new Date(selectedMemo.createdAt).toLocaleString()}
        </div>
        <div>
          <strong>Updated At:</strong>{" "}
          {new Date(selectedMemo.updatedAt).toLocaleString()}
        </div>
        
        <div>
          <strong>Campus Decision:</strong>{" "}
          {selectedMemo.campusBoardDecision || "Pending"}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Content</h3>
        <p className="bg-gray-50 p-4 rounded-md text-gray-800 leading-relaxed whitespace-pre-wrap">
          {selectedMemo.content}
        </p>
      </div>

      {/* Approval History (with signature, roles, timestamps) */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Approval History
        </h3>
        {selectedMemo.approvals && selectedMemo.approvals.length > 0 ? (
          <ul className="space-y-4 text-sm text-gray-700">
            {selectedMemo.approvals.map((approval, index) => (
              <li
                key={index}
                className="p-3 border rounded-md shadow-sm bg-gray-50"
              >
                <div>
                  <strong>Role:</strong> {approval.role}
                </div>
                <div>
                  <strong>Approved By:</strong> {approval.approvedBy}
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(approval.timestamp).toLocaleString()}
                </div>
                {approval.digitalSignature && (
                  <div className="mt-2">
                    <strong>Digital Signature:</strong>
                    <img
                      src={approval.digitalSignature}
                      alt="Digital Signature"
                      className="mt-1 border rounded w-48"
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No approvals yet.</p>
        )}
      </div>

      <button
        onClick={() => setActiveView("rectormemos")}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        OK
      </button>
    </div>
  );
};

export default ViewARSigned;
