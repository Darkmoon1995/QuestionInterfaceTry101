import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Home from './Pages/Home.jsx';
import Subject from './Pages/Subject.jsx';
import Login from './Pages/Login.jsx';
import QuestionInterface from './Pages/QuestionInterface.jsx';
import WorksheetsList from './Pages/WorksheetList.jsx';
import WorksheetDetails from './Pages/Worksheet.jsx';
import AdminWorksheets from './Pages/AdminWorksheets.jsx';

import NavBar from './Components/NavBar.jsx';

// Get the token from either sessionStorage or localStorage
export function getToken() {
    return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
}

// Check if the user is authenticated
export function isAuthenticated() {
    const token = getToken();
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        return expirationTime > Date.now(); // Token is still valid
    } catch (error) {
        console.error('Error parsing token:', error);
        return false;
    }
}

// Check if the user has the "Admin" role
export function hasAdminRole() {
    const roles = JSON.parse(sessionStorage.getItem('roles') || localStorage.getItem('roles')) || [];
    return roles.includes('Admin');
}

// Protected route for authenticated users
function ProtectedRoute({ children }) {
    const auth = isAuthenticated();
    return auth ? children : <Navigate to="/login" />;
}

// Protected route for admins only
function AdminProtectedRoute({ children }) {
    const auth = isAuthenticated();
    const isAdmin = hasAdminRole();
    return auth && isAdmin ? children : <Navigate to="/login" />;
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
            navigate('/login');
        }
    }, [location, navigate]);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
                path="*"
                element={
                    <ProtectedRoute>
                        <NavBar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/Subject" element={<Subject />} />
                            <Route path="/Subject/WorksheetList/New" element={<QuestionInterface />} />
                            <Route path="/Subject/WorksheetList" element={<WorksheetsList />} />
                            <Route path="/Subject/WorksheetList/:worksheetId" element={<WorksheetDetails />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* Admin Protected Routes */}
            <Route
                path="/AdminWorksheets"
                element={
                    <AdminProtectedRoute>
                        <AdminWorksheets />
                    </AdminProtectedRoute>
                }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
