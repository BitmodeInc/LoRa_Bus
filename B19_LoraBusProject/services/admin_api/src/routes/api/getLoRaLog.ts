import express, { Request, Response, NextFunction } from 'express';
import pool from '../../libs/db'; // MySQL connection pool
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// GET API to fetch the latest 300 entries for each Dip_Switch_Value
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Query to get the latest 300 data entries for each Dip_Switch_Value from LoRaLog table
        const [loRaLogData] = await pool.query(
            `SELECT Dip_Switch_Value, LoRa_Battery, LoRa_Temp, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI, Update_Time
             FROM (
                 SELECT *,
                        ROW_NUMBER() OVER (PARTITION BY Dip_Switch_Value ORDER BY Update_Time DESC) AS rn
                 FROM LoRaLog
             ) ranked
             WHERE ranked.rn <= 300
             ORDER BY Dip_Switch_Value, Update_Time DESC`
        ) as RowDataPacket[];

        // Check if data is found
        if (!Array.isArray(loRaLogData) || loRaLogData.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No LoRaLog data found',
            });
        }

        // Respond with the latest 300 entries for each Dip_Switch_Value
        res.status(200).json({
            success: true,
            data: loRaLogData
        });
    } catch (error) {
        console.error("Error fetching latest LoRaLog data:", error);
        next(error);
    }
});

export default router;
