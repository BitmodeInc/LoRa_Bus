import express, { Request, NextFunction } from 'express';
import pool from '../../libs/db'; // ใช้ฐานข้อมูล
import { typedResponse } from '../../types/express';

const router = express.Router();

router.post('/', async (req: Request, res: typedResponse<{ success: boolean; msg: string; data?: any }>, next: NextFunction) => {
  const { BusStop_name, BusStop_Latitude, BusStop_Longitude, Admin_ID } = req.body; // รับ Admin_ID จาก request body

  // ตรวจสอบให้แน่ใจว่าค่าที่จำเป็นทั้งหมดถูกส่งมา
  if (!BusStop_name || !BusStop_Latitude || !BusStop_Longitude || !Admin_ID) {
    return res.status(400).json({
      success: false,
      msg: 'กรุณากรอกข้อมูลให้ครบถ้วน'
    });
  }

  try {
    // ตรวจสอบว่ามีข้อมูลที่มี BusStop_name นี้อยู่ในฐานข้อมูลหรือไม่
    const [rows] = await pool.query('SELECT * FROM BusStop WHERE BusStop_name = ?', [BusStop_name]);

    // ใช้ type assertion เพื่อระบุประเภทที่ถูกต้อง
    const results = rows as { BusStop_name: string }[];

    if (results.length > 0) {
      // ถ้ามีข้อมูลอยู่แล้ว, ส่งข้อความแจ้งว่าข้อมูลนั้นมีอยู่แล้ว
      return res.status(400).json({
        success: false,
        msg: 'มีข้อมูลป้ายรอรถที่ชื่อ "${BusStop_name}" อยู่แล้ว กรุณาใช้ชื่ออื่น'
      });
    }

    // กำหนด Search_Details เป็น BusStop_name หากไม่ได้รับค่า
    const Search_Details = req.body.Search_Details ? req.body.Search_Details : BusStop_name;

    // ถ้าไม่มีข้อมูลดังกล่าว, ทำการเพิ่มข้อมูลใหม่
    const [result] = await pool.query(
      `INSERT INTO BusStop (BusStop_name, BusStop_Latitude, BusStop_Longitude, Search_Details, CreateAt, UpdateAt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, 
      [BusStop_name, BusStop_Latitude, BusStop_Longitude, JSON.stringify(Search_Details)]
    );
    
    const insertedBusStopID = (result as any).insertId;

    // บันทึก log ลงในตาราง EditLog ว่าใครเป็นผู้สร้างและสร้างอะไร
    const logMessage = `เพิ่มป้ายรอรถใหม่ ชื่อ: "${BusStop_name}", ละติจูด: "${BusStop_Latitude}", ลองจิจูด: "${BusStop_Longitude}"`;

    await pool.query(
      `INSERT INTO EditLog (Admin_ID, ID, Type, Edit_Detail) VALUES (?, ?, 'BusStop', ?)`,
      [Admin_ID, insertedBusStopID, logMessage] // ใช้ insertId ของ Bus Stop ที่เพิ่งถูกสร้าง
    );

    res.status(201).json({ // ใช้ status 201 สำหรับการสร้างข้อมูลใหม่
      success: true,
      msg: 'ป้ายรอรถถูกเพิ่มเรียบร้อยแล้ว'
    });
  } catch (error) {
    console.error('Error adding bus stop:', error); // แสดงข้อผิดพลาดใน console
    next(error); // ส่งข้อผิดพลาดไปยัง middleware จัดการข้อผิดพลาด
  }
});

export default router;
