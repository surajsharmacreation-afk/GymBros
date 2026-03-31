import React, { useRef } from "react";
import "./Subscription.css";
import { motion } from "framer-motion";

const GlowCard = ({ children, center }) => {
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
      className={`price-card glow ${center ? "center" : ""}`}
      whileHover={{ scale: center ? 1.05 : 1.03 }}
    >
      {children}
    </motion.div>
  );
};

const Subscription = () => {
  return (
    <div className="pricing-page">

      <h1 className="bg-text">OUR PRICES</h1>

      <div className="pricing-wrapper">

        {/* LEFT */}
        <GlowCard>
          <h2>Basic</h2>
          <p>Lorem ipsum <span>dolor</span></p>

          <ul>
            <li>✔ Workout Plans</li>
            <li>✔ Basic Tracking</li>
            <li>✔ Limited Support</li>
          </ul>

          <h3>₹599 <span>/mo</span></h3>
          <button>START</button>
        </GlowCard>

        {/* CENTER BIG */}
        <GlowCard center>
          <h2>Premium</h2>
          <p>Lorem ipsum <span>dolor</span></p>

          <ul>
            <li>✔ Advanced Analytics</li>
            <li>✔ Smart Tracking</li>
            <li>✔ Priority Support</li>
          </ul>

          <h3>₹799 <span>/mo</span></h3>
          <button>START</button>
        </GlowCard>

        {/* RIGHT */}
        <GlowCard>
          <h2>Extended</h2>
          <p>Lorem ipsum <span>dolor</span></p>

          <ul>
            <li>✔ Personal Coach</li>
            <li>✔ Diet Plans</li>
            <li>✔ Full Access</li>
          </ul>

          <h3>₹999 <span>/mo</span></h3>
          <button>START</button>
        </GlowCard>

      </div>
    </div>
  );
};

export default Subscription;