// src/LoginPage/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser,  FaLock} from "react-icons/fa";
import './LoginForm.css'


const LoginForm = () => {
    // Check user log-in
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/accounts/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            // If login is good (either by admin or user)
            if (response.ok) {
                alert(data.message);
                navigate("/dashboard");
            }
            else {
                alert(data.message || "Login failed");
            }
        }
        catch (error) {
            console.error("Error:", error);
            alert("An error occured while logging in.");
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <h2>CrashLab 2D</h2>

                <div className="input-box">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <FaUser className='icon'/>
                </div>

                <div className='input-box'>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <FaLock className='icon'/>
                </div>

                <div className='remember-forgot'>
                    <label><input type="checkbox" />Remember me</label>
                    <a href="https://neal.fun/password-game/">Forgot password? </a>
                </div>
                <button type="submit">Login</button>

                <div className='register-link'>
                    <p>Don't have an account?{" "}
                        <a onClick={() => navigate("/signup")}>Sign Up</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm; 
