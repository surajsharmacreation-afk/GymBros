const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");

// POST /api/profile/request-plan
router.post("/request-plan", authMiddleware, async (req, res) => {
  try {
    const { planName } = req.body;

    // Database me requestedPlan save karo
    const user = await User.findByIdAndUpdate(
      req.userId,
      { requestedPlan: planName },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Pehle frontend ko turant response bhej do (no lag!)
    res.json({
      message: "Plan request saved successfully",
      requestedPlan: user.requestedPlan,
    });

    // Background me bina delay ke email fire karo
    setImmediate(() => {
      sendEmail(
        "⚡ GymBros: New Membership Plan Request",
        `Member "${user.name}" (${user.email}) ne "${planName}" request kiya hai.\nPayment desk counter par collect karein aur Admin Panel se 1-click me approve karein.`,
      );
    });
  } catch (err) {
    console.error("Request plan error:", err);
    res.status(500).json({ message: "Failed to request plan" });
  }
});

// PUT /api/profile/update - Update Vitals for BMI & Complete Profile
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { age, height, weight } = req.body;
    // isProfileComplete ko true set kar rahe hain
    const user = await User.findByIdAndUpdate(
      req.userId,
      { age, height, weight, isProfileComplete: true },
      { new: true },
    ).populate("membershipPlan");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile vitals updated successfully", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile vitals" });
  }
});

module.exports = router;