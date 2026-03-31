import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./AICoach.css";

const AICoach = () => {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hey! I’m your AI fitness coach 💪" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    // 🔥 fake AI response (later replace with real API)
    const aiMsg = {
      role: "ai",
      text: "Based on your goal, try a 30 min strength workout 🔥"
    };

    setMessages([...messages, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <>
      <Navbar />

      <div className="ai-wrapper">
        <div className="chat-box">

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-msg ${msg.role}`}
            >
              {msg.text}
            </div>
          ))}

        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </>
  );
};

export default AICoach;