const transporter = require("../config/transporter");
require("dotenv").config();

exports.submitContact = (req, res) => {
  const { name, email, phone, message } = req.body;

  const adminMailOptions = {
    from: `"Website Inquiry" <${process.env.OWNER_EMAIL}>`,
    to: process.env.OWNER_EMAIL,
    replyTo: email,
    subject: `📩 New Contact Inquiry from ${name}`,
    html: `
        <div style="font-family: Arial, sans-serif;">
            <h2 style="color: #4CAF50;">New Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong><br>${message}</p>
        </div>`,
  };

  transporter
    .sendMail(adminMailOptions)
    .then(() =>
      res.json({ success: true, message: "Message sent successfully!" }),
    )
    .catch((err) => {
      console.error("CONTACT ERROR:", err);
      res
        .status(500)
        .json({ success: false, message: "Failed to send message." });
    });
};
