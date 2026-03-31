const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const sendEmail = require("../utils/sendEmail");
const passport = require("passport");


// REGISTER

router.post('/register', async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    await sendEmail(
      "🆕 New User Registered",
      `New signup detected:

Name: ${name}
Email: ${email}`
    );

    res.status(201).json({
      message: 'User registered successfully'
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });

  }

});


// LOGIN

router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user.password) {

      return res.status(400).json({
        message:
          "Please login using Google account"
      });

    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendEmail(
      "🔐 User Login Alert",
      `User logged in:

Name: ${user.name}
Email: ${user.email}`
    );

    res.json({
      message: "Login successful",
      user
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error'
    });

  }

});


// CURRENT USER

router.get("/me", authMiddleware, async (req, res) => {

  try {

    if (!req.userId) {
      return res.status(401).json(null);
    }

    const user = await User.findById(req.userId)
      .select("-password");

    res.json(user);

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }

});

// LOGOUT

router.post('/logout', (req, res) => {

  res.clearCookie("token");

  res.json({
    message: "Logged out successfully"
  });

});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);


router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login"
  }),

  async (req, res) => {

    sendEmail(
      "🟢 Google Login",
      `User logged in via Google:

Name: ${req.user.name}
Email: ${req.user.email}`
    );

    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    if (req.user.isProfileComplete) {

      return res.redirect(
        "http://localhost:3000/dashboard"
      );

    }

    return res.redirect(
      "http://localhost:3000/onboarding"
    );

  }
);

module.exports = router;