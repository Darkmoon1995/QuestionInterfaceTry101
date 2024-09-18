import React, { useEffect, useState } from 'react';
import { ChevronRight, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [userName, setUserName] = useState('NoUsername');
    const [profilePicture, setProfilePicture] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username') || sessionStorage.getItem('username');
        const storedProfilePicture = localStorage.getItem('profilePicture') || sessionStorage.getItem('profilePicture');

        if (storedUsername) setUserName(storedUsername);
        if (storedProfilePicture) setProfilePicture(storedProfilePicture);

        // Close the dropdown if clicked outside
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const currentPath = location.pathname.split('/').filter(Boolean);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    const toggleDropdown = (e) => {
        e.stopPropagation(); // Prevent the click from triggering document listener
        setShowDropdown((prevState) => !prevState);
    };

    const formatBreadcrumbName = (name) => {
        return name.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                <div className="relative flex items-center mb-4 sm:mb-0 dropdown">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 cursor-pointer" onClick={toggleDropdown}>
                        {profilePicture ? (
                            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <span className="text-lg font-semibold cursor-pointer" onClick={toggleDropdown}>
                        {userName}
                    </span>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute top-12 left-0 bg-gray-800 text-white rounded-lg shadow-lg w-48 py-2 z-50">
                            <Link to="/" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setShowDropdown(false)}>
                                Home
                            </Link>
                            <Link
                                to="/ProfileManager"
                                className="block px-4 py-2 hover:bg-gray-700"
                                onClick={() => setShowDropdown(false)}
                            >
                                Profile Manager
                            </Link>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-700">
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2 text-sm">
                    <Link to="/" className="hover:text-gray-300 transition-colors">
                        Home
                    </Link>
                    {currentPath.map((item, index) => {
                        const pathToSegment = `/${currentPath.slice(0, index + 1).join('/')}`;
                        return (
                            <React.Fragment key={index}>
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                                <Link to={pathToSegment} className="hover:text-gray-300 transition-colors">
                                    {formatBreadcrumbName(item)}
                                </Link>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
