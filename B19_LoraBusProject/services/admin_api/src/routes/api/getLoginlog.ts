import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../libs/db'; // MySQL connection pool

const router = Router();

// GET API: ดึงข้อมูลจากตาราง LoginLog
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Query ดึงข้อมูลทั้งหมดจาก LoginLog
      const [rows] = await pool.query('SELECT * FROM LoginLog ORDER BY Login_Time DESC');
      
      // ตรวจสอบว่าพบข้อมูลหรือไม่
      if (Array.isArray(rows) && rows.length === 0) {
        return res.status(404).json({
          success: false,
          msg: 'No login logs found'
        });
      }
  
      // ส่งข้อมูลกลับเป็น JSON
      res.status(200).json({
        success: true,
        data: rows
      });
    } catch (error) {
      // แปลง error เป็น any เพื่อให้แน่ใจว่าเราสามารถเข้าถึง message ได้
      const err = error as any;
      
      // หรือใช้ instanceof ตรวจสอบว่า error เป็น Error หรือไม่
      console.error('Error fetching login logs:', err.message || 'Unknown error');
      next(error);
    }
  });
  

export default router;
