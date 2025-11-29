// src/LoginPage/ForgotPasswordForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./ForgotPasswordForm.css";

const ForgotPasswordForm = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  console.log(username)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // POST request to get user's password back
      //const res = await fetch("https://collision-simulator-fjbmgebxazfcdpe4.westus3-01.azurewebsites.net/accounts/reset-request",{
      const res = await fetch("http://localhost:5000/accounts/reset-request", {
      method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

      const data = await res.json(); // parse response

      if (res.ok) {
        alert("A reset link has been emailed to you!");
        navigate("/"); // back to login
      } else {
        alert(data.message);
      }
    } catch (error) {
      //alert(data)
      alert("Error connecting to server.");
    }
  };

  return (
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
            Remember your password? {" "}
            <a onClick={() => navigate("/")}>Back to Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
