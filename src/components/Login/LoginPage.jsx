import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import './LoginPage.css';
import passwordIcon from "./password.png";
import userIcon from "./person.png";

const LoginPage = () => {
  const navigate = useNavigate(); // Create a navigate object

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('https://fptbottournamentweb.azurewebsites.net/api/Login/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful login, e.g., store user data in state or context
        console.log("Login successful", data);
        
        // Redirect to the home page after successful login
        navigate('/home');
      } else {
        // Handle failed login, e.g., display error message
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <div className="input-box">
        <div className="input-items">
          <img src={userIcon} alt="" />
          <input
            type="text"
            placeholder="Username"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-items">
          <img src={passwordIcon} alt="" />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="submit-container">
        <div className="submit" onClick={handleLogin}>
          Login
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
