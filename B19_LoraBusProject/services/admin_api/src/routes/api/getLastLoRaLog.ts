import express, { Request, Response, NextFunction } from 'express';
import pool from '../../libs/db'; // MySQL connection pool
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// GET API to fetch the latest entry for each Dip_Switch_Value
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Query to get the latest data entry for each Dip_Switch_Value from LoRaLog table
        const [loRaLogData] = await pool.query(
            `SELECT l.Dip_Switch_Value, l.LoRa_Battery, l.LoRa_Temp, l.LoRa_Latitude, l.LoRa_Longitude, l.LoRa_SNR, l.LoRa_RSSI, l.Update_Time
             FROM LoRaLog l
             INNER JOIN (
                 SELECT Dip_Switch_Value, MAX(Update_Time) as LatestTime
                 FROM LoRaLog
                 GROUP BY Dip_Switch_Value
             ) latest
             ON l.Dip_Switch_Value = latest.Dip_Switch_Value AND l.Update_Time = latest.LatestTime
             ORDER BY l.Dip_Switch_Value`
        ) as RowDataPacket[];

        // Check if data is found
        if (!Array.isArray(loRaLogData) || loRaLogData.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No latest LoRaLog data found',
            });
        }

        // Respond with the latest entry for each Dip_Switch_Value
        res.status(200).json({
            success: true,
            data: loRaLogData
        });
    } catch (error) {
        console.error("Error fetching latest LoRaLog data:", error);
        next(error);
    }
});

// GET API to fetch the latest entries updated within the last 5 minutes for each Dip_Switch_Value
router.get('/recent', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // กำหนดช่วงเวลาที่ต้องการ (5 นาที)
        const minutesAgo = 5;
        const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000); // คำนวณเวลาปัจจุบัน - 5 นาที

        // Query เพื่อดึงข้อมูลที่อัปเดตล่าสุดภายใน 5 นาที
        const [loRaLogData] = await pool.query(
            `SELECT l.Dip_Switch_Value, l.LoRa_Battery, l.LoRa_Temp, l.LoRa_Latitude, l.LoRa_Longitude, l.LoRa_SNR, l.LoRa_RSSI, l.Update_Time
             FROM LoRaLog l
             INNER JOIN (
                 SELECT Dip_Switch_Value, MAX(Update_Time) as LatestTime
                 FROM LoRaLog
                 GROUP BY Dip_Switch_Value
             ) latest
             ON l.Dip_Switch_Value = latest.Dip_Switch_Value AND l.Update_Time = latest.LatestTime
             WHERE l.Update_Time >= ?
             ORDER BY l.Dip_Switch_Value`,
            [cutoffTime]
        ) as RowDataPacket[];

        // ตรวจสอบว่ามีข้อมูลหรือไม่
        if (!Array.isArray(loRaLogData) || loRaLogData.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No recent LoRaLog data found',
            });
        }

        // ตอบกลับข้อมูลที่อัปเดตภายในช่วง 5 นาทีล่าสุด
        res.status(200).json({
            success: true,
            data: loRaLogData
        });
    } catch (error) {
        console.error("Error fetching recent LoRaLog data:", error);
        next(error);
    }
});

export default router;
