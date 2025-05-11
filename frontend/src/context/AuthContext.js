import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => sessionStorage.getItem('role'));
  
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [memos, setMemos] = useState([]);
  const [viewId, setViewId] = useState();
  const [caaNotifications, setCaaNotifications ] = useState([]);
  const [headNotifications, setHeadNotifications ] = useState([]);
  const [signatureDataURL, setSignatureDataURL] = useState();
const [showNotifications, setShowNotifications] = useState(false);
const [notificationCount, setNotificationCount] = useState();
  const [notifications, setNotifications] = useState([]);

  const isAuthenticated = () => currentUser !== null;

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('token');
    setActiveView('dashboard');
    navigate('/login');
  };

 
 
  const deleteNotificationByMemoId = async (Id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/notifications/delete/${Id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // You can also update your local state here if needed
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
       currentUser, isAuthenticated,
         logout, setCurrentUser,
        activeView, setActiveView,
        memos, setMemos,
        viewId, setViewId,
        caaNotifications, setCaaNotifications,
        headNotifications, setHeadNotifications,
        signatureDataURL, setSignatureDataURL,
        notificationCount, setNotificationCount,
        deleteNotificationByMemoId,
        showNotifications, setShowNotifications,
        notifications, setNotifications
       }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}