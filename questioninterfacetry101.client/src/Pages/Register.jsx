import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../Css/LoginRegister.css';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
            document.getElementById("email").classList.toggle("used", value !== "");
        }
        if (name === "password") {
            setPassword(value);
            document.getElementById("password").classList.toggle("used", value !== "");
        }
        if (name === "confirmPassword") {
            setConfirmPassword(value);
            document.getElementById("confirmPassword").classList.toggle("used", value !== "");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7226/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                setError("");
                navigate("/login");
            } else {
                setError("Error registering. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError("Error registering. Please try again later.");
        }
    };

    useEffect(() => {
        if (email !== "") document.getElementById("email").classList.add("used");
        if (password !== "") document.getElementById("password").classList.add("used");
        if (confirmPassword !== "") document.getElementById("confirmPassword").classList.add("used");
    }, [email, password, confirmPassword]);

    return (
        <div className="containerbox">
            <h3>Register</h3>
            <form onSubmit={handleSubmit} className="form">
                <div className="group">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder=" "
                        className={email ? "used" : ""}
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label>Email</label>
                </div>
                <div className="group">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder=" "
                        className={password ? "used" : ""}
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label>Password</label>
                </div>
                <div className="group">
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        placeholder=" "
                        className={confirmPassword ? "used" : ""}
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label>Confirm Password</label>
                </div>
                <div>
                    <button type="submit" className="button buttonBlue">Register</button>
                </div>
                <div>
                    <button type="button" onClick={handleLoginClick} className="button buttonRegister">Go to Login</button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Register;
