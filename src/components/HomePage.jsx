import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Student Counseling App</h1>
      <p className="home-subtitle">
        Your journey starts here. Log in or register to continue.
      </p>
      <div className="home-button-container">
        <button
          className="home-button login-button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="home-button register-button"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default HomePage;
