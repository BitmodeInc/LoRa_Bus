import express, { Request, NextFunction } from 'express';
import pool from '../../libs/db'; // ใช้ฐานข้อมูล
import { typedResponse } from '../../types/express';

const router = express.Router();

// Route to add a new bus
router.post('/', async (req: Request, res: typedResponse<{ success: boolean; msg: string; data?: any }>, next: NextFunction) => {
  const { Admin_ID, Bus_name, Bus_Line, Dip_Switch_Value } = req.body;

  // ตรวจสอบค่าที่รับมา
  console.log('Request body:', req.body);

  if (!Bus_name || !Bus_Line || !Admin_ID) {
    return res.status(400).json({
      success: false,
      msg: "กรุณากรอกข้อมูลให้ครบถ้วน"
    });
  }

  // แปลงค่า Dip_Switch_Value ให้เป็น int ถ้ามีการส่งค่า


  try {
    // ตรวจสอบ Bus_name
    const [busRows] = await pool.query('SELECT Bus_ID FROM Bus WHERE Bus_name = ?', [Bus_name]);
    console.log('Bus query result:', busRows);

    if ((busRows as any[]).length > 0) {
      return res.status(400).json({
        success: false,
        msg: `มีรถรับส่งที่ชื่อ "${Bus_name}" อยู่แล้ว กรุณาใช้ชื่ออื่น`
      });
    }

    if (Dip_Switch_Value) {
      const [loraRows] = await pool.query('SELECT Dip_Switch_Value FROM LoRa WHERE Dip_Switch_Value = ?', [Dip_Switch_Value]);
    
      if ((loraRows as any[]).length === 0) {
        return res.status(400).json({
          success: false,
          msg: 'Dip_Switch_Value ไม่ถูกต้อง: ไม่พบอุปกรณ์ LoRa'
        });
      }
    
      // ตรวจสอบว่ามีการใช้งาน Dip_Switch_Value นี้ในรถคันอื่นหรือไม่
      const [busWithDip] = await pool.query('SELECT Bus_ID FROM Bus WHERE Dip_Switch_Value = ?', [Dip_Switch_Value]);
      if ((busWithDip as any[]).length > 0) {
        return res.status(400).json({
          success: false,
          msg: `Dip_Switch_Value "${Dip_Switch_Value}" ถูกใช้งานโดยรถคันอื่นแล้ว`
        });
      }
    }

    // เพิ่มข้อมูลใหม่
    const [result] = await pool.query(
      `INSERT INTO Bus (Bus_name, Bus_Line, Dip_Switch_Value) VALUES (?, ?, ?)`,
      [Bus_name, Bus_Line, Dip_Switch_Value || null]
    );
    console.log('Insert Bus result:', result);

    const insertedBusId = (result as any).insertId;

    // บันทึก log ใน EditLog
    const logMessage = `สร้างรถรับส่งคันใหม่ ชื่อ: "${Bus_name}", สาย: "${Bus_Line}"` +
      (Dip_Switch_Value ? `, และ Dip_Switch_Value: "${Dip_Switch_Value}"` : '');

    await pool.query(
      `INSERT INTO EditLog (Admin_ID, ID, Type, Edit_Detail) VALUES (?, ?, 'Bus', ?)`,
      [Admin_ID, insertedBusId, logMessage]
    );

    res.status(201).json({
      success: true,
      msg: "รถรับส่งถูกเพิ่มเรียบร้อยแล้ว",
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error during database operation:', error);
    res.status(500).json({
      success: false,
      msg: "เกิดความผิดพลาด ไม่สามารถกระทำสิ่งนี้ได้",
      error: err.message // ส่งรายละเอียด error กลับไปด้วย
    });
  }
});


export default router;
