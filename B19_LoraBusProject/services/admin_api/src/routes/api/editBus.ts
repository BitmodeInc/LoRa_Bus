import express, { Request, NextFunction } from 'express';
import pool from '../../libs/db'; // ใช้ฐานข้อมูล
import { typedResponse } from '../../types/express';
import { RowDataPacket, FieldPacket } from 'mysql2'; // Import RowDataPacket and FieldPacket for type assertion

const router = express.Router();

// Route to edit a bus by ID
router.put('/:id', async (req: Request, res: typedResponse<{ success: boolean; msg: string }>, next: NextFunction) => {
  const { id } = req.params;
  const { Bus_name, Bus_Line, Admin_ID } = req.body; // Ensure Admin_ID is sent in the request

  // ตรวจสอบว่ามี Bus_ID ที่ระบุหรือไม่
  if (!id) {
    return res.status(400).json({ success: false, msg: "กรุณาระบุ ID ของรถรับส่งที่ต้องการแก้ไข" });
  }

  // ตรวจสอบว่ามีค่า Bus_name หรือ Bus_Line ที่ส่งมาหรือไม่
  if (!Bus_name && !Bus_Line) {
    return res.status(400).json({ success: false, msg: "กรุณาระบุอย่างน้อยหนึ่งอย่าง" });
  }

  try {
    // ดึงข้อมูลปัจจุบันของรถรับส่ง
    const [currentBus]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      `SELECT Bus_name, Bus_Line FROM Bus WHERE Bus_ID = ?`,
      [id]
    );

    // ตรวจสอบว่ามีรถรับส่งอยู่หรือไม่
    if (currentBus.length === 0) {
      return res.status(404).json({ success: false, msg: "ไม่พบรถรับส่งที่มี ID นี้" });
    }

    const oldBusName = currentBus[0].Bus_name;
    const oldBusLine = currentBus[0].Bus_Line;

    // Update query (อัปเดตค่าเวลาเป็น TIMESTAMP)
    const [result] = await pool.query(
      `UPDATE Bus SET 
        Bus_name = COALESCE(?, Bus_name), 
        Bus_Line = COALESCE(?, Bus_Line), 
        UpdateAt = CURRENT_TIMESTAMP 
      WHERE Bus_ID = ?`,
      [Bus_name, Bus_Line, id]
    );

    // สร้าง log entries สำหรับการเปลี่ยนแปลงที่เกิดขึ้น
    let logDetails: string[] = [];

    if (Bus_name) {
      logDetails.push(`เปลี่ยนชื่อรถรับส่งจาก "${oldBusName}" เป็น "${Bus_name}"`);
    }
    if (Bus_Line) {
      logDetails.push(`เปลี่ยนเส้นทางรถรับส่งจาก "${oldBusLine}" เป็น "${Bus_Line}"`);
    }

    // บันทึก log สำหรับการเปลี่ยนแปลง
    if (result && (result as any).affectedRows > 0) {
      await pool.query(
        `INSERT INTO EditLog (Admin_ID, ID, Type, Edit_Detail) VALUES (?, ?, 'Bus', ?)`,
        [Admin_ID, id, logDetails.join('\n')] // รวม log details ด้วย newline
      );

      return res.status(200).json({ success: true, msg: "แก้ไขรถรับส่งเรียบร้อยแล้ว" });
    }

    res.status(404).json({ success: false, msg: "ไม่มีการเปลี่ยนแปลงเกิดขึ้น" });
  } catch (error) {
    next(error);
  }
});

export default router;
// import express, { Request, NextFunction } from 'express';
// import pool from '../../libs/db'; // ใช้ฐานข้อมูล
// import { typedResponse } from '../../types/express';
// import { RowDataPacket, FieldPacket } from 'mysql2'; // Import RowDataPacket and FieldPacket for type assertion

// const router = express.Router();

// // Route to edit a bus by ID
// router.put('/:id', async (req: Request, res: typedResponse<{ success: boolean; msg: string }>, next: NextFunction) => {
//   const { id } = req.params;
//   const { Bus_name, Bus_Line, Dip_Switch_Value, Admin_ID } = req.body; // Ensure Admin_ID is sent in the request

//   // ตรวจสอบว่ามี Bus_ID ที่ระบุหรือไม่
//   if (!id) {
//     return res.status(400).json({ success: false, msg: "กรุณาระบุ ID ของรถรับส่งที่ต้องการแก้ไข" });
//   }

//   // ตรวจสอบว่ามีค่า Bus_name, Bus_Line หรือ Dip_Switch_Value ที่ส่งมาหรือไม่
//   if (!Bus_name && !Bus_Line && typeof Dip_Switch_Value !== 'undefined') {
//     return res.status(400).json({ success: false, msg: "กรุณาระบุอย่างน้อยหนึ่งอย่าง" });
//   }

//   try {
//     // ดึงข้อมูลปัจจุบันของรถรับส่ง
//     const [currentBus]: [RowDataPacket[], FieldPacket[]] = await pool.query(
//       `SELECT Bus_name, Bus_Line, Dip_Switch_Value FROM Bus WHERE Bus_ID = ?`,
//       [id]
//     );

//     // ตรวจสอบว่ามีรถรับส่งอยู่หรือไม่
//     if (currentBus.length === 0) {
//       return res.status(404).json({ success: false, msg: "ไม่พบรถรับส่งที่มี ID นี้" });
//     }

//     const oldBusName = currentBus[0].Bus_name;
//     const oldBusLine = currentBus[0].Bus_Line;
//     const oldDipSwitchValue = currentBus[0].Dip_Switch_Value;

//     // Update query (อัปเดตค่าเวลาเป็น TIMESTAMP)
//     const [result] = await pool.query(
//       `UPDATE Bus SET 
//         Bus_name = COALESCE(?, Bus_name), 
//         Bus_Line = COALESCE(?, Bus_Line), 
//         Dip_Switch_Value = COALESCE(?, Dip_Switch_Value), 
//         UpdateAt = CURRENT_TIMESTAMP 
//       WHERE Bus_ID = ?`,
//       [Bus_name, Bus_Line, Dip_Switch_Value, id]
//     );

//     // สร้าง log entries สำหรับการเปลี่ยนแปลงที่เกิดขึ้น
//     let logDetails: string[] = [];

//     if (Bus_name) {
//       logDetails.push(`เปลี่ยนชื่อรถรับส่งจาก "${oldBusName}" เป็น "${Bus_name}"`);
//     }
//     if (Bus_Line) {
//       logDetails.push(`เปลี่ยนเส้นทางรถรับส่งจาก "${oldBusLine}" เป็น "${Bus_Line}"`);
//     }
//     if (typeof Dip_Switch_Value !== 'undefined') {
//       logDetails.push(`เปลี่ยนค่า Dip_Switch_Value จาก "${oldDipSwitchValue}" เป็น "${Dip_Switch_Value}"`);
//     }

//     // บันทึก log สำหรับการเปลี่ยนแปลง
//     if (result && (result as any).affectedRows > 0) {
//       await pool.query(
//         `INSERT INTO EditLog (Admin_ID, ID, Type, Edit_Detail) VALUES (?, ?, 'Bus', ?)`,

//         [Admin_ID, id, logDetails.join('\n')] // รวม log details ด้วย newline
//       );

//       return res.status(200).json({ success: true, msg: "แก้ไขรถรับส่งเรียบร้อยแล้ว" });
//     }

//     res.status(404).json({ success: false, msg: "ไม่มีการเปลี่ยนแปลงเกิดขึ้น" });
//   } catch (error) {
//     next(error);
//   }
// });

// export default router;
