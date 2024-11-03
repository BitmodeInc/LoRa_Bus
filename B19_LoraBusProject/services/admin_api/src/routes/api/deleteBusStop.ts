import express, { Request, NextFunction } from 'express';
import pool from '../../libs/db'; // ใช้ฐานข้อมูล
import { typedResponse } from '../../types/express';
import { ResultSetHeader } from 'mysql2'; // Import ResultSetHeader for type safety

const router = express.Router();

// Route to delete a bus stop using ID
router.delete('/:id', async (req: Request, res: typedResponse<{ success: boolean; msg: string }>, next: NextFunction) => {
  const { id } = req.params; // Extract ID from request parameters
  const { Admin_ID } = req.body; // รับ Admin_ID จาก request body

  // ตรวจสอบว่ามี ID ของป้ายรอรถที่ระบุหรือไม่
  if (!id) {
    return res.status(400).json({ success: false, msg: "กรุณาระบุ ID ของป้ายรอรถที่ต้องการลบ" });
  }

  // ตรวจสอบว่า Admin_ID ถูกส่งมาหรือไม่
  if (!Admin_ID) {
    return res.status(400).json({ success: false, msg: "Admin กรุณาเข้าสู่ระบบ" });
  }

  try {
    // ลบข้อมูลป้ายรอรถจากฐานข้อมูล
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM BusStop WHERE BusStop_ID = ?`,
      [id]
    );

    // ตรวจสอบว่ามีการลบแถวหรือไม่
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, msg: "ไม่พบป้ายรอรถที่มี ID นี้" });
    }

    // บันทึก log ลงใน EditLog ว่ามีการลบป้ายรอรถ
    const logMessage = `ลบป้ายรอรถที่มี ID: "${id}"`;
    await pool.query(
      `INSERT INTO EditLog (Admin_ID, ID, Type, Edit_Detail) VALUES (?, ?, 'BusStop', ?)`,
      [Admin_ID, id, logMessage] // Log the Admin_ID, ID, and the log message
    );

    res.status(200).json({
      success: true,
      msg: "ลบป้ายรอรถเรียบร้อยแล้ว"
    });
  } catch (error) {
    // จัดการข้อผิดพลาดและส่งกลับไปยัง middleware
    console.error('Error deleting bus stop:', error);
    res.status(500).json({
      success: false,
      msg: "เกิดข้อผิดพลาดในการลบป้ายรอรถ กรุณาลองใหม่อีกครั้ง"
    });
    next(error); // ส่งข้อผิดพลาดไปยัง middleware จัดการข้อผิดพลาด
  }
});

export default router;