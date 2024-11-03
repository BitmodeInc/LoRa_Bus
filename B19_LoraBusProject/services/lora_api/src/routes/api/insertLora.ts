import express, { Request, Response, NextFunction } from 'express';
import pool from '../../libs/db'; // MySQL connection pool
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// POST API to average data from LoRaLog and insert it into LoRa5MinLog
router.post('/5min', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // กำหนดช่วงเวลา (5 นาที)
        const minutesAgo = 5;
        const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000);

        // Query เพื่อตรวจสอบว่าข้อมูลล่าสุดใน LoRa5MinLog มีการบันทึกหรือไม่
        const [lastLog]: any = await pool.query(
            `SELECT MAX(Update_Time) as LastUpdateTime FROM LoRa5MinLog`
        ) as RowDataPacket[];

        const lastUpdateTime = lastLog[0]?.LastUpdateTime;

        // Query เพื่อดึงข้อมูลจาก LoRaLog ที่อัปเดตหลังจาก LastUpdateTime และยังไม่มีการเฉลี่ยในช่วง 5 นาทีที่ผ่านมา
        const [loRaLogData]: any = await pool.query(
            `SELECT Dip_Switch_Value, AVG(LoRa_Battery) as AvgBattery, AVG(LoRa_Temp) as AvgTemp, AVG(LoRa_Latitude) as AvgLat, AVG(LoRa_Longitude) as AvgLng, AVG(LoRa_SNR) as AvgSNR, AVG(LoRa_RSSI) as AvgRSSI
             FROM LoRaLog
             WHERE Update_Time > ? AND Update_Time >= ?
             GROUP BY Dip_Switch_Value`,
            [lastUpdateTime || cutoffTime, cutoffTime]
        ) as RowDataPacket[];

        // ตรวจสอบว่ามีข้อมูลที่ต้องเฉลี่ยหรือไม่
        if (!Array.isArray(loRaLogData) || loRaLogData.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No new data found to average',
            });
        }

        // บันทึกข้อมูลเฉลี่ยลงใน LoRa5MinLog
        for (const data of loRaLogData) {
            await pool.query(
                `INSERT INTO LoRa5MinLog (Dip_Switch_Value, LoRa_Battery, LoRa_Temp, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI, Update_Time)
                 VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                [data.Dip_Switch_Value, data.AvgBattery, data.AvgTemp, data.AvgLat, data.AvgLng, data.AvgSNR, data.AvgRSSI]
            );
        }

        // ส่งกลับผลลัพธ์ว่าการเฉลี่ยสำเร็จแล้ว
        res.status(201).json({
            success: true,
            msg: 'Averaged data successfully inserted into LoRa5MinLog',
        });
    } catch (error) {
        console.error('Error during averaging and inserting into LoRa5MinLog:', error);
        next(error);
    }
});


// POST API to average data from LoRaLog and insert it into LoRa1HourLog
router.post('/1Hour', async (req: Request, res: Response, next: NextFunction) => {
  try {
      // กำหนดช่วงเวลา (1 ชั่วโมง)
      const hoursAgo = 1;
      const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

      // Query เพื่อตรวจสอบว่าข้อมูลล่าสุดใน LoRa1HourLog มีการบันทึกหรือไม่
      const [lastLog]: any = await pool.query(
          `SELECT MAX(Update_Time) as LastUpdateTime FROM LoRa1HourLog`
      ) as RowDataPacket[];

      const lastUpdateTime = lastLog[0]?.LastUpdateTime;

      // Query เพื่อดึงข้อมูลจาก LoRaLog ที่อัปเดตหลังจาก LastUpdateTime และยังไม่มีการเฉลี่ยในช่วง 1 ชั่วโมงที่ผ่านมา
      const [loRaLogData]: any = await pool.query(
          `SELECT Dip_Switch_Value, AVG(LoRa_Battery) as AvgBattery, AVG(LoRa_Temp) as AvgTemp, AVG(LoRa_Latitude) as AvgLat, AVG(LoRa_Longitude) as AvgLng, AVG(LoRa_SNR) as AvgSNR, AVG(LoRa_RSSI) as AvgRSSI
           FROM LoRaLog
           WHERE Update_Time > ? AND Update_Time >= ?
           GROUP BY Dip_Switch_Value`,
          [lastUpdateTime || cutoffTime, cutoffTime]
      ) as RowDataPacket[];

      // ตรวจสอบว่ามีข้อมูลที่ต้องเฉลี่ยหรือไม่
      if (!Array.isArray(loRaLogData) || loRaLogData.length === 0) {
          return res.status(404).json({
              success: false,
              msg: 'No new data found to average',
          });
      }

      // บันทึกข้อมูลเฉลี่ยลงใน LoRa1HourLog
      for (const data of loRaLogData) {
          await pool.query(
              `INSERT INTO LoRa1HourLog (Dip_Switch_Value, LoRa_Battery, LoRa_Temp, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI, Update_Time)
               VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
              [data.Dip_Switch_Value, data.AvgBattery, data.AvgTemp, data.AvgLat, data.AvgLng, data.AvgSNR, data.AvgRSSI]
          );
      }

      // ส่งกลับผลลัพธ์ว่าการเฉลี่ยสำเร็จแล้ว
      res.status(201).json({
          success: true,
          msg: 'Averaged data successfully inserted into LoRa1HourLog',
      });
  } catch (error) {
      console.error('Error during averaging and inserting into LoRa1HourLog:', error);
      next(error);
  }
});

export default router;
