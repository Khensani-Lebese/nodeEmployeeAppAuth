// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebaseConfig'; // Ensure this is your Firebase configuration
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [logoutTimer, setLogoutTimer] = useState(null); // Store the logout timer

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                localStorage.setItem('user', JSON.stringify(user));
                startLogoutTimer(); // Start the timer when the user logs in
            } else {
                setUser(null);
                localStorage.removeItem('user');
                clearLogoutTimer(); // Clear the timer if the user logs out
            }
        });

        return () => unsubscribe();
    }, []);

    const startLogoutTimer = () => {
        clearLogoutTimer(); // Clear any existing timer
        const timer = setTimeout(() => {
            handleLogout();
        }, 5 * 60 * 1000); // 5 minutes
        setLogoutTimer(timer); // Save the new timer
    };

    const clearLogoutTimer = () => {
        if (logoutTimer) {
            clearTimeout(logoutTimer); // Clear the timer
            setLogoutTimer(null); // Reset the timer state
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
        localStorage.removeItem('user'); // Clear user data from local storage
    };

    // Reset the logout timer when there is user activity
    const resetLogoutTimer = () => {
        startLogoutTimer();
    };

    return (
        <AuthContext.Provider value={{ user, resetLogoutTimer }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
