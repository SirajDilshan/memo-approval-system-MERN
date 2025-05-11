// Dashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import DashboardRouter from "./DashboardRouter";
import MemoForm from "../components/memo_forms/MemoForm";
import AllMemos from "../components/view_memos/AllMemos";
import { useAuth } from "../context/AuthContext";
import ViewMemo from "../components/view_memos/ViewMemo";
import EditMemo from "../components/edit_memos/EditMemo";
import HeadApprove from "../components/sign_decision/HeadApprove";
import ApprovedByHead from "../components/view_memos/ApprovedByHead";
import ARDecision from "../components/sign_decision/ARDecision";
import ARApproved from "../components/view_memos/ARApproved";
import CAAMemoForm from "../components/memo_forms/CAAMemoForm";
import CAAEditMemo from "../components/sign_decision/CAAEditMemo";
import CAAAllMemos from "../components/view_memos/CAAAllMemos";
import CampusLevelMemos from "../components/view_memos/CampusLevelMemos";
import DeanAllMemos from "../components/view_memos/DeanAllMemos";
import DeanSign from "../components/sign_decision/DeanSign";
import ARCampusMemos from "../components/view_memos/ARCampusMemos";
import ARCampusSign from "../components/sign_decision/ARCampusSign";
import CampusBoardDecision from "../components/view_memos/CampusBoardDecision";
import ARCampusDecision from "../components/sign_decision/ARCampusDecision";
import RectorMemos from "../components/view_memos/RectorMemos";
import EditMemoFacultyCAA from "../components/edit_memos/EditMemoFacultyCAA";
import ViewCampusLevelMemo from "../components/view_memos/ViewCampusLevelMemos";
import ViewFacultyLevelMemos from "../components/view_memos/ViewFacultyLevelMemos";
import ViewARSigned from "../components/view_memos/ViewARSigned";
import Notifications from "../components/notifications/Notifications";

const Dashboard = () => {
  const { activeView, currentUser, showNotifications } = useAuth();
  const [visibleNotif, setVisibleNotif] = useState(false);

  // Handle smooth appearance using useEffect
  useEffect(() => {
    let timeout;
    if (showNotifications) {
      setVisibleNotif(true); // Instantly show
    } else {
      // Delay hiding to allow transition
      timeout = setTimeout(() => setVisibleNotif(false), 300);
    }
    return () => clearTimeout(timeout);
  }, [showNotifications]);

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <DashboardRouter />
          </>
        );
      case "memos":
        return <AllMemos />;
      case "viewMemo":
        return <ViewMemo />;
      case "createMemo":
        return <MemoForm />;
      case "editMemo":
        return <EditMemo />;
      case "signMemo":
        return <HeadApprove />;
      case "approvedByHead":
        return <ApprovedByHead />;
      case "approvedByFacultyAR":
        return <ARApproved />;
      case "arDecision":
        return <ARDecision />;
      case "createMemoFaculty":
        return <CAAMemoForm />;
      case "EditMemoFaculty":
        return <CAAEditMemo />;
      case "allMemosFacultycaa":
        return <CAAAllMemos />;
      case "campuslevelmemos":
        return <CampusLevelMemos />;
      case "deanallmemos":
        return <DeanAllMemos />;
      case "deansign":
        return <DeanSign />;
      case "arcampusmemos":
        return <ARCampusMemos />;
      case "arcampussign":
        return <ARCampusSign />;
      case "campusboarddecision":
        return <CampusBoardDecision />;
      case "arcampusdecision":
        return <ARCampusDecision />;
      case "rectormemos":
        return <RectorMemos />;
      case "caaeditmemo":
        return <EditMemoFacultyCAA />;
      case "facultycaacreatedmemos":
        return <CAAAllMemos />;
      case "viewcampuslevelmemo":
        return <ViewCampusLevelMemo />;
      case "viewfacultylevelmemo":
        return <ViewFacultyLevelMemos />;
      case "viewarsigned":
        return <ViewARSigned />;
      default:
        return <div>Select a view</div>;
    }
  };

  const shouldShowNotifications =
    currentUser === "CAA_Department" ||
    currentUser === "Head_Department" ||
    currentUser === "CAA_Faculty" ||
    currentUser === "AR_Faculty";

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex-grow p-6">{renderContent()}</div>

      {/* Smoothly Appearing Notifications Panel */}
      {shouldShowNotifications && visibleNotif && (
        <div
          className={`fixed top-[100px] right-0 h-screen w-[400px] z-50 overflow-y-auto 
            transition-all duration-800 ease-in-out
            ${showNotifications ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
            bg-white bg-opacity-40 backdrop-blur-[2px] shadow-lg`}
        >
          <Notifications />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
