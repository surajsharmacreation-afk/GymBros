const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, default: null },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    
    // Member Specific Details
    nickname: { type: String, default: '' },
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    profilePic: { type: String, default: "" },
    isProfileComplete: { type: Boolean, default: false },

    // Gym Membership Details
    membershipPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    subscriptionStatus: { type: String, enum: ['active', 'expired', 'inactive'], default: 'inactive' },
    subscriptionStart: { type: Date },
    subscriptionExpiry: { type: Date },
    requestedPlan: { type: String, default: null },

    googleId: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);