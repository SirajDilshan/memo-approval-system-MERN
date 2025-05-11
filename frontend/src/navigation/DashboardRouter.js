import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import CAADepartmentDashboard from "../dashboards/CAA_departmentDashboard";
import HeadDepartmentDashboard from "../dashboards/HeadDepartmentDashboard";
import ARFacultyDashboard from "../dashboards/ARFacultyDashboard";
import CAAFacultyDashboard from "../dashboards/CAAFacultydashboard";
import DeanFacultyDashboard from "../dashboards/DeanFacultyDashboard";
import ARCampusDashboard from "../dashboards/ARCampusDashboard";
import RectorDashboard from "../dashboards/RectorDashboard";

const DashboardRouter = () => {
  const { currentUser, setCurrentUser ,setNotificationCount,setNotifications } = useAuth();

  useEffect(() => {
    const role = currentUser;
    if (role) {
      setCurrentUser(role);
    }
  }, [setCurrentUser,currentUser]);

   useEffect(() => {
    let intervalId;

    const fetchNotifications = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/notifications/role/${currentUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(res.data);
  console.log(res.data);
        setNotificationCount(res.data.length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (currentUser) {
      fetchNotifications(); // initial fetch
      intervalId = setInterval(fetchNotifications, 4000); // fetch every 4 sec
    }

    return () => clearInterval(intervalId); // clean up
  }, [currentUser, setNotificationCount]);

  if (!currentUser) return <p>Loading user...</p>;

  switch (currentUser) {
    case "CAA_Department":
      return <CAADepartmentDashboard />;
    case "Head_Department":
      return <HeadDepartmentDashboard />;
    case "AR_Faculty":
      return <ARFacultyDashboard />;
    case "CAA_Faculty":
      return <CAAFacultyDashboard />;
    case "Dean_Faculty":
      return <DeanFacultyDashboard />;
    case "AR_Campus":
      return <ARCampusDashboard />;
    case "Rector":
      return <RectorDashboard />;
    default:
      return <p>Unknown role: {currentUser}</p>;
  }
};

export default DashboardRouter;
