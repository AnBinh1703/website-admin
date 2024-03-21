import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import passwordIcon from "./password.png";
import userIcon from "./person.png";
import Alert from "@mui/material/Alert";

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  
  useEffect(() => {
    if (alertMessage) {
      const timeout = setTimeout(() => {
        setAlertMessage("");
        setAlertSeverity("error");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [alertMessage]);
  

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://fptbottournamentmanagement-2e9b0b503b66.herokuapp.com/api/Login/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: formData.userName,
            password: formData.password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful", data);
        // Lưu token vào localStorage
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true); // Cập nhật trạng thái isLoggedIn thành true
        navigate("/");
      } else {
        console.error("Login failed:", response.statusText);
        setAlertMessage("Login failed. Please check your credentials.");
        setAlertSeverity("error");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setAlertMessage("An error occurred. Please try again later.");
      setAlertSeverity("error");
    }
  };

  return (
    <div className="container">
      {error && <Alert severity="error">{error}</Alert>}
          {alertMessage && (
            <Alert severity={alertSeverity}>{alertMessage}</Alert>
          )}
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
