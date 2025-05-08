import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const EditMemoFacultyCAA = () => {
  const { memos, viewId, setActiveView } = useAuth();
  const selectedMemo = memos.find((memo) => memo._id === viewId);

  const [title, setTitle] = useState(selectedMemo?.title || "");
  const [content, setContent] = useState(selectedMemo?.content || "");
  const [message, setMessage] = useState("");

  if (!selectedMemo) {
    return (
      <div className="p-6 text-gray-600">
        No memo selected or memo not found.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/memos/edit/${selectedMemo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Memo updated successfully!");
        setTimeout(() => {
          setActiveView("facultycaacreatedmemos");
        }, 1000);

        // ✅ Send notification to Head_Department role
        await axios.post(
          "http://localhost:5000/api/notifications/create",
          {
            memoId: selectedMemo._id,
            role: "AR_Faculty",
            message: "Memo Updated",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        setMessage(data.message || "Failed to update memo.");
      }
    } catch (error) {
      setMessage("Error updating memo.");
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit memo</h2>

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

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Update Memo
        </button>
      </form>
    </div>
  );
};

export default EditMemoFacultyCAA;
