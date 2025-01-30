// Home.js
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Firebase auth instance
import { useAuth } from '../AuthContext'; // Custom auth context

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Retrieve user info from context

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem('user'); // Clear session storage
      navigate('/login'); // Redirect to login page
    });
  };

  return (
    <Container>
      <h2>Welcome to the Employee Management Portal</h2>
      <p>Use the navigation links above to manage employees.</p>
      <img
        src="https://th.bing.com/th?q=Smart+Employee+App&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.5&pid=InlineBlock&mkt=en-ZA&cc=ZA&setlang=en&adlt=strict&t=1&mw=247"
        alt="employee picture"
      />
      {user && (
        <UserSection>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </UserSection>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  text-align: center;
  width: 100%;
  margin: 0 auto;
  background-color: white;
`;

const UserSection = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
`;

export default Home;
