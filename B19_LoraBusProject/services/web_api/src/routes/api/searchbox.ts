import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../libs/db';
import levenshtein from 'fast-levenshtein';

const router = Router();

const SIMILARITY_THRESHOLD = 10; // ปรับค่านี้ตามต้องการ

// Function สำหรับหา IP ของผู้ใช้งาน

router.get('/bus', async (req: Request, res: Response, next: NextFunction) => {
  const { bus_name } = req.query;

  if (!bus_name || typeof bus_name !== 'string') {
    return res.status(400).json({ success: false, msg: "bus_name is required and must be a string" });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM Bus');
    const buses = rows as { Bus_Name: string; Bus_Line: string; Dip_Switch_Value: string }[];

    // กรองและหาค่าที่ใกล้เคียงที่สุด
    const startsWithMatches = buses.filter(bus => bus.Bus_Name.startsWith(bus_name));
    
    // ถ้ามีผลลัพธ์ที่เริ่มต้นด้วย bus_name
    if (startsWithMatches.length > 0) {
      const bestMatches = startsWithMatches.slice(0, 3); // แสดง 3 ตัวแรก
      return res.status(200).json({
        success: true,
        data: bestMatches
      });
    }

    // ใช้ Levenshtein distance สำหรับผลลัพธ์ที่เหลือ
    const fuzzyMatches = buses.map(bus => ({
      ...bus,
      distance: levenshtein.get(bus.Bus_Name, bus_name)
    }))
      .filter(bus => bus.distance <= SIMILARITY_THRESHOLD)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3); // แสดง 3 ตัวแรก

    // ถ้ามีผลลัพธ์ที่ใกล้เคียง
    if (fuzzyMatches.length > 0) {
      return res.status(200).json({
        success: true,
        data: fuzzyMatches
      });
    }

    // ถ้าไม่พบคำที่ค้นหา
    res.status(404).json({
      success: false,
      msg: "No bus found matching the search term"
    });
  } catch (error) {
    next(error);
  }
});

router.get('/busstop', async (req: Request, res: Response, next: NextFunction) => {
  const { busstop_name } = req.query;

  if (!busstop_name || typeof busstop_name !== 'string') {
    return res.status(400).json({ success: false, msg: "busstop_name is required and must be a string" });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM BusStop');
    const busStops = rows as { BusStop_Name: string; BusStop_Latitude: number; BusStop_Longitude: number; Search_Details: string }[];

    // กรองและหาค่าที่ใกล้เคียงที่สุดจาก BusStop_Name หรือ Search_Details
    const startsWithMatches = busStops.filter(busStop => {
      const searchDetailsArray = busStop.Search_Details.split(',').map(detail => detail.trim());
      return (
        busStop.BusStop_Name.startsWith(busstop_name) ||
        searchDetailsArray.some(detail => detail.startsWith(busstop_name))
      );
    });

    // ถ้ามีผลลัพธ์ที่เริ่มต้นด้วย busstop_name หรือ Search_Details
    if (startsWithMatches.length > 0) {
      const bestMatches = startsWithMatches.slice(0, 3); // แสดง 3 ตัวแรก
      return res.status(200).json({
        success: true,
        data: bestMatches
      });
    }

    // ใช้ Levenshtein distance สำหรับผลลัพธ์ที่เหลือจาก BusStop_Name หรือ Search_Details
    const fuzzyMatches = busStops
      .map(busStop => {
        const searchDetailsArray = busStop.Search_Details.split(',').map(detail => detail.trim());
        const distances = [
          levenshtein.get(busStop.BusStop_Name, busstop_name),
          ...searchDetailsArray.map(detail => levenshtein.get(detail, busstop_name))
        ];

        return {
          ...busStop,
          distance: Math.min(...distances)
        };
      })
      .filter(busStop => busStop.distance <= SIMILARITY_THRESHOLD)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3); // แสดง 3 ตัวแรก

    // ถ้ามีผลลัพธ์ที่ใกล้เคียง
    if (fuzzyMatches.length > 0) {
      return res.status(200).json({
        success: true,
        data: fuzzyMatches
      });
    }

    // ถ้าไม่พบคำที่ค้นหา
    res.status(404).json({
      success: false,
      msg: "No bus stop found matching the search term"
    });
  } catch (error) {
    next(error);
  }
});

export default router;
