const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Define a function to send email
  async function sendEmail(to, subject, html) {
  
    try {
      // Compose the email
      const mailOptions = {
        from: 'armaangogoi2004@gmail.com',
        to: to,
        subject: subject,
        html: html,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

module.exports = sendEmail