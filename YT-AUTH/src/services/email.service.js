// YT-AUTH/src/services/email.service.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send message');
  }
});

export async function sendOtpEmail(toEmail, otp) {
  await transporter.sendMail({
    from: `"DoCode" <${process.env.GOOGLE_USER}>`,
    to: toEmail,
    subject: "Your DoCode Password Reset Code",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
        <h2>Reset your DoCode password</h2>
        <p>Use the code below to reset your password. It expires in 10 minutes.</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; background: #f5f5f5; padding: 15px; text-align: center; border-radius: 8px;">${otp}</p>
        <p style="color: #666; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}