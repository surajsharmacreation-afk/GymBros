const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {

  try {

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    await sendEmail(
      "📨 Support Request Received",
      `Support message:

Name: ${name}
Email: ${email}

Message:
${message}`
    );

    res.json({
      message: "Message sent successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: "Email sending failed"
    });

  }

});

module.exports = router;