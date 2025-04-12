// Dashboard.jsx
import React, {  useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardRouter from '../components/router/DashboardRouter';
import MemoForm from '../components/MemoForm'; // Import your MemoForm component
import AllMemos from '../components/AllMemos';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard'); // default view


  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <DashboardRouter />
          </>
        );
      case 'memos':
        return (
          <>
            <AllMemos />
          </>
        );
      case 'createMemo':
        return (
          <>
            <h1 className="text-2xl font-bold mb-4">Create Memo</h1>
            <MemoForm />
          </>
        );
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="flex">
      <Sidebar setActiveView={setActiveView} />
      <div className="flex-grow p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
