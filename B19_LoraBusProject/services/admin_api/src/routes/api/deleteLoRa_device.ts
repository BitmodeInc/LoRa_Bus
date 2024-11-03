import express, { Request, NextFunction } from 'express';
import pool from '../../libs/db'; // ใช้ฐานข้อมูล
import { typedResponse } from '../../types/express';
import { ResultSetHeader } from 'mysql2'; // Import ResultSetHeader for type safety

const router = express.Router();

// Route to delete a LoRa device by ID
router.delete('/:id', async (req: Request, res: typedResponse<{ success: boolean; msg: string }>, next: NextFunction) => {
  const { id } = req.params; // Extract ID from request parameters
  const { Admin_ID } = req.body; // รับ Admin_ID จาก request body

  // ตรวจสอบว่ามี LoRa_ID ที่ระบุหรือไม่
  if (!id) {
    return res.status(400).json({ success: false, msg: "กรุณาระบุ ID ของอุปกรณ์ที่ต้องการลบ" });
  }

  // ตรวจสอบว่า Admin_ID ถูกส่งมาหรือไม่
  if (!Admin_ID) {
    return res.status(400).json({ success: false, msg: "Admin กรุณาเข้าสู่ระบบ" });
  }

  try {
    // ลบข้อมูล LoRa device จากฐานข้อมูล
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM LoRa WHERE Dip_Switch_Value = ?`,
      [id]
    );

    // ตรวจสอบว่ามีการลบแถวหรือไม่
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        msg: "ไม่พบ LoRa device ที่มี ID นี้"
      });
    }

    // บันทึก log ลงใน EditLog ว่ามีการลบ LoRa device
    const logMessage = `ลบอุปกรณ์ LoRa ที่มี ID: "${id}" โดยผู้ดูแลระบบ: "${Admin_ID}"`;
    await pool.query(
      `INSERT INTO EditLog (Admin_ID, ID, Type, Edit_Detail) VALUES (?, ?, 'LoRa', ?)`,
      [Admin_ID, id, logMessage] // Log the Admin_ID, ID, and the log message
    );

    res.status(200).json({
      success: true,
      msg: "ลบอุปกรณ์ LoRa เรียบร้อยแล้ว"
    });
  } catch (error) {
    // จัดการข้อผิดพลาดและส่งกลับไปยัง middleware
    console.error('Error deleting LoRa device:', error);
    res.status(500).json({
      success: false,
      msg: "เกิดข้อผิดพลาดในการลบอุปกรณ์ LoRa กรุณาลองใหม่อีกครั้ง"
    });
    next(error); // ส่งข้อผิดพลาดไปยัง middleware จัดการข้อผิดพลาด
  }
});

export default router;
