import { Router, Request, Response } from 'express';
import pool from '../../libs/db';
import { jwtEncode } from '../../libs/jwt';  // Your jwtEncode function for token creation
import { sendResetEmail } from '../../libs/email';  // Function to send email
import { RowDataPacket } from 'mysql2';
interface Admin extends RowDataPacket {
    Admin_ID: number;
    Username: string;
    Password: string;
    FirstName: string;
    LastName: string;
    Email: string;
    CreateAt: number;
    UpdateAt: number;
  }
const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const [rows]: [Admin[], any] = await pool.query(
      'SELECT * FROM Admin WHERE Email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const admin = rows[0];
    const resetToken = await jwtEncode({ 
      id: admin.Admin_ID, // เพิ่ม id
      adminId: admin.Admin_ID, 
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
  });

    // // Store the token in the database (or in memory) for a limited time
    // await pool.query('UPDATE Admin SET ResetToken = ?, ResetTokenExpiry = ? WHERE Admin_ID = ?', 
    //   [resetToken, Date.now() + 3600000, admin.Admin_ID] // 1 hour expiry
    // );

    // Send email with the reset link
    // const resetLink = `https://your-app.com/reset-password?token=${resetToken}`;
    const resetLink = `https://www.lora-bus.com/ResetPassword?token=${resetToken}`;
    await sendResetEmail(email, resetLink);

    return res.status(200).json({
      message: 'Password reset email sent.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
