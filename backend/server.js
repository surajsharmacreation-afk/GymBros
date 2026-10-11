// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// ✅ FIX: only load ONE Google strategy file.
// config/passport.js was registering a SECOND, conflicting "google" strategy
// (with a hardcoded localhost callback URL) and overwriting this one.
// 👉 Delete (or rename) backend/config/passport.js — it is no longer used.
require("./config/googleAuth");

const app = express();
const session = require("express-session");
const passport = require("passport");
const path = require("path");

// ✅ FIX: required so secure cookies / req.protocol work correctly behind
// ngrok / Render / Nginx or any reverse proxy.
app.set("trust proxy", 1);

const isProd = process.env.NODE_ENV === "production";

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://subsphenoid-saul-hokily.ngrok-free.dev",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || "gymbrossecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    // ✅ FIX: secure+sameSite:none cookies are silently dropped by browsers
    // on plain http://localhost. Use real https-only settings in prod,
    // relaxed settings in dev.
    secure: isProd,
    sameSite: isProd ? "none" : "lax"
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const exerciseRoutes = require('./routes/exercises');
const supportRoutes = require("./routes/support");
const adminRoutes = require('./routes/admin');

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use("/api/support", supportRoutes);
app.use('/api/admin', adminRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

/* React build serve */
app.use(express.static(
  path.join(__dirname, "../frontend/gym_bros/build")
));

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/gym_bros/build/index.html")
  );
});

console.log('✅ Routes loaded:');
console.log('   - /api/auth');
console.log('   - /api/profile');
console.log('   - /api/exercises');
console.log('   - /api/support');

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});