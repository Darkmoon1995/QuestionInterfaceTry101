import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../Css/LoginRegister.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberme, setRememberme] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "email") {
            setEmail(value);
            document.getElementById("email").classList.toggle("used", value !== "");
        }
        if (name === "password") {
            setPassword(value);
            document.getElementById("password").classList.toggle("used", value !== "");
        }
        if (name === "rememberme") {
            setRememberme(type === "checkbox" ? checked : value);
        }
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7226/api/auth/login", {
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
                const data = await response.json();
                localStorage.setItem("token", data.token);
                setError("");
                navigate('/Grade');
            } else {
                setError("Invalid login credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Error logging in. Please try again later.");
        }
    };

    useEffect(() => {
        if (email !== "") document.getElementById("email").classList.add("used");
        if (password !== "") document.getElementById("password").classList.add("used");
    }, [email, password]);

    return (
        <div className="containerbox">
            <h3>Login</h3>
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
                <div className="remember-me-container">
                    <input
                        type="checkbox"
                        id="rememberme"
                        name="rememberme"
                        checked={rememberme}
                        onChange={handleChange}
                    />
                    <label htmlFor="rememberme" className="remember-me-label">Remember me</label>
                </div>
                <div>
                    <button type="submit" className="button buttonBlue">Login</button>
                </div>
                <div>
                    <button type="button" onClick={handleRegisterClick} className="button buttonRegister">Register</button>
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Login;
