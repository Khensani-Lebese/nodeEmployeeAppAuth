// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Firebase auth instance
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
