// App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import GlobalStyles from './GlobalStyles.jsx';
import Home from './Home.jsx';
import AddEmployee from './AddEmployee.jsx';
import ViewEmployees from './ViewEmployees.jsx';
import DeleteEmployee from './DeleteEmployee.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Navigation from './Navigation.jsx';
import styled from 'styled-components';
import AddAdmin from "./AddAdmin";
import ProtectedRoute from './ProtectedRoute';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard.jsx';
import { AuthProvider, useAuth } from '../AuthContext'; // Import AuthProvider and useAuth

const App = () => (
    <AuthProvider>
        <Router>
            <GlobalStyles />
            <Header />
            <Navigation />
            <Main />
            <Footer />
        </Router>
    </AuthProvider>
);

const Main = () => {
    const { resetLogoutTimer, isAuthenticated } = useAuth(); // Assuming isAuthenticated is provided by your AuthContext
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate('/admin/dashboard'); // Redirect to dashboard if already authenticated
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Add event listeners to reset the logout timer
        const handleUserActivity = () => {
            resetLogoutTimer();
        };

        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);
        window.addEventListener('scroll', handleUserActivity);

        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
            window.removeEventListener('scroll', handleUserActivity);
        };
    }, [resetLogoutTimer]);

    return (
        <MainContainer>
            <Routes>
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/add" element={<ProtectedRoute><AddAdmin /></ProtectedRoute>} />
                <Route path="/home" element={<Home />} />
                <Route path="add" element={<AddEmployee />} />
                <Route path="view" element={<ViewEmployees />} />
                <Route path="delete" element={<DeleteEmployee />} />
            </Routes>
        </MainContainer>
    ); 
};

const MainContainer = styled.main`
  padding: 20px;
  margin-bottom: 60px; /* Adjust margin-bottom to avoid footer overlap */
`;

export default App;
 