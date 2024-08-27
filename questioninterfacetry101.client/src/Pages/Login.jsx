import { useState } from "react";
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
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "rememberme") setRememberme(checked);
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

        setError("");

        try {
            const response = await fetch("https://localhost:7226/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login response data:", data); // Log the token received

                if (data.token) {
                    // Store the token based on "Remember Me"
                    if (rememberme) {
                        localStorage.setItem('jwtToken', data.token);
                        console.log('Token saved in localStorage');
                    } else {
                        sessionStorage.setItem('jwtToken', data.token);
                        console.log('Token saved in sessionStorage');
                    }

                    setError("Successful Login.");
                    navigate("/Grade"); // Redirect after login
                } else {
                    setError("Login failed. No token received.");
                }
            } else {
                const errorData = await response.json().catch(() => ({ message: "Error Logging In." }));
                setError(errorData?.message || "Error Logging In.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError("Error Logging in.");
        }
    };

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
                    <button type="submit" className="button buttonBlue">Login
                        <div className="ripples buttonRipples"><span className="ripplesCircle"></span></div>
                    </button>
                </div>
                <p className="message" style={{ color: error === "Successful Login." ? "green" : "red" }}>{error}</p>
            </form>
            <div>
                <button onClick={handleRegisterClick} className="button buttonBlue">Register
                    <div className="ripples buttonRipples"><span className="ripplesCircle"></span></div>
                </button>
            </div>
        </div>
    );
}

export default Login;
