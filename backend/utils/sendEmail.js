const nodemailer = require("nodemailer");

const sendEmail = async (subject, message) => {
  try {
    // Debug
    console.log("==================================");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
    console.log("PASS LENGTH:", process.env.EMAIL_PASS?.length);
    console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
    console.log("==================================");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Check SMTP connection
    await transporter.verify();
    console.log("✅ Gmail SMTP Connected");

    const info = await transporter.sendMail({
      from: `"Gym Bros" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject,
      text: message,
    });

    console.log("📩 Email sent successfully");
    console.log(info);

  } catch (err) {
    console.error("❌ Email failed");
    console.error(err);
  }
};

module.exports = sendEmail;