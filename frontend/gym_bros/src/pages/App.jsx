import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useContext } from "react";

import Dashboard from "./Dashboard";
import OnboardingForm from "./OnboardingForm";
import ExerciseList from "./Exerciselist";
import Home from "./Home";
import Subscription from "./Subscription";
import Support from "./Support";
import About from "./About";
import Profile from "./Profile";
import AICoach from "./AICoach";
import Login from "./Login";

import { AuthProvider, AuthContext } from "./AuthContext";

/* 🔥 Animated Routes */
function AnimatedRoutes() {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* ONBOARDING */}
        <Route
          path="/onboarding"
          element={
            user
              ? user.isProfileComplete
                ? <Navigate to="/dashboard" />
                : <OnboardingForm />
              : <Navigate to="/login" />
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            user
              ? user.isProfileComplete
                ? <Dashboard />
                : <Navigate to="/onboarding" />
              : <Navigate to="/login" />
          }
        />

        {/* EXERCISES */}
        <Route
          path="/exercises"
          element={user ? <ExerciseList /> : <Navigate to="/login" />}
        />

        <Route path="/subscription" element={<Subscription />} />
        <Route path="/support" element={<Support />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/ai-coach" element={<AICoach />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </AnimatePresence>
  );
}

/* 🔥 MAIN APP */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

/* 🔥 LOADING STYLE */
const styles = {
  loading: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white"
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255,255,255,0.3)",
    borderTop: "5px solid white",
    borderRadius: "50%",
    marginBottom: "20px",
    animation: "spin 1s linear infinite"
  }
};

export default App;