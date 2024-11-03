// Login API (ปรับแล้ว)
import { Router, Request, Response } from 'express';
import pool from '../../libs/db';
import { comparePassword } from '../../libs/hash';
import { ACCESS_TOKEN_MAX_AGE } from '../../config';
import { RowDataPacket } from 'mysql2';
import { jwtEncode } from '../../libs/jwt';

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
  const { username, password } = req.body;


  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // ดึง IP Address ของผู้ใช้
  let ipAddress = req.headers['x-forwarded-for']
    ? (req.headers['x-forwarded-for'] as string).split(',')[0] 
    : req.socket.remoteAddress; 

  if (ipAddress === '::1') {
    ipAddress = '127.0.0.1';
  }
  try {
    const [rows]: [Admin[], any] = await pool.query(
      'SELECT * FROM Admin WHERE Username = ?',
      [username]
    );

    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO LoginLog (Username, Status, IP_Address) VALUES (?, ?, ?)',
        [username, false, ipAddress]
      );
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const admin = rows[0];
    const adminid = admin.Admin_ID
    

    const isPasswordValid = await comparePassword(password, admin.Password);
    if (!isPasswordValid) {
      await pool.query(
        'INSERT INTO LoginLog (Username, Status, IP_Address) VALUES (?, ?, ?)',
        [username, false, ipAddress]
      );
      return res.status(401).json({ message: 'The password is incorrect.' });
    }

    const token = await jwtEncode({ id: admin.Admin_ID });

    // บันทึก Log เมื่อ Login สำเร็จ
    await pool.query(
      'INSERT INTO LoginLog (Username, Status, IP_Address) VALUES (?, ?, ?)',
      [username, true, ipAddress]
    );

    // ส่ง token ผ่าน cookie
    res.cookie("token", token, {
      httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript ฝั่ง client
      secure: true,  // ใช้เฉพาะกับ https
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    
    return res.status(200).json({
      success: true,
      msg: "Login success",adminid,
    });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
