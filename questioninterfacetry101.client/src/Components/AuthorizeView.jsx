import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';

const UserContext = createContext({});

function AuthorizeView(props) {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ email: "" });

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 10;
        const delay = 1000;
        const token = localStorage.getItem('token');

        const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

        const fetchWithRetry = async (url, options) => {
            try {
                const response = await fetch(url, options);
                if (response.ok) {
                    const json = await response.json();
                    setUser({ email: json.email });
                    setAuthorized(true);
                    return response;
                } else if (response.status === 401) {
                    console.error('Unauthorized access - Token might be invalid');
                    return response;
                } else {
                    console.error(`Request failed with status ${response.status}`);
                    throw new Error(`Error: ${response.status}`);
                }
            } catch (error) {
                retryCount++;
                console.error(`Fetch attempt ${retryCount}: ${error.message}`);
                if (retryCount > maxRetries) {
                    throw error;
                } else {
                    await wait(delay);
                    return fetchWithRetry(url, options);
                }
            }
        };

        if (token) {
            fetchWithRetry("https://localhost:7226/api/auth/pingauth", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            })
                .catch((error) => {
                    console.log(`Final error after retries: ${error.message}`);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            console.warn("No token found, user not authorized");
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    } else {
        if (authorized) {
            return (
                <UserContext.Provider value={user}>
                    {props.children}
                </UserContext.Provider>
            );
        } else {
            return <Navigate to="/login" />;
        }
    }
}

export function AuthorizedUser(props) {
    const user = React.useContext(UserContext);
    return props.value === "email" ? <>{user.email}</> : null;
}

export default AuthorizeView;
