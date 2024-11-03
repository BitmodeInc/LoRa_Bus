import express, { Request, Response, NextFunction } from 'express';
import pool from '../../libs/db';
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// Helper function to format the last update time in epoch time
const formatEpochTime = (timestamp: string): string => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const updateTime = Math.floor(new Date(timestamp).getTime() / 1000); // Last update time in seconds
    const timeDiff = now - updateTime; // Difference in seconds

    if (timeDiff < 5) {
        return 'เมื่อสักครู่';
    } else if (timeDiff < 60) {
        return `เมื่อ ${timeDiff} วินาทีที่แล้ว`;
    } else if (timeDiff < 3600) {
        const minutes = Math.floor(timeDiff / 60);
        return `เมื่อ ${minutes} นาทีที่แล้ว`;
    } else {
        const hours = Math.floor(timeDiff / 3600);
        return `เมื่อ ${hours} ชั่วโมงที่แล้ว`;
    }
};

// GET API to fetch LoRa Last_Update
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Query to get data from LoRa table including Last_Update
        const [loRaData] = await pool.query('SELECT * FROM LoRa') as RowDataPacket[];

        // Check if data is found
        if (!Array.isArray(loRaData) || loRaData.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'ไม่พบข้อมูล LoRa',
            });
        }

        // Format the last update time for each LoRa device
        const formattedData = loRaData.map((device) => ({
            Dip_Switch_Value: device.Dip_Switch_Value,
            Transmission_Interval: device.Transmission_Interval,
            Status: device.Status,
            Bus_ID: device.Bus_ID,
            Last_Update: formatEpochTime(device.Last_Update),
        }));

        // Respond with the formatted LoRa data
        res.status(200).json({
            success: true,
            data: formattedData
        });
    } catch (error) {
        console.error("Error fetching LoRa Last_Update:", error);
        next(error);
    }
});

export default router;
