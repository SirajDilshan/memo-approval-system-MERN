import React, { useState } from "react";
import axios from "axios";

const MemoForm = () => {
  const [memo, setMemo] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(  "http://localhost:5000/api/memos/create",
        memo,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("Memo submitted:", response.data);
      alert("Memo created successfully!");
      setMemo({ title: "", content: ""});
    } catch (error) {
      console.error("Error submitting memo:", error);
      alert("Failed to create memo.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-lg rounded bg-white">
      <h2 className="text-2xl font-bold mb-4">
       
        Create Memo</h2>

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
        Submit Memo
      </button>
    </div>
  );
};

export default MemoForm;
