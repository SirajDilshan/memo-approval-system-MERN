// Sidebar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { setActiveView, currentUser } = useAuth(); // default view

  return (
    <div className="w-60 bg-gray-800 text-white  p-4">
      <ul>
        <li
          onClick={() => setActiveView("dashboard")}
          className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
        >
          Dashboard
        </li>
        {currentUser === "CAA_Department" && (
          <li
            onClick={() => setActiveView("memos")}
            className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
          >
            memos
          </li>
        )}
        {currentUser === "Head_Department" && (
          <li
            onClick={() => setActiveView("memos")}
            className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
          >
            memos
          </li>
        )}
        {currentUser === "CAA_Department" && (
          <li
            onClick={() => setActiveView("createMemo")}
            className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
          >
            Create Memo
          </li>
        )}
        {currentUser === "AR_Faculty" && (
          <>
            <li
              onClick={() => setActiveView("approvedByHead")}
              className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
            >
              Faculty Memos
            </li>
            <li
              onClick={() => setActiveView("approvedByFacultyAR")}
              className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
            >
              Faculty Board decision
            </li>
            <li
              onClick={() => setActiveView("campuslevelmemos")}
              className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
            >
              Campus Memos
            </li>
          </>
        )}
        {currentUser === "CAA_Faculty" && (
          <>
            <li
              onClick={() => setActiveView("allMemosFacultycaa")}
              className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
            >
              All Memos
            </li>
            <li
              onClick={() => setActiveView("createMemoFaculty")}
              className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
            >
              Create Memo
            </li>
          </>
        )}
        {currentUser === "Dean_Faculty" && (
          <>
            <li
              onClick={() => setActiveView("deanallmemos")}
              className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
            >
              All Memos
            </li>
          </>
        )}
        {currentUser === "AR_Campus" && (
          <>
            <li
              onClick={() => setActiveView("arcampusmemos")}
              className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
            >
              All Memos
            </li>
            <li
              onClick={() => setActiveView("campusboarddecision")}
              className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
            >
              Campus Board Decision
            </li>
          </>
        )}
        {currentUser === "Rector" && (
          <>
            <li
              onClick={() => setActiveView("rectormemos")}
              className="block py-2 cursor-pointer hover:bg-gray-700 rounded px-2"
            >
              All Memos
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
