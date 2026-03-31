// backend/routes/exercises.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Exercise = require('../models/Exercise');
const User = require('../models/User');

// ========================================
// GET ALL EXERCISES (with week filter)
// ========================================
router.get("/", authMiddleware, async (req, res) => {
  try {

    const { week } = req.query;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    let filter = {};

    if (week) {
      filter.week = parseInt(week);
    }

    if (user.subscriptionType === "free") {
      filter.isPremium = false;
    }

    const exercises = await Exercise.find(filter)
      .sort({ week: 1, day: 1 });

    res.json(exercises);

  } catch (err) {

    console.error("Exercise fetch error:", err);

    res.status(500).json({
      message: "Server error"
    });

  }
});

// ========================================
// GET EXERCISES BY WEEK AND DAY
// ========================================
router.get('/day/:week/:day', authMiddleware, async (req, res) => {
  try {
    const { week, day } = req.params;
    const user = await User.findById(req.userId);
    
    let filter = { 
      week: parseInt(week), 
      day: parseInt(day) 
    };
    
    if (user.subscriptionType === 'free') {
      filter.isPremium = false;
    }
    
    const exercises = await Exercise.find(filter);
    res.json(exercises);
    
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========================================
// GET SINGLE EXERCISE BY ID
// ========================================
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    res.json(exercise);
    
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;