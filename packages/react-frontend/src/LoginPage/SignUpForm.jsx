// src/LoginPage/SignUpForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./LoginForm.css";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const newUser = { username: username, pwd: password };

    try {
      // POST request for username & password
      //const res = await fetch("https://crashlab-backend-cga7hqa8f6cbbage.westus3-01.azurewebsites.net/accounts",
      const res = await fetch("http://localhost:5000/accounts",
      {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

      await res.json(); // parse response

      if (res.status === 201) {
        alert("Account created successfully!");
        navigate("/"); // back to login
      } else if (res.status === 409) {
        alert("Username already exists!");
      } else {
        alert(`Failed to create account. Please try again. Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2>CrashLab 2D</h2>
        <h3>Create Account</h3>

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

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <button type="submit">Sign Up</button>

        <div className="register-link">
          <p>
            {" "}
            Already have an account? <a onClick={() => navigate("/")}>Back to Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
