// Dashboard.jsx
import React from "react";
import Sidebar from "./Sidebar";
import DashboardRouter from "./DashboardRouter";
import MemoForm from "../components/memo_forms/MemoForm"; // Import your MemoForm component
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

const Dashboard = () => {
  const { activeView } = useAuth();

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
        return (
          <>
            <AllMemos />
          </>
        );
      case "viewMemo":
        return (
          <>
            <ViewMemo />
          </>
        );
      case "createMemo":
        return (
          <>
            <MemoForm />
          </>
        );
      case "editMemo":
        return (
          <>
            <EditMemo />
          </>
        );
      case "signMemo":
        return (
          <>
            <HeadApprove />
          </>
        );
      case "approvedByHead":
        return (
          <>
            <ApprovedByHead />
          </>
        );
      case "approvedByFacultyAR":
        return (
          <>
            <ARApproved />
          </>
        );
      case "arDecision":
        return (
          <>
            <ARDecision />
          </>
        );
      case "createMemoFaculty":
        return (
          <>
            <CAAMemoForm />
          </>
        );
      case "EditMemoFaculty":
        return (
          <>
            <CAAEditMemo />
          </>
        );
      case "allMemosFacultycaa":
        return (
          <>
            <CAAAllMemos />
          </>
        );
      case "campuslevelmemos":
        return (
          <>
            <CampusLevelMemos />
          </>
        );
      case "deanallmemos":
        return (
          <>
            <DeanAllMemos />
          </>
        );
      case "deansign":
        return (
          <>
            <DeanSign />
          </>
        );
      case "arcampusmemos":
        return (
          <>
            <ARCampusMemos />
          </>
        );
      case "arcampussign":
        return (
          <>
            <ARCampusSign />
          </>
        );
      case "campusboarddecision":
        return (
          <>
            <CampusBoardDecision />
          </>
        );
      case "arcampusdecision":
        return (
          <>
            <ARCampusDecision />
          </>
        );
      case "rectormemos":
        return (
          <>
            <RectorMemos />
          </>
        );
      case "caaeditmemo":
        return (
          <>
            <EditMemoFacultyCAA />
          </>
        );
        case "facultycaacreatedmemos":
        return (
          <>
            <CAAAllMemos />
          </>
        );
      case "viewcampuslevelmemo":
        return (
          <>
            <ViewCampusLevelMemo />
          </>
        );
        case "viewfacultylevelmemo":
          return (
            <>
              <ViewFacultyLevelMemos />
            </>
          );
          case "viewarsigned":
          return (
            <>
              <ViewARSigned />
            </>
          );
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
