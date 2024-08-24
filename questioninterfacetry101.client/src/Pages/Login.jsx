import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Css/LoginRegister.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
            document.getElementById("email").classList.toggle("used", value !== "");
        } else if (name === "password") {
            setPassword(value);
            document.getElementById("password").classList.toggle("used", value !== "");
        }
    };
    const handleRegisterClick = () => {
        navigate("/register");
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
        .then((response) => {
            if (response.ok) {
                navigate("/Grade");
            } else {
                setError("Invalid login credentials.");
            }
        })
        .catch((error) => {
            console.error(error);
            setError("An error occurred during login.");
        });
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
                <div>
                    <button type="submit" className="button buttonBlue">Login</button>
                </div>
            </form>
            <div>
                <button type="button" onClick={handleRegisterClick} className="button buttonRegister">Register</button>
            </div>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default Login;
