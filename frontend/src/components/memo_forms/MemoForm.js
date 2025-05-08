import React, { useState } from "react";
import axios from "axios";

const MemoForm = () => {


  const [memo, setMemo] = useState({
    title: "",
    content: "",
  });

  const [message, setMessage] = useState(null); // For success or error messages
  const [isError, setIsError] = useState(false); // To distinguish error or success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/memos/create",
        memo,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("Memo submitted:", response.data);
      setMessage("✅ Memo created successfully!");

      setTimeout(() => {
        setMessage("");
      }, 2000);
      
      setIsError(false);
      setMemo({ title: "", content: "" });
    } catch (error) {
      console.error("Error submitting memo:", error);
      setMessage("❌ Failed to create memo.");

      setTimeout(() => {
        setMessage("");

      }, 2000);
      setIsError(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-lg rounded bg-white">
      <h2 className="text-2xl font-bold mb-4">Create Memo</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Title</label>
        <input
          type="text"
          name="title"
          value={memo.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Content</label>
        <textarea
          name="content"
          value={memo.content}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows="5"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit to Head
      </button>
    </div>
  );
};

export default MemoForm;
