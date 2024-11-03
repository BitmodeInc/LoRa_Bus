import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../libs/db'; // MySQL connection pool

const router = Router();

// GET API: ดึงข้อมูลจากตาราง SearchLog
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Query ดึงข้อมูลทั้งหมดจาก SearchLog
    const [rows] = await pool.query('SELECT * FROM SearchLog ORDER BY Log_ID ASC');
    
    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'No search logs found'
      });
    }

    // ส่งข้อมูลกลับเป็น JSON
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    const err = error as any;
    console.error('Error fetching search logs:', err.message || 'Unknown error');
    next(error);
  }
});

router.get('/popular', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Query นับจำนวน Search_Term ที่เหมือนกันและเรียงลำดับจากมากไปน้อย
    const [rows] = await pool.query(
      `SELECT Search_Term, COUNT(*) AS count 
       FROM SearchLog 
       GROUP BY Search_Term 
       ORDER BY count DESC 
       LIMIT 10`
    );

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'No popular search terms found'
      });
    }

    // ส่งข้อมูลกลับเป็น JSON
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    const err = error as any;
    console.error('Error fetching popular search terms:', err.message || 'Unknown error');
    next(error);
  }
});

export default router;
