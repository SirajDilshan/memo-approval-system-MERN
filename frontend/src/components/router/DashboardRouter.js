import React from 'react';
import { useAuth } from '../../context/AuthContext';

import CAADepartmentDashboard from '../dashboards/CAA_departmentDashboard';
import HeadDepartmentDashboard from '../dashboards/HeadDepartmentDashboard';
import ARFacultyDashboard from '../dashboards/ARFacultyDashboard';
import CAAFacultyDashboard from '../dashboards/CAAFacultydashboard';
import DeanFacultyDashboard from '../dashboards/DeanFacultyDashboard';
import ARCampusDashboard from '../dashboards/ARCampusDashboard';
import RectorDashboard from '../dashboards/RectorDashboard';

const DashboardRouter = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return <p>Loading user...</p>;

  switch (currentUser.role) {
    case 'CAA_Department':
      return <CAADepartmentDashboard />;
    case 'Head_Department':
      return <HeadDepartmentDashboard />;
    case 'AR_Faculty':
      return <ARFacultyDashboard />;
    case 'CAA_Faculty':
      return <CAAFacultyDashboard />;
    case 'Dean_Faculty':
      return <DeanFacultyDashboard />;
    case 'AR_Campus':
      return <ARCampusDashboard />;
    case 'Rector':
      return <RectorDashboard />;
    default:
      return <p>Unknown role: {currentUser.role}</p>;
  }
};

export default DashboardRouter;