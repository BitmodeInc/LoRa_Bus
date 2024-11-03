import { Router, Request, Response } from 'express';
import pool from '../../libs/db';
import { jwtDecode} from '../../libs/jwt';  // Your jwtEncode function for token creation
import { sendResetEmail } from '../../libs/email';  // Function to send email
import { RowDataPacket } from 'mysql2';
import { hashPassword } from '../../libs/hash';
import { JWTPayload } from 'jose';  // เพิ่มการ import นี้เข้ามา
const router = Router();

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
  router.post('/', async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
  
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
  
    try {
      // ถอดรหัสโทเค็น
      const decoded: JWTPayload | null = await jwtDecode(token);
      if (!decoded) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      // ตรวจสอบว่ามี `exp` ใน `decoded` หรือไม่
      if (!decoded.exp) {
        return res.status(400).json({ message: 'Token does not have an expiration time.' });
      }
  
      // ตรวจสอบว่าโทเค็นยังไม่หมดอายุ
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        return res.status(400).json({ message: 'Token has expired' });
      }

      // หากโทเค็นถูกต้องและยังไม่หมดอายุ ให้อนุญาตให้ตั้งรหัสผ่านใหม่
      const hashedPassword = await hashPassword(newPassword);
      await pool.query('UPDATE Admin SET Password = ? WHERE Admin_ID = ?',
        [hashedPassword, decoded.adminId]
      );

      return res.status(200).json({
        message: 'Password has been reset successfully.',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  export default router;