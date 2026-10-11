const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g. "Monthly Starter", "Yearly Pro"
    durationMonths: { type: Number, required: true },
    price: { type: Number, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);