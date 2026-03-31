import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaUser, FaChartLine, FaCrown, FaDumbbell, FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Dashboard.css";
import CountUp from "react-countup";
import { AuthContext } from "./AuthContext"; // ✅ FIXED PATH

/* 🔥 AI */
const getSuggestion = (user) => {
  if (!user) return "Start your journey 💪";
  if ((user.totalWorkoutMinutes || 0) < 30)
    return "Light workout today — focus on consistency 🔥";
  if ((user.totalWorkoutMinutes || 0) < 90)
    return "You're doing great! Push harder 💪";
  return "Beast mode 😈 Take rest or go intense!";
};

/* 🔥 STATS */
const getStreak = (user) => {
  return Math.floor((user?.totalWorkoutMinutes || 0) / 20);
};

const getGoal = (user) => {
  return Math.min(user?.totalWorkoutMinutes || 0, 100);
};

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ FIXED

  return (
    <>
      {/* ✅ FIXED LOGOUT */}
      <Navbar user={user} onLogout={logout} />

      <div className="dashboard-wrapper">
        <div className="dashboard-container">

          {/* HEADER */}
          <motion.div
            className="dashboard-header"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="dashboard-title">
              Welcome Back, {user?.nickname || user?.name}
            </h1>
            <p className="dashboard-subtitle">
              Ready to crush your fitness goals today?
            </p>
          </motion.div>

          {/* GRID */}
          <div className="dashboard-grid">

            {/* WEEKLY */}
            <GlowCard className="full">
              <h3>Weekly Activity 📊</h3>

              <div className="weekly-summary">
                <div className="weekly-box">
                  <span>Total</span>
                  <strong>{user?.totalWorkoutMinutes || 0} min</strong>
                </div>

                <div className="weekly-box">
                  <span>Streak</span>
                  <strong>{getStreak(user)} days</strong>
                </div>

                <div className="weekly-box">
                  <span>Goal</span>
                  <strong>{getGoal(user)}%</strong>
                </div>

                <div className="weekly-box">
                  <span>Status</span>
                  <strong>
                    {(user?.totalWorkoutMinutes || 0) > 60
                      ? "🔥 Active"
                      : "⚡ Starting"}
                  </strong>
                </div>
              </div>
            </GlowCard>

            {/* CARDS */}
            <GlowCard onClick={() => navigate("/profile")}>
              <FaUser size={28} />
              <h3>Email</h3>
              <p>{user?.email}</p>
            </GlowCard>

            <GlowCard onClick={() => navigate("/ai-coach")}>
              <FaRobot size={26} />
              <h3>AI Coach</h3>
              <p className="ai-text">{getSuggestion(user)}</p>
            </GlowCard>

            <GlowCard className="tall" onClick={() => navigate("/exercises")}>
              <FaDumbbell size={28} />
              <h3>Workout</h3>
              <p>
                <CountUp end={user?.totalWorkoutMinutes || 0} duration={1.5} /> min
              </p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${getGoal(user)}%` }}
                />
              </div>
            </GlowCard>

            <GlowCard className="tall" onClick={() => navigate("/subscription")}>
              <FaCrown size={28} />
              <h3>Plan</h3>
              <p className="plan-text">{user?.subscriptionType}</p>
              <div className="plan-badge">
                {user?.subscriptionType === "premium" ? "🔥 Premium" : "Free"}
              </div>
            </GlowCard>

            {/* STATS */}
            <GlowCard className="stats-small">
              <FaChartLine size={28} />
              <h3>Performance Stats</h3>

              <div className="dashboard-stats-grid">
                <div className="dashboard-stat-box">
                  <span>Nickname</span>
                  <strong>{user?.nickname || "-"}</strong>
                </div>

                <div className="dashboard-stat-box">
                  <span>Age</span>
                  <strong>{user?.age || "-"}</strong>
                </div>

                <div className="dashboard-stat-box">
                  <span>Height</span>
                  <strong>{user?.height ? `${user.height} cm` : "-"}</strong>
                </div>

                <div className="dashboard-stat-box">
                  <span>Weight</span>
                  <strong>{user?.weight ? `${user.weight} kg` : "-"}</strong>
                </div>
              </div>
            </GlowCard>

            {/* CTA */}
            <GlowCard className="cta-card" onClick={() => navigate("/exercises")}>
              <h1 className="cta-title">WHAT ARE YOU WAITING FOR?</h1>
              <p className="cta-sub">Start your workout now 🚀</p>
            </GlowCard>

          </div>
        </div>
      </div>
    </>
  );
};

/* GLOW CARD */
const GlowCard = ({ children, onClick, className = "" }) => {
  const ref = useRef();

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.04 }}
      onClick={onClick}
      className={`dashboard-card glow-card ${className}`}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {children}
    </motion.div>
  );
};

export default Dashboard;