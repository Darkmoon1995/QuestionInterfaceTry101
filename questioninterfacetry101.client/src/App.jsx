import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Home from './Pages/Home.jsx';
import Subject from './Pages/Subject.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import QuestionInterface from './Pages/QuestionInterface.jsx';
import WorksheetsList from './Pages/WorksheetList.jsx';
import WorksheetDetails from './Pages/Worksheet.jsx';
import manageProfile from './Pages/manageProfile.jsx';

import NavBar from './Components/NavBar.jsx';
import './App.css';

export function getToken() {
    return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
}

export function isAuthenticated() {
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
    return (
        <BrowserRouter>
            <AppWithRouter />
        </BrowserRouter>
    );
}

function AppWithRouter() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = getToken();
        const currentPath = location.pathname;

        if (!token && currentPath !== '/login' && currentPath !== '/register') {
            console.log('No token found, redirecting to login');
            navigate('/register');
        }
    }, [location, navigate]);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/manageProfile" element={<manageProfile />} />

            {/* Protected Routes */}
            <Route
                path="*"
                element={
                    <ProtectedRoute>
                        <NavBar />
                        <Routes>
                            <Route path="/Grade" element={<Home />} />
                            <Route path="/Grade/Subject" element={<Subject />} />
                            <Route path="/Grade/Subject/WorksheetList/New" element={<QuestionInterface />} />
                            <Route path="/Grade/Subject/WorksheetList" element={<WorksheetsList />} />
                            <Route path="/Grade/Subject/WorksheetList/:worksheetId" element={<WorksheetDetails />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
