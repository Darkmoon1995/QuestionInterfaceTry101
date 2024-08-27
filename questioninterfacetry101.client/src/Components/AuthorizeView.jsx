import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from './axiosConfig.js';

const UserContext = createContext({});

function AuthorizeView(props) {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ email: "" });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get('/Auth/pingauth');
                setUser({ email: response.data.email });
                setAuthorized(true);
            } catch (error) {
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

export function AuthorizedUser(props) {
    const user = React.useContext(UserContext);
    if (props.value === "email") return <>{user.email}</>;
    else return <></>;
}

export default AuthorizeView;
