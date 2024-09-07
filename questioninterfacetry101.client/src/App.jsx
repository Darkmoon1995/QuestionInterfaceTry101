
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Subject from './Pages/Subject.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import NavBar from './Components/NavBar.jsx';
import './App.css';

function getToken() {
    return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
}

function isAuthenticated() {
    const token = getToken();
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        return expirationTime > Date.now();
    } catch (error) {
        console.error('Error parsing token:', error);
        return false;
    }
}

function ProtectedRoute({ children }) {
    const auth = isAuthenticated();
    return auth ? children : <Navigate to="/login" />;
}

function App() {
    useEffect(() => {
        const token = getToken();
        if (!token) {
            console.log('No token found, redirecting to login');
        }
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><NavBar /></ProtectedRoute>}>
                    <Route path="/Grade" element={<Home />} />
                    <Route path="/Grade/Subject" element={<Subject />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
