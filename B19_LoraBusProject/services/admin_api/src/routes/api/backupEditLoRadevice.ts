import express, { Request, NextFunction } from 'express';
import pool from '../../libs/db'; // ใช้ฐานข้อมูล
import { typedResponse } from '../../types/express';

const router = express.Router();

// Route to update an existing LoRa device
router.put('/:id', async (req: Request, res: typedResponse<{ success: boolean; msg: string }>, next: NextFunction) => {
  const { id } = req.params;
  const { Bus_ID, transmission_interval, LoRa_Battery, LoRa_Temp, Status, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI, Admin_ID } = req.body;

  // ตรวจสอบว่า Admin_ID ถูกส่งมาหรือไม่
  if (!Admin_ID) {
    return res.status(400).json({ success: false, msg: "กรุณาเข้าสู่ระบบด้วย Admin_ID" });
  }

  try {
    // ดึงข้อมูลเดิมจากฐานข้อมูล เพื่อนำค่าเดิมไปใช้ถ้าหากไม่มีการส่งค่าใหม่มา
    const [currentLoRa]: any[] = await pool.query(
      `SELECT Bus_ID, transmission_interval, LoRa_Battery, LoRa_Temp, Status, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI 
       FROM LoRa WHERE LoRa_ID = ?`,
      [id]
    );

    if (currentLoRa.length === 0) {
      return res.status(404).json({ success: false, msg: "ไม่พบอุปกรณ์ LoRa ที่ระบุ" });
    }

    const oldLoRa = currentLoRa[0];

    // ใช้ COALESCE เพื่อให้ข้อมูลเดิมคงอยู่ถ้าข้อมูลใหม่ไม่ได้ถูกส่งมา
    const [result] = await pool.query(
      `UPDATE LoRa 
       SET Bus_ID = COALESCE(?, Bus_ID), 
           transmission_interval = COALESCE(?, transmission_interval), 
           LoRa_Battery = COALESCE(?, LoRa_Battery), 
           LoRa_Temp = COALESCE(?, LoRa_Temp), 
           Status = COALESCE(?, Status), 
           LoRa_Latitude = COALESCE(?, LoRa_Latitude), 
           LoRa_Longitude = COALESCE(?, LoRa_Longitude), 
           LoRa_SNR = COALESCE(?, LoRa_SNR), 
           LoRa_RSSI = COALESCE(?, LoRa_RSSI), 
           UpdateAt = CURRENT_TIMESTAMP 
       WHERE LoRa_ID = ?`,
      [Bus_ID, transmission_interval, LoRa_Battery, LoRa_Temp, Status, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ success: false, msg: "ไม่พบอุปกรณ์ LoRa ที่ระบุ" });
    }

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
