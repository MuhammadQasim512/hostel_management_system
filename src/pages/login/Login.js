import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundimage from "./../pic/about/backgroundimage.PNG";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(""); // Success or Error message
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(null);

    const handleLogin = async () => {
        setLoading(true);
        setMessage("");

        let isAdminLoggedIn = null;

        localStorage.setItem("isAdminLoggedIn", isAdminLoggedIn);
        try {
            const headers = { 'Content-Type': 'application/json' };
            const response = await axios.post("http://127.0.0.1:5000/api/user_login", {
                email,
                password
            }, { headers });

            if (response.status === 200) {
                const { token, user_data } = response.data; // ✅ Response se data extract
                localStorage.setItem("token", token);
                localStorage.removeItem("user_data")
                localStorage.setItem("user_data", JSON.stringify(user_data));

                const isAdminLoggedIn = (email === "admin@admin.com");
                localStorage.setItem("isAdminLoggedIn", JSON.stringify(isAdminLoggedIn));

                setMessage("Login Successful!");

                if (isAdminLoggedIn) {
                    navigate("/dashboard");
                } else {
                    navigate("/manage-room");
                }
            } else {
                setMessage("Unexpected response, please try again.");
            }

        } catch (err) {
            console.error("Login Error:", err);
            if (err.response && err.response.status === 401) {
                setMessage("Invalid credentials, please try again."); //  Unauthorized case
            } else {
                setMessage("Something went wrong. Please try again."); //  Other errors
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundimage})` }}>
            <div className="login-content">
                <h3>Sign in</h3>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="forget-container">
                    <Link to="/reset-form" className="forget">Forgot password?</Link>
                </div>
                {/* Message (Success/Error) */}
                {message && <p style={{ color: message.includes("Successful") ? "green" : "red" }}>{message}</p>}

                {/* Spinner Show when Loading */}
                {loading && <div className="spinner"></div>}
                <button
                    style={{ backgroundColor: '#299d92' }}
                    className="login-btn"
                    onClick={handleLogin}
                    disabled={loading} // Disable button when loading
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="signup-link"> Don't have an account? <Link to="/register"> Sign up </Link></p>
            </div>
        </div>
    );
}

