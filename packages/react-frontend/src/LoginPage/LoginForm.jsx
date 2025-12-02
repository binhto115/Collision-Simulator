// src/LoginPage/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./LoginForm.css";

const LoginForm = () => {
  // Check user log-in
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // If token in localStorage, assume "Remember me" on
  const [rememberMe, setRememberMe] = useState(
    !!localStorage.getItem("token")
  );

  // Helper to get token form either localStorage or sessionStorage
  const getStoredToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token") || "";

  const [, setToken] = useState(getStoredToken());

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://crashlab-backend-cga7hqa8f6cbbage.westus3-01.azurewebsites.net/accounts/login",
        // http://localhost:5000/accounts/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // When you submit the form, you use those stored values in your fetch request:
          body: JSON.stringify({ username, pwd: password }),
          // That’s where the inputs are actually sent to the backend.
        }
      );
      
      // Wait for backend comfirmation
      const data = await response.json();

      // If login is good (either by admin or user)
      if (response.ok) {
        // Store token in React state
        setToken(data.token);

        if (rememberMe) {
          // if Checked, save across browser restarts:
          localStorage.setItem("token", data.token);
          sessionStorage.setItem("token", data.token);
        } else {
          // Otherwise, clear when browser/tab closes
          sessionStorage.setItem("token", data.token);
          localStorage.removeItem("token");
        }
        alert(data.message);
        navigate("/simHub");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occured while logging in.");
    }
  };

  return (
    
    <div className="login-page">

      <form onSubmit={handleSubmit}>
        <h2>CrashLab 2D</h2>

        <div className="input-box">
          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // take whatever the user typed (e.target.value) and update the username state variable
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <div className='remember-forgot'>
          <label>
            <input 
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
          </label>
          <a onClick={() => navigate("/forgotpass")}>Forgot password?</a>
        </div>

        <button type="submit">Login</button>

        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <a onClick={() => navigate("/signup")}>Sign Up</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
