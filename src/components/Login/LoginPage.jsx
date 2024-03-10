// LoginPage.js
import React, { useState } from "react";
import "./LoginPage.css";
import passwordIcon from "./password.png";
import userIcon from "./person.png";

const LoginPage = () => {
  const [action, setAction] = useState("Sign Up");

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
