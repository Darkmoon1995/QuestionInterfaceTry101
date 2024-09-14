import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../Css/LoginRegister.css';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "confirmPassword") setConfirmPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        } else if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError("");
        try {
            const response = await axios.post("https://localhost:7226/api/Auth/register", { email, password });
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
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        placeholder=" "
                    />
                    <label>Confirm Password</label>
                </div>
                <button type="submit">Register</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default Register;
