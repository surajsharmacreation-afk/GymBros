const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        default: null
    },


    nickname: {
        type: String,
        default: ''
    },
    age: {
        type: Number,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number,

    },
    profilePic: {
        type: String,
        default: ""
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    subscriptionType: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free',
    },
    subscriptionExpiry: {
        type: Date,
    },


    dailyGoalMinutes: {
        type: Number,
        default: 30
    },

    totalWorkoutMinutes: {
        type: Number,
        default: 0
    },

    currentWeek: {
        type: Number,
        default: 1
    },

    currentDay: {
        type: Number,
        default: 1
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);