import express, { Request, NextFunction } from 'express';
import pool from '../../libs/db'; // ใช้ฐานข้อมูล
import { typedResponse } from '../../types/express';

const router = express.Router();

// Route to delete a shuttle by ID
router.delete('/:id', async (req: Request, res: typedResponse<{ success: boolean; msg: string }>, next: NextFunction) => {
  const { id } = req.params;
  const Admin_ID = req.body.Admin_ID; // รับ Admin_ID จาก request body

  // ตรวจสอบว่ามี ID ของรถรับส่งที่ระบุหรือไม่
  if (!id) {
    return res.status(400).json({ success: false, msg: "กรุณาระบุ ID ของรถรับส่งที่ต้องการลบ" });
  }

  // ตรวจสอบว่า Admin_ID ถูกส่งมาหรือไม่
  if (!Admin_ID) {
    return res.status(400).json({ success: false, msg: "Admin กรุณาเข้าสู่ระบบ" });
  }

  try {
    // ลบข้อมูลรถรับส่งจากฐานข้อมูล
    const [result] = await pool.query(
      `DELETE FROM Bus WHERE Bus_ID = ?`,
      [id]
    );

    // ตรวจสอบว่ามีการลบแถวหรือไม่
    if ((result as { affectedRows: number }).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        msg: "ไม่พบรถรับส่งที่มี ID นี้"
      });
    }

    // บันทึก log ลงใน EditLog ว่ามีการลบรถรับส่ง
    const logMessage = `ลบรถรับส่งที่มี ID: "${id}"`;
    await pool.query(
      `INSERT INTO EditLog (Admin_ID, ID, Type, Edit_Detail) VALUES (?, ?, 'Bus', ?)`,
      [Admin_ID, id, logMessage]
    );

    res.status(200).json({
      success: true,
      msg: "ลบรถรับส่งเรียบร้อยแล้ว"
    });
  } catch (error) {
    // จัดการข้อผิดพลาดและส่งกลับไปยัง middleware
    console.error('Error deleting bus:', error);
    res.status(500).json({
      success: false,
      msg: "เกิดข้อผิดพลาดในการลบรถรับส่ง กรุณาลองใหม่อีกครั้ง"
    });
    next(error); // ส่งข้อผิดพลาดไปยัง middleware จัดการข้อผิดพลาด
  }
});

export default router;
