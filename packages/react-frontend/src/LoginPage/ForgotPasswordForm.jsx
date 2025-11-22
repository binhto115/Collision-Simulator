// src/LoginPage/ForgotPasswordForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./ForgotPasswordForm.css";

const ForgotPasswordForm = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = { username: username, newPassword: newPassword };

    try {
      // PUT request to get user's password back
      const res = await fetch(
        "https://collision-simulator-backend-fqbna6bcfubxfnfv.westus3-01.azurewebsites.net/accounts",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      await res.json(); // parse response

      if (res.status === 201) {
        alert("Password Reset successfully!");
        navigate("/"); // back to login
      } else if (res.status === 409) {
        alert("User not found!");
      } else {
        alert(`Failed to reset password. Please try again. Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="forgot-password-page">
        <form onSubmit={handleSubmit}>
        <h2>CrashLab 2D</h2>
        <h3>Forgot Password?</h3>

        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>

        <button type="submit">Reset Password</button>

        <div className="register-link">
          <p>
            
            Remember your password? {" "}<a onClick={() => navigate("/")}>Back to Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
