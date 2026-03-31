const mongoose = require('mongoose');

const workoutLog = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    },
    durationMinutes: {
        type: Number,
        required: true       
    },

    caloriesBurned: {
        type: Number,
        default: 0           
    },

    week: {
        type: Number         
    },

    day: {
        type: Number         
    },

    notes: {
        type: String     
    }

}, { timestamps: true });

module.exports = mongoose.model('WorkoutLog', workoutLog);
