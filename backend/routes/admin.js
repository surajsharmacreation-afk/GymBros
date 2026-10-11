const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Plan = require('../models/Plan');
const authMiddleware = require('../middleware/auth');

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
};

// 1. Dashboard Metrics (Total Members, Active Subscriptions, Revenue)
router.get('/dashboard-stats', authMiddleware, verifyAdmin, async (req, res) => {
    try {
        const totalMembers = await User.countDocuments({ role: 'member' });
        const activeMembers = await User.countDocuments({ role: 'member', subscriptionStatus: 'active' });
        const plans = await Plan.find();

        res.json({
            totalMembers,
            activeMembers,
            expiredMembers: totalMembers - activeMembers,
            totalPlans: plans.length
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
});

// 2. Get All Members
router.get('/members', authMiddleware, verifyAdmin, async (req, res) => {
    try {
        const members = await User.find({ role: 'member' })
            .populate('membershipPlan')
            .select('-password');
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: "Error loading members" });
    }
});

router.put('/assign-plan', authMiddleware, verifyAdmin, async (req, res) => {
    try {
        const { memberId, planName } = req.body;
        const plan = await Plan.findOne({ name: planName });
        if (!plan) return res.status(404).json({ message: "Plan not found" });

        const startDate = new Date();
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + plan.durationMonths);

        const updatedUser = await User.findByIdAndUpdate(memberId, {
            membershipPlan: plan._id,
            subscriptionStatus: 'active',
            subscriptionStart: startDate,
            subscriptionExpiry: expiryDate,
            requestedPlan: null // Request processed, clear flag
        }, { new: true }).populate('membershipPlan');

        res.json({ message: "Plan assigned and request cleared!", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Failed to assign plan" });
    }
});

// 4. Delete Member
router.delete('/member/:id', authMiddleware, verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Member removed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete member" });
    }
});

module.exports = router;