// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require("./config/googleAuth");
require("./config/passport");

const app = express();
const session = require("express-session");
const passport = require("passport");

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://subsphenoid-saul-hokily.ngrok-free.dev"
  ],
  credentials: true
}));

app.use(session({
  secret: "gymbrossecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
  secure: true,
  sameSite: "none"
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
const path = require("path");

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use("/api/support", supportRoutes);

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

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});