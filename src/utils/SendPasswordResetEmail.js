import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port:2525,
//     auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAIL_PASSWORD
//     }
// })

// using gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }
});


export const sendPasswordResetEmail = async (to, resetUrl, from = "milliontech.com") => {
  const mailOptions = {
    to,
    from,
    subject: "Password Reset",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send password reset email to ${to}:`, error);
    throw new Error("Failed to send email");
  }
};

