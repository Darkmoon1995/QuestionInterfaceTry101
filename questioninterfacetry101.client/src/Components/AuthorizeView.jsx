import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from './axiosConfig.js';

const UserContext = createContext({});

// Define the getToken function to retrieve the JWT token from storage
function getToken() {
    return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
}

function AuthorizeView(props) {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ email: "" });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = getToken();
                console.log("Retrieved token:", token);

                // Attach the token to the axios instance
                if (token) {
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }

                const response = await axiosInstance.get('/Auth/pingauth');
                console.log("PingAuth response:", response.data);

                setUser({ email: response.data.email });
                setAuthorized(true);
            } catch (error) {
                console.error("PingAuth error:", error);
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    } else if (authorized) {
        return (
            <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
        );
    } else {
        return <Navigate to="/login" />;
    }
}

// AuthorizedUser component to access the user's email or other data from the UserContext
export function AuthorizedUser(props) {
    const user = React.useContext(UserContext);
    if (props.value === "email") return <>{user.email}</>;
    else return <></>;
}

export default AuthorizeView;
