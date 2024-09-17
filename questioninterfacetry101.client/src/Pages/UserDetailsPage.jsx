import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Upload } from 'lucide-react';

export default function UserDetailsPage() {
    const [userName, setUserName] = useState('NoUsername');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    // Load user details from localStorage or sessionStorage
    useEffect(() => {
        const storedUsername = localStorage.getItem('username') || sessionStorage.getItem('username');
        const storedEmail = localStorage.getItem('email') || sessionStorage.getItem('email');
        const storedProfilePicture = localStorage.getItem('profilePicture') || sessionStorage.getItem('profilePicture');

        if (storedUsername) {
            setUserName(storedUsername);
        }

        if (storedEmail) {
            setEmail(storedEmail);
        }

        if (storedProfilePicture) {
            setProfilePicture(storedProfilePicture);
        }
    }, []);

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate updating the user details in the backend
        console.log('Form submitted:', { userName, email, password, profilePicture });

        // Save the updated information to localStorage or sessionStorage
        localStorage.setItem('username', userName);
        localStorage.setItem('email', email);
        if (profilePicture) {
            localStorage.setItem('profilePicture', profilePicture);
        }
        if (password) {
            // For demonstration purposes only. Password would typically be hashed and stored securely.
            localStorage.setItem('password', password);
        }

        alert('Profile updated successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center">User Details</h1>
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
