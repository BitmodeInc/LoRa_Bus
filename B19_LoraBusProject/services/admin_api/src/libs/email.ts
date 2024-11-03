import nodemailer from 'nodemailer';

export const sendResetEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // ใช้ false สำหรับ STARTTLS
    auth: {
      user: 'ainzzlow@gmail.com', // แทนที่ด้วยอีเมลของคุณ
      pass: 'grbl wgpm duli ycnp', // แทนที่ด้วยรหัสผ่านแอป
    },
  });

  const mailOptions = {
    from: 'LoraAPI',
    to: to ,
    subject: 'Password Reset',
    text: `Here is your password reset link: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
