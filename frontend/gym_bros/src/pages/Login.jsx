import React, { useState, useContext } from "react";
import axios from "axios";
import "./Auth.css";
import { AuthContext } from "./AuthContext";


const Login = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { login, setUser } = useContext(AuthContext);

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      if (isLogin) {

        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/login"`,
          {
            email: formData.email,
            password: formData.password
          }
        );

        setUser(res.data.user);

        await login();

      } else {

        await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/register"`,
          formData
        );

        setSuccess("Registered successfully ✅ Please login");

        setIsLogin(true);

      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Something went wrong ❌"
      );

    }

  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="ai-character">🤖</div>

        <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>

        <p className="login-sub">
          {isLogin
            ? "Login to continue 💪"
            : "Start your fitness journey 🔥"}
        </p>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <input
              className="login-input"
              placeholder="Name"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
            />
          )}

          <input
            className="login-input"
            placeholder="Email"
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value
              })
            }
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value
              })
            }
          />

          <button className="login-btn">
            {isLogin ? "Login" : "Register"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {success && (
            <p style={{ color: "lightgreen" }}>
              {success}
            </p>
          )}

        </form>

        <button
          className="google-btn"
          onClick={() =>
            window.location.href =
            `${process.env.REACT_APP_API_URL}/api/auth/google"`
          }
        >
          Continue with Google
        </button>
        <p className="signup-text">

          {isLogin
            ? "No account?"
            : "Already have an account?"}

          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{
              color: "#7c7cff",
              cursor: "pointer",
              marginLeft: "5px"
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>

        </p>

      </div>

    </div>
  );
};

export default Login;