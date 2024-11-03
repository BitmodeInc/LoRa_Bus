import express, { Request, Response, NextFunction } from 'express';
import pool from '../../libs/db'; // ใช้การเชื่อมต่อฐานข้อมูล (pool)
import { typedResponse } from '../../types/express';
import { RowDataPacket } from 'mysql2'; // ใช้สำหรับจัดการกับข้อมูลที่ดึงมาจาก MySQL

const router = express.Router();

// เส้นทาง POST สำหรับเพิ่มอุปกรณ์ LoRa ใหม่หลังจากทำการสแกน
router.post('/', async (req: Request, res: typedResponse<{ success: boolean; msg: string }>, next: NextFunction) => {
  const { Dip_Switch_Value, Bus_ID, Transmission_Interval, Status, Admin_ID } = req.body; // ดึง Admin_ID จาก request body

  // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาครบหรือไม่
  if (!Dip_Switch_Value || !Transmission_Interval || Status == null || !Admin_ID) {
    return res.status(400).json({ success: false, msg: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    // ตรวจสอบว่าอุปกรณ์ LoRa ที่มี Dip_Switch_Value นี้มีอยู่แล้วหรือไม่ในฐานข้อมูล
    const [existingDevice] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM LoRa WHERE Dip_Switch_Value = ?`, 
      [Dip_Switch_Value]
    );

    if (existingDevice.length > 0) {
      return res.status(409).json({
        success: false,
        msg: 'มีอุปกรณ์ LoRa ที่มี Dip_Switch_Value นี้อยู่แล้ว กรุณาใช้ค่าอื่น',
      });
    }

    // ถ้าไม่มีการส่งค่า Bus_ID มา จะตั้งค่าเป็น null เพื่อไม่ให้เชื่อมโยงกับรถใด ๆ
    const busIdToInsert = Bus_ID || null;

    // เพิ่มอุปกรณ์ LoRa ใหม่เข้าไปในฐานข้อมูล
    const [result] = await pool.query(
      `INSERT INTO LoRa (Dip_Switch_Value, Bus_ID, Transmission_Interval, Status) 
       VALUES (?, ?, ?, ?)`, 
      [Dip_Switch_Value, busIdToInsert, Transmission_Interval, Status]
    );

    // บันทึก log ลงในตาราง EditLog ว่าใครเป็นผู้สร้างและสร้างอะไร
    const logMessage = `Added new LoRa device with Dip_Switch_Value: "${Dip_Switch_Value}", Bus_ID: "${busIdToInsert}", Transmission_Interval: "${Transmission_Interval}", Status: "${Status}"`;

    await pool.query(
      `INSERT INTO EditLog (Admin_ID, ID, Type, Edit_Detail) VALUES (?, ?, 'LoRa', ?)`,
      [Admin_ID, (result as any).insertId, logMessage] // ใช้ insertId ของ LoRa ที่เพิ่งถูกสร้าง
    );

    // ส่งข้อความแจ้งว่าเพิ่มอุปกรณ์สำเร็จพร้อมกับสถานะ 201 (Created)
    res.status(201).json({
      success: true,
      msg: 'อุปกรณ์ LoRa ถูกเพิ่มเรียบร้อยแล้ว',
    });
  } catch (error: unknown) {
    console.error('Error inserting LoRa device:', error); // แสดงข้อผิดพลาดใน console

    if (error instanceof Error) {
      // ตรวจสอบการซ้ำซ้อน
      if ((error as any).code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          msg: 'มีอุปกรณ์ LoRa ที่มี Dip_Switch_Value นี้อยู่แล้ว กรุณาใช้ค่าอื่น',
        });
      }
      
      return res.status(500).json({
        success: false,
        msg: `เกิดข้อผิดพลาด: ${error.message}`,
      });
    }

    return res.status(500).json({
      success: false,
      msg: 'เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์ LoRa',
    });
  }
});

export default router; // ส่งออก router เพื่อให้ใช้ในที่อื่นได้
