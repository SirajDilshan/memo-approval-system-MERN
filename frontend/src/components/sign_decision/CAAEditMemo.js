import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import SignaturePad from "./SignaturePad";
import axios from "axios";

const CAAEditMemo = () => {
  const {
    memos,
    setActiveView,
    viewId,
    signatureDataURL,
    setSignatureDataURL,
    setCaaNotifications,
  } = useAuth();

  const selectedMemo = memos.find((memo) => memo._id === viewId);
  const [notifyToCaa, setNotifyToCaa] = useState(false);
  const [caaMessage, setCaaMessage] = useState("");
  const [title, setTitle] = useState(selectedMemo?.title || "");
  const [content, setContent] = useState(selectedMemo?.content || "");
  const [message, setMessage] = useState("");
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const digitalSignature = signatureDataURL;

  useEffect(() => {
    // Clear previous signature when a new memo is selected
    setSignatureDataURL(null);
  }, [viewId]);

  if (!selectedMemo) {
    return (
      <div className="p-6 text-gray-600">
        No memo selected or memo not found.
      </div>
    );
  }

  const handleSignClick = () => {
    setShowSignaturePad(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/memos/signAR2/${selectedMemo._id}`,
        { title, content, digitalSignature },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Memo signed and submitted successfully!");
      setTimeout(() => {
        setActiveView("campuslevelmemos");
      }, 2000);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Error signing memo.";
      setMessage(errorMsg);
    }
  };

  const handleNotify = async () => {
    if (caaMessage.trim() === "") return;

    const token = sessionStorage.getItem("token");
    const memoId = selectedMemo._id;
    const role = "CAA_Faculty"; // or set dynamically if needed
    const message = caaMessage;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/notifications/create",
        {
          memoId,
          role,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optionally store locally in context
      setCaaNotifications((prev) => [...prev, message]);
      setMessage("CAA has been notified.");
      setCaaMessage("");
      setNotifyToCaa(false);
      setActiveView("campuslevelmemos");
    } catch (error) {
      console.error("Failed to send notification:", error);
      setMessage("Error notifying CAA.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Approve Memo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>
        </div>

        {message && <div className="text-sm text-green-600">{message}</div>}

        {!showSignaturePad && (
          <button
            type="button"
            onClick={handleSignClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Sign Memo
          </button>
        )}

        <button
          type="button"
          onClick={() => setNotifyToCaa(true)}
          className="ml-4 text-sm text-yellow-600 underline"
        >
          Send notification to CAA
        </button>

        {notifyToCaa && (
          <div className="mt-2">
            <textarea
              value={caaMessage}
              onChange={(e) => setCaaMessage(e.target.value)}
              placeholder="Enter notification message..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2"
              rows="3"
            ></textarea>
            <button
              type="button"
              onClick={handleNotify}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition mt-2"
            >
              Notify CAA
            </button>
          </div>
        )}

        {showSignaturePad && (
          <>
            <SignaturePad />

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition mt-4"
            >
              Submit Signed Memo
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default CAAEditMemo;
