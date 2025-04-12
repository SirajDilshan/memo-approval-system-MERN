// Sidebar.jsx
import React from 'react';

const Sidebar = ({ setActiveView }) => {
  return (
    <div className="w-60 bg-gray-800 text-white h-screen p-4">
      <ul>
        <li onClick={() => setActiveView("dashboard")} className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2">
          Dashboard
        </li>
        <li onClick={() => setActiveView("memos")} className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2">
          Memos
        </li>
        <li onClick={() => setActiveView("createMemo")} className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2">
          Create Memo
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
