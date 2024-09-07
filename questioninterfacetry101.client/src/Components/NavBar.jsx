import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.jsx";
import LogoutLink from "../Components/LogoutLink.jsx";
import "../Css/NavBar.css";

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    // Function to handle back navigation
    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <header className="navbar-header">
            <nav className="navbar">
                <div className="container">
                    <AuthorizeView>
                        <button className="navbar-brand">
                            <LogoutLink>Logout <AuthorizedUser value="email" /></LogoutLink>
                        </button>
                    </AuthorizeView>
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
