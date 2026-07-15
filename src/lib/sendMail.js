import nodemailer from "nodemailer";

export const sendResetEmail = async (email, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the button below:</p>

        <a href="${resetUrl}" 
           style="display:inline-block;padding:10px 20px;background:#17100b;color:#fff;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>

        <p>This link will expire in 15 minutes.</p>
      </div>
    `,
  });
};