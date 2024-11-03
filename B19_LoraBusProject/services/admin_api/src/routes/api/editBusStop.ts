import express, { Request, NextFunction } from 'express';
import pool from '../../libs/db'; // ใช้ฐานข้อมูล
import { typedResponse } from '../../types/express';

const router = express.Router();

// Route to update a bus stop by ID
router.put('/:id', async (req: Request, res: typedResponse<{ success: boolean; msg: string }>, next: NextFunction) => {
  const { id } = req.params;
  const { BusStop_Name, BusStop_Latitude, BusStop_Longitude, Search_Details, Admin_ID } = req.body;

  console.log(req.body); // ตรวจสอบค่าที่ได้รับ

  // ตรวจสอบว่ามี ID ป้ายรถรับส่งที่ระบุหรือไม่
  if (!id) {
    return res.status(400).json({ success: false, msg: "กรุณาระบุ BusStop_ID ที่ต้องการแก้ไข" });
  }

  // ตรวจสอบว่า Admin_ID ถูกส่งมาหรือไม่
  if (!Admin_ID) {
    return res.status(401).json({ success: false, msg: "กรุณาเข้าสู่ระบบด้วย Admin_ID" });
  }

  try {
    // ดึงข้อมูลป้ายรถรับส่งปัจจุบันเพื่อการบันทึก log
    const [currentBusStop]: any[] = await pool.query(
      `SELECT BusStop_name, BusStop_Latitude, BusStop_Longitude, Search_Details FROM BusStop WHERE BusStop_ID = ?`,
      [id]
    );

    // ตรวจสอบว่ามีป้ายรถรับส่งที่พบหรือไม่
    if (currentBusStop.length === 0) {
      return res.status(404).json({ success: false, msg: "ไม่พบป้ายรถรับส่งที่ระบุ" });
    }

    const oldBusStop = currentBusStop[0];

    // สร้างค่าที่จะอัปเดตโดยใช้ค่าจาก request หรือค่าปัจจุบันหากไม่มีการส่งมาที่ request
    const updatedBusStopName = BusStop_Name || oldBusStop.BusStop_Name;
    const updatedBusStopLatitude = BusStop_Latitude || oldBusStop.BusStop_Latitude;
    const updatedBusStopLongitude = BusStop_Longitude || oldBusStop.BusStop_Longitude;
    const updatedSearchDetails = Search_Details ? JSON.stringify(Search_Details) : oldBusStop.Search_Details;

    // อัปเดตข้อมูลป้ายรถรับส่งในฐานข้อมูล
    const [result] = await pool.query(
      `UPDATE BusStop 
       SET BusStop_name = ?, BusStop_Latitude = ?, BusStop_Longitude = ?, Search_Details = ?, UpdateAt = CURRENT_TIMESTAMP 
       WHERE BusStop_ID = ?`,
      [updatedBusStopName, updatedBusStopLatitude, updatedBusStopLongitude, updatedSearchDetails, id]
    );

    // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        msg: "ไม่พบป้ายรถรับส่งที่ระบุ"
      });
    }

    // สร้าง log สำหรับการเปลี่ยนแปลงใด ๆ
    let logDetails: string[] = [];
    
    if (oldBusStop.BusStop_name !== updatedBusStopName) {
      logDetails.push(`เปลี่ยนชื่อป้ายรถรับส่งจาก "${oldBusStop.BusStop_name}" เป็น "${updatedBusStopName}"`);
    }
    if (oldBusStop.BusStop_Latitude !== updatedBusStopLatitude) {
      logDetails.push(`เปลี่ยนละติจูดป้ายรถรับส่งจาก "${oldBusStop.BusStop_Latitude}" เป็น "${updatedBusStopLatitude}"`);
    }
    if (oldBusStop.BusStop_Longitude !== updatedBusStopLongitude) {
      logDetails.push(`เปลี่ยนลองจิจูดป้ายรถรับส่งจาก "${oldBusStop.BusStop_Longitude}" เป็น "${updatedBusStopLongitude}"`);
    }
    if (oldBusStop.Search_Details !== updatedSearchDetails) {
      logDetails.push(`อัปเดตรายละเอียดการค้นหา`);
    }

    // บันทึก log สำหรับการเปลี่ยนแปลง
    if (logDetails.length > 0) {
      await pool.query(
        `INSERT INTO EditLog (Admin_ID, ID, Type, Edit_Detail) VALUES (?, ?, 'BusStop', ?)`,
        [Admin_ID, id, logDetails.join('\n')] // เชื่อม log details ด้วยตัวขึ้นบรรทัด
      );
    }

    res.status(200).json({
      success: true,
      msg: "แก้ไขป้ายรถรับส่งเรียบร้อยแล้ว"
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error); // Log ข้อผิดพลาดใน console
    // ตรวจสอบประเภทของข้อผิดพลาดและส่งข้อความที่เหมาะสม
    if (error instanceof Error) {
      return res.status(500).json({ success: false, msg: error.message });
    } else {
      return res.status(500).json({ success: false, msg: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
    }
  }
});

export default router;
