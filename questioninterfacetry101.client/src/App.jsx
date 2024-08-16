import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Home from './Pages/Home.jsx';
import Subject from './Pages/Subject.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import UpdatePermissions from './Pages/UpdatePermissions.jsx';
import QuestionInterface from './Pages/QuestionInterface.jsx';
import WorksheetsList from './Pages/WorksheetList.jsx';
import NavBar from './Components/NavBar.jsx';
import './App.css';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/update-permissions" element={<UpdatePermissions />} />

                {/* Protected Routes */}
                <Route
                    path="*"
                    element={
                        <>
                            <NavBar />
                            <Routes>
                                <Route path="/Grade" element={<Home />} />
                                <Route path="/Grade/Subject" element={<Subject />} />
                                <Route path="/Grade/Subject/ID/worksheet" element={<QuestionInterface />} />
                                <Route path="/Grade/Subject/WorksheetList" element={<WorksheetsList />} />

                            </Routes>
                        </>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
