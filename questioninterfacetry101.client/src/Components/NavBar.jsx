import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutLink from "../Components/LogoutLink.jsx";
import "../Css/NavBar.css";
import { isAuthenticated } from '../App.jsx'; 

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const handleBackClick = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (!isAuthenticated()) {
            console.log("Not Auth");
            navigate("/login");
        }
    }, [navigate]);

    return (
        <header className="navbar-header">
            <nav className="navbar">
                <div className="container">
                    {isAuthenticated() ? (
                        <button className="navbar-brand">
                            <LogoutLink>Logout</LogoutLink>
                        </button>
                    ) : null}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <a className="nav-link" href="#">Current: {currentPath}</a>
                                {/* Back link */}
                                {currentPath !== '/' && (
                                    <a className="nav-link" href="#" onClick={handleBackClick}>Back</a>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
