import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../Css/LoginRegister.css';

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState(""); // If needed for some logic
    const [profilePicture, setProfilePicture] = useState(""); // Base64 string or file URL
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "username") setUsername(value);
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "currentPassword") setCurrentPassword(value);
        if (name === "profilePicture") {
            setProfilePicture(URL.createObjectURL(files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setError("");
        try {
            const response = await axios.post("https://localhost:7226/api/Auth/register", {
                username,
                email,
                currentPassword,
                password,
                profilePicture
            });
            if (response.status === 200) {
                navigate("/login");
            } else {
                setError("Error registering.");
            }
        } catch (error) {
            setError("Error registering.");
        }
    };

    return (
        <div className="containerbox">
            <h3>Register</h3>
            <form onSubmit={handleSubmit} className="form">
                <div className="group">
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        placeholder=" "
                    />
                    <label>Username</label>
                </div>
                <div className="group">
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder=" "
                    />
                    <label>Email</label>
                </div>
                <div className="group">
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder=" "
                    />
                    <label>Password</label>
                </div>
                <div className="group">
                    <input
                        type="password"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={handleChange}
                        placeholder=" "
                    />
                    <label>Current Password (optional)</label>
                </div>
                <div className="group">
                    <input
                        type="file"
                        name="profilePicture"
                        onChange={handleChange}
                    />
                    <label>Profile Picture (optional)</label>
                </div>
                <button type="submit">Register</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default Register;
