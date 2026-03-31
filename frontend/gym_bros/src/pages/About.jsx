import React from "react";
import "./About.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const reviews = [
  { name: "Rahul", text: "Best fitness app I've ever used 🔥" },
  { name: "Aman", text: "My consistency improved a lot 💪" },
  { name: "Priya", text: "Clean UI and powerful tracking ❤️" },
  { name: "Rohit", text: "Feels like a premium app 😈" },
];

const About = () => {

  const navigate = useNavigate();

  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Build Discipline. Build Yourself.
        </motion.h1>

        <p>
          Gym Bros helps you track, grow and stay consistent in your fitness journey.
        </p>
      </section>

      {/* WHY US */}
      <section className="about-section">
        <motion.div
          className="about-box"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2>Why Gym Bros?</h2>
          <p>
            We focus on real results — not motivation hype.
            Track workouts, stay consistent and build discipline daily.
          </p>
        </motion.div>
      </section>

      {/* REVIEWS */}
      <section className="reviews">

        <h2>What People Say</h2>

        <div className="review-container">

          {/* COLUMN 1 */}
          <div className="review-column scroll-down">
            {[...reviews, ...reviews].map((r, i) => (
              <div key={i} className="review-card">
                <p>"{r.text}"</p>
                <span>- {r.name}</span>
              </div>
            ))}
          </div>

          {/* COLUMN 2 */}
          <div className="review-column scroll-up">
            {[...reviews, ...reviews].map((r, i) => (
              <div key={i} className="review-card">
                <p>"{r.text}"</p>
                <span>- {r.name}</span>
              </div>
            ))}
          </div>

          {/* COLUMN 3 */}
          <div className="review-column scroll-down slow">
            {[...reviews, ...reviews].map((r, i) => (
              <div key={i} className="review-card">
                <p>"{r.text}"</p>
                <span>- {r.name}</span>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Start Your Journey Today</h2>

        <button
          onClick={() => navigate("/subscription")}
        >
          Join Now
        </button>
      </section>

    </div>
  );
};

export default About;