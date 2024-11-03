import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../libs/db'; // MySQL connection pool

const router = Router();

// GET API: ดึงข้อมูลจากตาราง EditLog
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Query ดึงข้อมูลทั้งหมดจาก EditLog
    const [rows] = await pool.query('SELECT * FROM EditLog ORDER BY Edit_Time DESC');

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'No edit logs found'
      });
    }

    // ส่งข้อมูลกลับเป็น JSON
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    const err = error as any;
    console.error('Error fetching edit logs:', err.message || 'Unknown error');
    next(error);
  }
});

export default router;
