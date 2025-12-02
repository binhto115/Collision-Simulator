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
  const [rememberMe, setRememberMe] = useState(false);


  const [, setToken] = useState(localStorage.getItem("token") || ""); // don't need first value, still want setter

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://crashlab-backend-cga7hqa8f6cbbage.westus3-01.azurewebsites.net/accounts/login",
      // const response = await fetch("http://localhost:5000/accounts/login",
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
        // Set token to state
        setToken(data.token);

        // If Remember Me Checkbox is checked
        if (rememberMe) {
          localStorage.setItem("token", data.token); // save token to localStorage
        } else {
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
          <p>Don't have an account? <a onClick={() => navigate("/signup")}>Sign Up</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
