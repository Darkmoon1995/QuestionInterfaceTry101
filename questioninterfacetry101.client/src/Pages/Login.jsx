import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../Css/LoginRegister.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "rememberMe") setRememberMe(checked);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
        setError("Please fill in all fields.");
        return;
    }
    setError("");

    try {
        const response = await axios.post("https://localhost:7226/api/Auth/login", { email, password });
        if (response.data.token) {
            const token = response.data.token;
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000;
            
            console.log("Token expiration time:", new Date(expirationTime));
            
            if (rememberMe) {
                localStorage.setItem("jwtToken", token);
            } else {
                sessionStorage.setItem("jwtToken", token);

            }
            
            navigate("/Grade");
        } else {
            setError("Login failed.");
        }
    } catch (error) {
        setError("Error Logging In.");
    }
};


    return (
        <div className="containerbox">
            <h3>Login</h3>
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
                <div>
                    <input
                        type="checkbox"
                        name="rememberMe"
                        checked={rememberMe}
                        onChange={handleChange}
                    />
                    <label>Remember Me</label>
                </div>
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default Login;
