const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String
        
    },
    durationMinutes:{
        type: Number,
        required: true
    },
    sets:{
        type: Number,
        default: 3
    },
    reps:{
        type: Number,
        default: 10
    },
    week:{
        type: Number,
        required: true
    },
    day:{
        type: Number,
        required: true
    },
    videoUrl:{
        type: String,
        
    },
    image:{
        type: String,
    },
    category:{
        type: String,
        enum:['strength', 'cardio', 'flexibility', 'yoga', 'warmup'],
        default: 'strength'
    },
    isPremium:{
        type: Boolean,
        default: false
    },
    difficulty:{
        type: String,
        enum:['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    caloriesBurned:{
        type: String,
        default: 0
    }
},{timestamps: true});

module.exports = mongoose.model('Exercise', exerciseSchema)