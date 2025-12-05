// src/LoginPage/ResetPasswordPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPasswordPage.css";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    // Extract token from URL
    const token = new URLSearchParams(window.location.search).get("token");

    console.log("RESET TOKEN:", token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // If passwords don't match, then alert and return
        if (password !== confirm) {
            alert("Passwords do not match!");
            return;
        }

        // Fetch from backend, or waiting for backend to respond to confirm password
        try {
            const res = await fetch("https://crashlab-backend-cga7hqa8f6cbbage.westus3-01.azurewebsites.net/accounts/reset-password", {
            // const res = await fetch("http://localhost:5000/accounts/reset-password",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword: password }),
            }
        );

        const data = await res.json();

        if (res.ok) {
            alert("Password reset successfully!");
            navigate("/");
        } else {
            alert(data.message);
        }
        } catch {
            alert("Server error");
        }
    };

    return (
        // Returning the page constantly
        <div className="reset-password-page">
            <form onSubmit={handleSubmit}>
                <h2>Reset Password</h2>

                <input type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />

                <input type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                />

                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};


export default ResetPasswordPage;
