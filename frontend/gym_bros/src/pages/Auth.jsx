import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function AuthPage({ setUser }) {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login"`,
        {
          email: formData.email,
          password: formData.password
        }
      );

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      if (res.data.user.isProfileComplete) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };


  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register"`,
        formData
      );

      alert("Registration successful! Please login.");
      setIsLogin(true);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };


  return (
  <div className="login-page">
    <div className="login-card">

        
      {/* LEFT PANEL */}
      <div className="login-left">

        <img className="img-inner" src="/IMG_1836.jpeg" alt="fitness" />
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
            <img className="logo" src="gymbroo.png" alt="Gym Bros Logo" />
        {isLogin ? (
          <form className="auth-form" onSubmit={handleLogin}>

            {error && <p className="error">{error}</p>}

            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <button className="login-btn" type="submit">
              Login
            </button>

            <p className="sidechar">
               Don't have an account?{" "}
              <span onClick={() => setIsLogin(false)}>Register</span>
            </p>
          </form>

        ) : (
          <form className="auth-form" onSubmit={handleRegister}>

            {error && <p className="error">{error}</p>}

            <input
              className="login-input"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <button className="login-btn" type="submit">
              Sign Up
            </button>

            <p className="sidechar">
              Already have an account?{" "}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </p>
          </form>
        )}

      </div>
    </div>
  </div>
);
}

export default AuthPage;