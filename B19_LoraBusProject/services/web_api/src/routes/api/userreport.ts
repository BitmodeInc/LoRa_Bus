import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../libs/db';
import { ResultSetHeader } from 'mysql2';

const router = Router();

// API สำหรับดึงรายงานทั้งหมดและเพิ่มรายงานใหม่

// GET: ดึงข้อมูลรายงานทั้งหมด
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [rows] = await pool.query('SELECT * FROM UserReport');
    
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
});

// POST: เพิ่มรายงานใหม่
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { type, detail } = req.body;

  // ตรวจสอบว่ารับค่ามาครบหรือไม่
  if (!type || !detail) {
    return res.status(400).json({ success: false, msg: 'Type and Detail are required' });
  }

  try {
    // เพิ่มข้อมูลรายงานลงในฐานข้อมูล
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO UserReport (Type, Detail) VALUES (?, ?)',
      [type, detail]
    );

    res.status(201).json({
      success: true,
      msg: 'Report submitted successfully',
      reportId: result.insertId // แสดง ID ของ report ที่เพิ่ม
    });
  } catch (error) {
    next(error);
  }
});

export default router;
