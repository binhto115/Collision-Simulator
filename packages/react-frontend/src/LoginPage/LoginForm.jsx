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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username === "admin" && password === "1234") {
            navigate("/dashboard");
        } else {
            alert("Invalid credentials");
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
                    <a href="#">Forgot password?</a>
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
