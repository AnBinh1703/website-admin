import React, { useState } from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";
import "./HeroSection.css";
import * as FaIcons from "react-icons/fa";

function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hàm để xử lý đăng nhập thành công và cập nhật trạng thái isLoggedIn
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="hero-container">
      <video src="/videos/video-1.mp4" autoPlay loop muted />
      <h1>Autonomous Cars</h1>
      <p>How about the self-driving crop harvesting race?</p>
      <div className="hero-btns">
        {!isLoggedIn && (
          <Button
            className="btns"
            buttonStyle="btn--outline"
            buttonSize="btn--large"
          >
            GET STARTED
          </Button>
        )}
        <Button
          className="btns"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
          onClick={console.log("hey")}
        >
          WATCH TRAILER <i className="far fa-play-circle" />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
