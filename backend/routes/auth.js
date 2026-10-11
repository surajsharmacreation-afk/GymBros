const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");

const OFFICIAL_ADMIN_EMAIL = "surajsharma53942@gmail.com";

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, adminSecret } = req.body;

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(400).json({ message: "User already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const ADMIN_SECRET = process.env.ADMIN_SECRET || "GymMaster@2026";

    // Auto-detect Admin: agar email surajsharma53942@gmail.com ho ya passcode match ho
    let assignedRole = "member";
    if (
      email.toLowerCase().trim() === OFFICIAL_ADMIN_EMAIL.toLowerCase() ||
      (adminSecret && adminSecret.trim() === ADMIN_SECRET)
    ) {
      assignedRole = "admin";
    }

    user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
      role: assignedRole
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "secretgymkey",
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    sendEmail(
      "🚀 New Member Registered",
      `Naya member join hua:\n\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nPhone: ${user.phone || 'N/A'}`
    );

    res.status(201).json({ message: "Registration successful", user });
  } catch (err) {
    res.status(500).json({ message: "Register error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.password) {
      return res.status(400).json({ message: "Please log in using Google OAuth" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Agar login surajsharma53942 se hua aur role admin nahi tha, to auto-promote
    if (user.email.toLowerCase() === OFFICIAL_ADMIN_EMAIL.toLowerCase() && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "secretgymkey",
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    res.json({ message: "Logged in successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// Current User Session Check
router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Not authenticated" });
    const user = await User.findById(req.userId).populate("membershipPlan").select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;