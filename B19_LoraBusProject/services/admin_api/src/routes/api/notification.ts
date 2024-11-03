import express, { Request, Response, NextFunction } from 'express';
import pool from '../../libs/db'; // MySQL connection pool
import { RowDataPacket,ResultSetHeader } from 'mysql2';

const router = express.Router();

// POST API to generate notifications based on LoRaLog data
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lowBatteryThreshold = 20; // Battery percentage below 20%
        const highTempThreshold = 50;   // Temperature above 50°C
        const updateTimeout = 5;        // Timeout period for no updates (in minutes)

        // Query to fetch the latest 300 LoRaLog entries that meet certain conditions
        const [loRaLogIssues] = await pool.query(
            `SELECT Dip_Switch_Value, LoRa_Battery, LoRa_Temp, Update_Time, 
                    TIMESTAMPDIFF(MINUTE, Update_Time, NOW()) AS MinutesSinceUpdate
             FROM LoRaLog
             WHERE LoRa_Battery < ? OR LoRa_Temp > ? OR TIMESTAMPDIFF(MINUTE, Update_Time, NOW()) > ?
             ORDER BY Log_ID DESC
             LIMIT 10`, 
            [lowBatteryThreshold, highTempThreshold, updateTimeout]
        ) as RowDataPacket[]; // Explicitly cast to RowDataPacket[]

        if (!Array.isArray(loRaLogIssues) || loRaLogIssues.length === 0) {
            return res.status(200).json({
                success: true,
                msg: 'No issues found based on the current LoRaLog data',
            });
        }

        // Insert notifications for each issue found
        for (const issue of loRaLogIssues) {
            // Check for low battery issue
            if (issue.LoRa_Battery < lowBatteryThreshold) {
                const issueType = 'Low Battery';
                const issueDescription = `Battery below ${lowBatteryThreshold}%`;

                await pool.query(
                    `INSERT INTO Notifications (Dip_Switch_Value, Issue_Type, Issue_Description, Resolved, Is_Current)
                     VALUES (?, ?, ?, false, true)`,
                    [issue.Dip_Switch_Value, issueType, issueDescription]
                );
            }

            // Check for high temperature issue
            if (issue.LoRa_Temp > highTempThreshold) {
                const issueType = 'High Temperature';
                const issueDescription = `Temperature above ${highTempThreshold}°C`;

                await pool.query(
                    `INSERT INTO Notifications (Dip_Switch_Value, Issue_Type, Issue_Description, Resolved, Is_Current)
                     VALUES (?, ?, ?, false, true)`,
                    [issue.Dip_Switch_Value, issueType, issueDescription]
                );
            }

            // Check for no updates in the last 5 minutes
            if (issue.MinutesSinceUpdate > updateTimeout) {
                const issueType = 'No Update';
                const issueDescription = `No data updates in the last ${updateTimeout} minutes`;

                await pool.query(
                    `INSERT INTO Notifications (Dip_Switch_Value, Issue_Type, Issue_Description, Resolved, Is_Current)
                     VALUES (?, ?, ?, false, true)`,
                    [issue.Dip_Switch_Value, issueType, issueDescription]
                );
            }
        }

        res.status(201).json({
            success: true,
            msg: 'Notifications created based on current issues',
        });
    } catch (error) {
        console.error("Error creating notifications:", error);
        next(error);
    }
});

// router.get('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // Query to fetch unique Dip Switch, Issue Type, Event Time, and Notifications_ID combinations
//         const [notifications] = await pool.query(
//             `SELECT Notifications_ID, Dip_Switch_Value, Issue_Type, Event_Time
//              FROM Notifications
//              WHERE (Dip_Switch_Value, Issue_Type) IN (
//                  SELECT Dip_Switch_Value, Issue_Type
//                  FROM Notifications
//                  GROUP BY Dip_Switch_Value, Issue_Type
//              )
//              ORDER BY Dip_Switch_Value, Issue_Type`
//         ) as RowDataPacket[];

//         if (!Array.isArray(notifications) || notifications.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 msg: 'No notifications found',
//                 data: [],
//             });
//         }

//         res.status(200).json({
//             success: true,
//             msg: 'Notifications retrieved successfully',
//             data: notifications,
//         });
//     } catch (error) {
//         console.error("Error retrieving notifications:", error);
//         next(error);
//     }
// });

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Query เพื่อรวมค่า Dip_Switch_Value และ Issue_Type ที่เหมือนกันและดึงเวลาล่าสุดมาด้วย
        const [notifications] = await pool.query(
            `SELECT Dip_Switch_Value, Issue_Type, MAX(Event_Time) AS Latest_Event_Time
             FROM Notifications
             GROUP BY Dip_Switch_Value, Issue_Type
             ORDER BY Dip_Switch_Value, Issue_Type`
        ) as RowDataPacket[];

        if (!Array.isArray(notifications) || notifications.length === 0) {
            return res.status(200).json({
                success: true,
                msg: 'No notifications found',
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Notifications retrieved successfully',
            data: notifications,
        });
    } catch (error) {
        console.error("Error retrieving notifications:", error);
        next(error);
    }
});

// router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const notificationId = req.params.id;

//         // Query to delete the notification with the specified Notifications_ID
//         const [result] = await pool.query<ResultSetHeader>(
//             `DELETE FROM Notifications WHERE Notifications_ID = ?`,
//             [notificationId]
//         );

//         // ตรวจสอบว่าลบสำเร็จหรือไม่
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false,
//                 msg: 'Notification not found',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             msg: 'Notification deleted successfully',
//         });
//     } catch (error) {
//         console.error("Error deleting notification:", error);
//         next(error);
//     }
// });

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { dipSwitchValue, issueType } = req.body;

        // ตรวจสอบว่ามีการส่ง Dip_Switch_Value และ Issue_Type หรือไม่
        if (!dipSwitchValue || !issueType) {
            return res.status(400).json({
                success: false,
                msg: 'Dip_Switch_Value and Issue_Type are required',
            });
        }

        // Query เพื่อลบ Notifications ที่มีค่า Dip_Switch_Value และ Issue_Type ตรงกัน
        const [result] = await pool.query<ResultSetHeader>(
            `DELETE FROM Notifications 
             WHERE Dip_Switch_Value = ? AND Issue_Type = ?`,
            [dipSwitchValue, issueType]
        );

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No notifications found to delete for the specified Dip_Switch_Value and Issue_Type',
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Notifications deleted successfully',
        });
    } catch (error) {
        console.error("Error deleting notifications:", error);
        next(error);
    }
});

router.delete('/deleteall/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Query to delete all notifications
        const [result] = await pool.query<ResultSetHeader>(
            `DELETE FROM Notifications`
        );

        // ตรวจสอบจำนวนแถวที่ถูกลบ
        const affectedRows = result.affectedRows;

        res.status(200).json({
            success: true,
            msg: `${affectedRows} notification(s) deleted successfully.`,
        });
    } catch (error) {
        console.error("Error deleting all notifications:", error);
        res.status(500).json({
            success: false,
            msg: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        next(error);
    }
});

export default router;
