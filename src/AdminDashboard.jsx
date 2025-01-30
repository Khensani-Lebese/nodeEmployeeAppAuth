// AdminDashboard.js
import React from 'react';
import { auth } from '../firebaseConfig'; // Firebase auth instance
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
 
  const handleLogout = () => {
    auth.signOut().then(() => {
        localStorage.removeItem('user'); // Clear session storage
        navigate('/login'); // Redirect to login page
    });
};
return (
  <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
  </div>
);
};

export default AdminDashboard;
