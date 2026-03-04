const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"ProjectFlow" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

const verificationEmailTemplate = (name, url) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #6366f1;">Welcome to ProjectFlow! 🚀</h2>
    <p>Hi ${name},</p>
    <p>Please verify your email address by clicking the button below:</p>
    <a href="${url}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
      Verify Email
    </a>
    <p>This link expires in 24 hours.</p>
    <p>If you didn't create an account, ignore this email.</p>
  </div>
`;

const resetPasswordEmailTemplate = (name, url) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #6366f1;">Reset Your Password</h2>
    <p>Hi ${name},</p>
    <p>Click the button below to reset your password:</p>
    <a href="${url}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
      Reset Password
    </a>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, ignore this email.</p>
  </div>
`;

module.exports = { sendEmail, verificationEmailTemplate, resetPasswordEmailTemplate };