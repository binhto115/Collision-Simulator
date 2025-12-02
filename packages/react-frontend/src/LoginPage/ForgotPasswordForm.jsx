import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./ForgotPasswordForm.css";

const ForgotPasswordForm = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://crashlab-backend-cga7hqa8f6cbbage.westus3-01.azurewebsites.net/accounts/login", {
      // const res = await fetch("http://localhost:5000/accounts/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("A reset link has been emailed to you!");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="forgot-password-wrapper">
      {/* Full-page animated background */}
      <div className="background-color">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Centered card */}
      <div className="forgot-password-page">
        <form onSubmit={handleSubmit}>
          <h2>CrashLab 2D</h2>
          <h3>Forgot Password</h3>

          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>

          <button type="submit">Send Reset Link</button>

          <div className="register-link">
            <p>
              Remember your password?{" "}
              <a onClick={() => navigate("/")}>Back to Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
