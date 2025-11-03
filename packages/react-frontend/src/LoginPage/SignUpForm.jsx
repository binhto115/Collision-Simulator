// src/LoginPage/SignUpForm.jsx
import React, { useState }  from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser,  FaLock} from "react-icons/fa";
import './LoginForm.css';

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // TODO, for now it just shows a message
    alert(`Account created for ${username}!`);
    navigate("/");
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2>CrashLab 2D</h2>
        <h3>Create an account</h3>

        <div className="input-box">
          <input type="text" placeholder="Set a Username" 
          value={username} onChange={(e) => setUsername(e.target.value)}required/>
          <FaUser className='icon'/>
        </div>

        <div className='input-box'>
          <input type="password" placeholder="Password" 
          value={password} onChange={(e) => setPassword(e.target.value)}required/>
          <FaLock className='icon'/>
        </div>

        <div className='input-box'>
          <input type="password" placeholder="Confirm Password"
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}required/>
          <FaLock className='icon'/>
        </div>

        <button type="submit">Sign Up</button>

        <div className="register-link">
          <p> Already have an account?{" "}
            <a onClick={() => navigate("/")}>Back to Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
