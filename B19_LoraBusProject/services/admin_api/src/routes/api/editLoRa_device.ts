import express, { Request, Response, NextFunction } from 'express';
import pool from '../../libs/db'; // ใช้ฐานข้อมูล
import { typedResponse } from '../../types/express';

const router = express.Router();

// Route to update an existing LoRa device
router.put('/:dipSwitchValue', async (req: Request, res: typedResponse<{ success: boolean; msg: string }>, next: NextFunction) => {
  const { dipSwitchValue } = req.params;
  const { Bus_ID, Transmission_Interval, Status, Admin_ID } = req.body;

  // ตรวจสอบว่า Admin_ID ถูกส่งมาหรือไม่
  if (!Admin_ID) {
    return res.status(400).json({ success: false, msg: "Admin กรุณาเข้าสู่ระบบ" });
  }

  try {
    // ตรวจสอบว่า LoRa ที่มี Dip_Switch_Value นี้มีอยู่ในระบบหรือไม่
    const [currentLoRa]: any[] = await pool.query(
      `SELECT Bus_ID, Transmission_Interval, Status 
       FROM LoRa WHERE Dip_Switch_Value = ?`,
      [dipSwitchValue]
    );

    if (currentLoRa.length === 0) {
      return res.status(404).json({ success: false, msg: "ไม่พบอุปกรณ์ LoRa ที่ระบุ" });
    }

    // ตรวจสอบว่า Dip_Switch_Value นี้มีการผูกกับรถคันอื่นหรือไม่
    const [existingBus]: any[] = await pool.query(
      `SELECT Bus_ID FROM Bus WHERE Dip_Switch_Value = ?`,
      [dipSwitchValue]
    );

    // ถ้ามีการผูกกับรถคันอื่น ให้ลบความสัมพันธ์นั้นก่อน
    if (existingBus.length > 0) {
      await pool.query(
        `UPDATE Bus SET Dip_Switch_Value = NULL WHERE Dip_Switch_Value = ?`,
        [dipSwitchValue]
      );
    }

    // ใช้ค่า Bus_ID ใหม่ หรือถ้าไม่มีค่าให้กำหนดเป็น NULL
    const newBusID = Bus_ID || null;

    // ทำการอัพเดตข้อมูลในตาราง LoRa
    const [result] = await pool.query(
      `UPDATE LoRa 
       SET Bus_ID = COALESCE(?, Bus_ID), 
           Transmission_Interval = COALESCE(?, Transmission_Interval), 
           Status = COALESCE(?, Status), 
           UpdateAt = CURRENT_TIMESTAMP 
       WHERE Dip_Switch_Value = ?`,
      [newBusID, Transmission_Interval, Status, dipSwitchValue]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ success: false, msg: "ไม่พบอุปกรณ์ LoRa ที่ระบุ" });
    }

    // อัพเดต Dip_Switch_Value ในตาราง Bus ให้ตรงกับ Bus_ID
    if (newBusID !== null) {
      await pool.query(
        `UPDATE Bus SET Dip_Switch_Value = ? WHERE Bus_ID = ?`,
        [dipSwitchValue, newBusID]
      );
    }

    // บันทึก log การแก้ไขลงใน EditLog
    const logMessage = `แก้ไขอุปกรณ์ LoRa: Dip_Switch_Value: "${dipSwitchValue}" ได้เปลี่ยน Bus_ID เป็น: "${newBusID}"`;

    await pool.query(
      `INSERT INTO EditLog (Admin_ID, ID, Type, Edit_Detail) VALUES (?, ?, 'LoRa', ?)`,
      [Admin_ID, dipSwitchValue, logMessage]
    );

    res.status(200).json({
      success: true,
      msg: "แก้ไขอุปกรณ์ LoRa เรียบร้อยแล้ว"
    });
  } catch (error) {
    console.error('Error occurred:', error);
    if (error instanceof Error) {
      return res.status(500).json({ success: false, msg: error.message });
    } else {
      return res.status(500).json({ success: false, msg: 'เกิดข้อผิดพลาดในระบบ' });
    }
  }
});

export default router;
