import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";
import { useRef } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const Home = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="home">

      <Navbar />

      {/* HERO */}
      <motion.div
        className="video-section"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <video src="/home13.mp4" autoPlay loop muted playsInline></video>

        <div className="overlay">
          <h1>NO EXCUSES</h1>
          <p>Build Discipline. Build Strength.</p>

          <button onClick={() => navigate("/login")}>
            Start Now
          </button>
        </div>
      </motion.div>

      {/* VIDEO SECTIONS */}
      <motion.div
        className="video-section"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <video autoPlay loop muted playsInline>
          <source src="/home12.mp4" type="video/mp4" />
        </video>
        <h2>GET MOVING</h2>
      </motion.div>

      <div className="stats-section">

        <h2 className="stats-title">Our Impact</h2>

        {/* ROW 1 */}
        <div className="stats-wrapper">
          <div className="stats-track left">
            <GlowCard>
              <div>
                <h2>
                  <CountUp end={500} duration={2} />+
                </h2>
                <p>Users</p>
              </div>
            </GlowCard>
            <GlowCard><div>
                <h2>
                  <CountUp end={1200} duration={2} />+
                </h2>
                <p>Workouts</p>
              </div></GlowCard>
            <GlowCard><div>
                <h2>
                  <CountUp end={300} duration={2} />+
                </h2>
                <p>Transformations</p>
              </div></GlowCard>
            <GlowCard><div>
                <h2>
                  <CountUp end={50000} duration={2} />+
                </h2>
                <p>Calories</p>
              </div></GlowCard>
            <GlowCard><div>
                <h2>
                  <CountUp end={10000} duration={2} />+
                </h2>
                <p>Active Users</p>
              </div></GlowCard>

            <GlowCard>500+ Users</GlowCard>
            <GlowCard>1200+ Workouts</GlowCard>
            <GlowCard>300+ Transformations</GlowCard>
            <GlowCard>50K Calories</GlowCard>
            <GlowCard>10K Active Users</GlowCard>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="stats-wrapper">
          <div className="stats-track right">
            <GlowCard>AI Workout Plans</GlowCard>
            <GlowCard>Daily Tracking</GlowCard>
            <GlowCard>Smart Analytics</GlowCard>
            <GlowCard>Diet Plans</GlowCard>
            <GlowCard>Consistency Boost</GlowCard>

            <GlowCard>AI Workout Plans</GlowCard>
            <GlowCard>Daily Tracking</GlowCard>
            <GlowCard>Smart Analytics</GlowCard>
            <GlowCard>Diet Plans</GlowCard>
            <GlowCard>Consistency Boost</GlowCard>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="stats-wrapper">
          <div className="stats-track left slow">
            <GlowCard>Beginner Friendly</GlowCard>
            <GlowCard>Advanced Training</GlowCard>
            <GlowCard>Community Support</GlowCard>
            <GlowCard>Goal Tracking</GlowCard>
            <GlowCard>24/7 Access</GlowCard>

            <GlowCard>Beginner Friendly</GlowCard>
            <GlowCard>Advanced Training</GlowCard>
            <GlowCard>Community Support</GlowCard>
            <GlowCard>Goal Tracking</GlowCard>
            <GlowCard>24/7 Access</GlowCard>
          </div>
        </div>

      </div>

      <motion.div
        className="image-section"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img src="/home4.jpeg" alt="workout" />
        <h2>DO THE WORK</h2>
      </motion.div>


      <motion.div
        className="video-section"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <video src="/home14.mp4" autoPlay loop muted playsInline></video>
        <h2>DISCIPLINE</h2>
      </motion.div>

      {/* VIDEO SECTION */}
      <motion.div
        className="image-section"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img src="/home14.jpg" alt="workout" />
        <h2>ME VS ME</h2>
      </motion.div>


      {/* FINAL CTA */}
      <div className="final-cta">
        <h2>YOUR TRANSFORMATION STARTS NOW</h2>

        <button onClick={() => navigate("/login")}>
          Join Gym Bros
        </button>
      </div>

    </div >
  );
};
const GlowCard = ({ children }) => {
  const ref = useRef();

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ref.current.style.setProperty("--x", `${x}px`);
    ref.current.style.setProperty("--y", `${y}px`);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="stat-card glow-card"
      whileHover={{ scale: 1.06, rotate: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
  .glow-card::before {
    content: "";
    position: absolute;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(155,92,255,0.4), transparent 60%);
    top: var(--y);
    left: var(--x);
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: 0.1s;
  }
  `;
  document.head.appendChild(style);
}

export default Home;