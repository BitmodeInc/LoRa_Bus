import express, { Request, Response, NextFunction } from 'express';
import pool from '../../libs/db'; // ใช้ฐานข้อมูล
import { typedResponse } from '../../types/express';
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// Route สำหรับดึงข้อมูล Transmission Interval ทั้งหมด
// Route สำหรับดึงข้อมูล Transmission Interval ทั้งหมด
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Query ดึงข้อมูลทั้งหมดจากตารางที่มี Transmission Interval
    const [rows] = await pool.query('SELECT Dip_Switch_Value, Transmission_Interval FROM LoRa');

    // แปลง rows ให้เป็นชนิดที่ถูกต้อง
    const data = rows as RowDataPacket[];

    // ถ้าไม่พบข้อมูล
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'No transmission intervals found'
      });
    }

    // ส่งข้อมูลทั้งหมดกลับไป
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching transmission intervals:', error);
    next(error);
  }
});

// GET: ดึง Transmission Interval ของ LoRa Node ที่ระบุด้วย Dip_Switch_Value
router.get('/:dipSwitchValue', async (req: Request, res: Response, next: NextFunction) => {
  const { dipSwitchValue } = req.params;

  try {
    // ดึง Transmission Interval จากฐานข้อมูล
    const [rows] = await pool.query('SELECT Transmission_Interval FROM LoRa WHERE Dip_Switch_Value = ?', [dipSwitchValue]);
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No LoRa Node found with Dip_Switch_Value ${dipSwitchValue}`
      });
    }

    const transmissionInterval = (rows as any[])[0].Transmission_Interval;

    res.status(200).json({
      success: true,
      data: {
        dipSwitchValue,
        transmissionInterval,
      }
    });
  } catch (error) {
    console.error('Error fetching Transmission Interval:', error);
    next(error);
  }
});

// PUT: เปลี่ยน Transmission Interval ของ LoRa Node ที่ระบุด้วย Dip_Switch_Value
router.put('/:dipSwitchValue', async (req: Request, res: Response, next: NextFunction) => {
  const { dipSwitchValue } = req.params;
  const { transmissionInterval } = req.body;

  // ตรวจสอบว่าค่าที่จำเป็นถูกส่งมาครบถ้วน
  if (!transmissionInterval || typeof transmissionInterval !== 'number') {
    return res.status(400).json({
      success: false,
      msg: 'Please provide a valid transmissionInterval as a number'
    });
  }

  try {
    // ตรวจสอบว่ามี LoRa Node ที่มี Dip_Switch_Value ที่ระบุอยู่หรือไม่
    const [checkRows] = await pool.query('SELECT * FROM LoRa WHERE Dip_Switch_Value = ?', [dipSwitchValue]);

    if ((checkRows as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No LoRa Node found with Dip_Switch_Value ${dipSwitchValue}`
      });
    }

    // อัปเดต Transmission Interval ในฐานข้อมูล
    await pool.query('UPDATE LoRa SET Transmission_Interval = ? WHERE Dip_Switch_Value = ?', [transmissionInterval, dipSwitchValue]);

    // TODO: แจ้ง Gateway ให้ส่งคำสั่ง Downlink ไปยัง Node

    res.status(200).json({
      success: true,
      msg: `Transmission Interval for LoRa Node with Dip_Switch_Value ${dipSwitchValue} updated to ${transmissionInterval}`
    });
  } catch (error) {
    console.error('Error updating Transmission Interval:', error);
    next(error);
  }
});

export default router;
