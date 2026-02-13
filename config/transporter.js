const nodemailer = require("nodemailer");
require("dotenv").config();

// SHARED EMAIL CONFIGURATION
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OWNER_EMAIL,
    pass: process.env.OWNER_PASSWORD,
  },
});

module.exports = transporter;
