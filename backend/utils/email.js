require('dotenv').config();
const nodemailer = require('nodemailer');

// Step 1: Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the email service
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address (from .env)
      pass: process.env.EMAIL_PASS, // Your Gmail password or app-specific password (from .env)
    },
  });

// Step 2: Create a function to send emails
const sendEmail = (to, subject, text) => {
  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // Recipient address
    subject, // Email subject
    text, // Email body (plain text)
  };

  // Step 3: Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Export the sendEmail function
module.exports = sendEmail;