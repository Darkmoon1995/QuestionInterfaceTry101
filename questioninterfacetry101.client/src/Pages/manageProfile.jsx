import React, { useState } from 'react';
import { User, Mail, Lock, Upload } from 'lucide-react';

const getToken = () => {
    return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
};

const ManageProfile = () => {
    const [username, setUsername] = useState('John Doe');
    const [email, setEmail] = useState('johndoe@example.com');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleProfilePictureChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        if (password) {
            formData.append('currentPassword', currentPassword);
            formData.append('newPassword', password);
        }
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const response = await fetch('/api/UserProfile/UpdateProfile', {
                method: 'PUT',
                body: formData,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (response.ok) {
                setSuccessMessage('Profile updated successfully');
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Manage Profile</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mb-4">
                            {profilePicture ? (
                                <img
                                    src={URL.createObjectURL(profilePicture)}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
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
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="currentPassword" className="block text-sm font-medium">Current Password</label>
                        <input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="password" className="block text-sm font-medium">New Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Save Changes
                    </button>
                    {successMessage && <p className="text-green-400 text-center">{successMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default ManageProfile;
