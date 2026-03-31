import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import "./Exerciselist.css";
import { AuthContext } from "./AuthContext"; // ✅ FIXED PATH

const ExerciseList = () => {
  const { user, logout } = useContext(AuthContext); // ✅ GLOBAL AUTH

  const [exercises, setExercises] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* 🔥 FETCH */
  const fetchExercises = useCallback(async () => {
    try {

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/exercises?week=${selectedWeek}`,
        { withCredentials: true }
      );

      setExercises(res.data);
    } catch (err) {
      console.error(err);

      // ❌ TOKEN INVALID → AUTO LOGOUT
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }

    } finally {
      setLoading(false);
    }
  }, [selectedWeek, logout, navigate]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  /* 🔥 GROUP */
  const grouped = {};
  exercises.forEach((ex) => {
    if (!grouped[ex.day]) grouped[ex.day] = [];
    grouped[ex.day].push(ex);
  });

  return (
    <>
      {/* ✅ GLOBAL LOGOUT */}
      <Navbar
        user={user}
        onLogout={() => {
          logout();
          navigate("/login");
        }}
      />

      <div className="exercise-page">

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="title"
        >
          🏋️ Workout Plan
        </motion.h1>

        {/* WEEK SELECT */}
        <div className="week-selector">
          {[1, 2].map((w) => (
            <button
              key={w}
              className={selectedWeek === w ? "active" : ""}
              onClick={() => {
                setSelectedWeek(w);
                setLoading(true); // smooth reload
              }}
            >
              Week {w}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          Object.keys(grouped).map((day) => (
            <div key={day} className="day-block">

              <h2 className="day-title">Day {day}</h2>

              <div className="grid">
                {grouped[day].map((ex, i) => (
                  <motion.div
                    key={ex._id}
                    className="card"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >

                    {ex.isPremium && (
                      <div className="badge">⭐ Premium</div>
                    )}

                    <div className="card-top">
                      <span className="icon">💪</span>
                      <span className="difficulty">{ex.difficulty}</span>
                    </div>

                    <h3>{ex.name}</h3>

                    <p>{ex.description.slice(0, 70)}...</p>

                    <div className="stats">
                      <span>⏱ {ex.durationMinutes}m</span>
                      <span>🔥 {ex.caloriesBurned}</span>
                      <span>💪 {ex.sets}x{ex.reps}</span>
                    </div>

                  </motion.div>
                ))}
              </div>

            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ExerciseList;