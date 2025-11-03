// src/LoginPage/SignUpForm.jsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import './LoginForm.css';

const SignUpForm = () => {

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/");
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2>CrashLab 2D</h2>
        
        <div className="register-link">
          <p> Already have an account?{" "}
            <a onClick={() => navigate("/")}> 
              Back to Login
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}

// function SignUpForm() {
//   return (
//     <div style={{ textAlign: 'center', marginTop: '100px' }}>
//       <h2>Sign Up Page</h2>
//       <p>We’ll add the actual form later.</p>
//     </div>

//     // <div className='register-link'>
//     // <p>Don't have an account? <a onClick={() => navigate("/signup")}>Sign Up</a></p>
//     // </div>
//   );
// }

export default SignUpForm;
