import express, { Request, NextFunction } from 'express';
import pool from '../../libs/db';
import { typedResponse } from '../../types/express';

const router = express.Router();

router.get('/', async (req: Request, res: typedResponse, next: NextFunction) => {
  try {
    // ดึงข้อมูลทั้งหมดจากตาราง Bus
    const [rows]: any[] = await pool.query(`
      SELECT Bus_ID, Bus_Name, Bus_Line, Dip_Switch_Value,
             DATE_FORMAT(CreateAt, '%Y-%m-%dT%H:%i:%sZ') AS CreateAt,
             DATE_FORMAT(UpdateAt, '%Y-%m-%dT%H:%i:%sZ') AS UpdateAt
      FROM Bus
    `);

    // ส่งข้อมูลกลับไปให้ผู้ใช้
    res.status(200).json({
      success: true,
      data: rows,
      msg: 'ดึงข้อมูลรถรับส่งสำเร็จ'
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);

    // จัดการข้อผิดพลาดและส่งข้อความที่เหมาะสมให้ผู้ใช้
    res.status(500).json({
      success: false,
      msg: 'ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่ภายหลัง'
    });
  }
});

export default router;
