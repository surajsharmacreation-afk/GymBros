const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");


/*
PROFILE COMPLETE (ONBOARDING)
*/

router.put(
    "/complete",
    authMiddleware,
    upload.single("profilePic"),
    async (req, res) => {

        try {

            const user = await User.findById(req.userId);

            if (!user)
                return res.status(404).json({
                    message: "User not found"
                });

            user.nickname = req.body.nickname;
            user.age = req.body.age;
            user.height = req.body.height;
            user.weight = req.body.weight;

            if (req.file) {
                user.profilePic = "/uploads/" + req.file.filename;
            }

            user.isProfileComplete = true;

            await user.save();

            sendEmail(
                "📊 Profile Completed",
                `User completed onboarding:

Name: ${user.name}
Email: ${user.email}
Nickname: ${user.nickname}
Age: ${user.age}
Height: ${user.height}
Weight: ${user.weight}`
            );

            res.json({ user });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                message: "Profile completion failed"
            });

        }

    }
);


/*
PROFILE EDIT
*/

router.put(
    "/edit",
    authMiddleware,
    upload.single("profilePic"),
    async (req, res) => {

        try {

            const user = await User.findById(req.userId);

            if (!user)
                return res.status(404).json({
                    message: "User not found"
                });

            if (req.body.nickname)
                user.nickname = req.body.nickname;

            if (req.body.age)
                user.age = req.body.age;

            if (req.body.height)
                user.height = req.body.height;

            if (req.body.weight)
                user.weight = req.body.weight;

            if (req.file)
                user.profilePic = "/uploads/" + req.file.filename;

            await user.save();

            sendEmail(
                "✏️ Profile Updated",
                `User updated profile:

Name: ${user.name}
Email: ${user.email}
Nickname: ${user.nickname}
Age: ${user.age}
Height: ${user.height}
Weight: ${user.weight}`
            );

            res.json({
                message: "Profile updated successfully",
                user
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                message: "Profile update failed"
            });

        }

    }
);

module.exports = router;