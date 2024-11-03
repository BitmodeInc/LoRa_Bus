import express, { Request, Response, NextFunction } from 'express';
import pool from '../../libs/db'; // MySQL connection pool
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// GET API to fetch LoRa5MinLog battery data
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Query to get battery data from LoRa5MinLog table
        const [batteryData] = await pool.query(
            'SELECT LoRa_Battery, Update_Time FROM LoRa5MinLog ORDER BY Update_Time DESC'
        ) as RowDataPacket[];

        // Check if data is found
        if (!Array.isArray(batteryData) || batteryData.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No LoRa5MinLog battery data found',
            });
        }

        // Respond with the LoRa5MinLog battery data
        res.status(200).json({
            success: true,
            data: batteryData
        });
    } catch (error) {
        console.error("Error fetching LoRa5MinLog battery data:", error);
        next(error);
    }
});

export default router;
