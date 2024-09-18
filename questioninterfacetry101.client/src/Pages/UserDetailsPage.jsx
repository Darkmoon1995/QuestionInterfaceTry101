import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Upload } from 'lucide-react';

const getToken = () => {
    return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
};

export default function UserDetailsPage() {
    const [userName, setUserName] = useState('NoUsername');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [password, setPassword] = useState(''); // Optional: For password update
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Load user details from localStorage or sessionStorage
        const storedUsername = localStorage.getItem('username') || sessionStorage.getItem('username');
        const storedEmail = localStorage.getItem('email') || sessionStorage.getItem('email');
        const storedProfilePicture = localStorage.getItem('profilePicture') || sessionStorage.getItem('profilePicture');

        if (storedUsername) setUserName(storedUsername);
        if (storedEmail) setEmail(storedEmail);
        if (storedProfilePicture) setProfilePicture(storedProfilePicture);
    }, []);

    // Handle profile picture change (convert file to base64)
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result); // Store the base64 encoded image
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = getToken();
        console.log('Token:', token);  // Debugging line

        if (!token) {
            setError('Authorization token is missing. Please log in again.');
            return;
        }

        // Check if required fields are filled
        if (!email || !userName) {
            setError('Email and Username are required.');
            return;
        }

        // Prepare the data object, omitting the password if it's not provided
        const requestData = {
            email,
            displayName: userName,
            profilePictureBase64: profilePicture || undefined // Send base64 string or undefined
        };

        // Add password to requestData only if it is provided
        if (password) {
            requestData.password = password;
        }

        try {
            const response = await axios.put(
                'https://localhost:7226/api/Auth/update-profile',
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                // Update localStorage
                localStorage.setItem('username', userName);
                localStorage.setItem('email', email);
                if (profilePicture) localStorage.setItem('profilePicture', profilePicture);

                setSuccess('Profile updated successfully!');
            } else {
                setError('Failed to update profile. Please try again.');
            }
        } catch (err) {
            console.error('Error response:', err);
            if (err.response) {
                console.error('Status:', err.response.status);
                console.error('Data:', err.response.data);

                // Log the exact validation errors if available
                if (err.response.data.errors) {
                    const validationErrors = err.response.data.errors;
                    for (const field in validationErrors) {
                        console.error(`${field}: ${validationErrors[field].join(', ')}`);
                    }
                }

                // Display detailed error message
                setError(
                    `Error: ${err.response.status}. ${err.response.data.title || 'An error occurred.'}`
                );
            } else {
                setError('An error occurred while updating the profile.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center">User Details</h1>

                {/* Display Success or Error messages */}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mb-4">
                            {profilePicture ? (
                                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-gray-400" />
                            )}
                        </div>
                        <label htmlFor="profile-picture" className="cursor-pointer">
                            <div className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 transition-colors px-4 py-2 rounded-md">
                                <Upload className="w-5 h-5" />
                                <span>Upload Picture</span>
                            </div>
                            <input
                                id="profile-picture"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleProfilePictureChange}
                            />
                        </label>
                    </div>

                    {/* Username Field */}
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                id="username"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Optional Password Field */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium">Password (Optional)</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
