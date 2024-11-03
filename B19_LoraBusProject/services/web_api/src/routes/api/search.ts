import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../libs/db';
import levenshtein from 'fast-levenshtein';

const router = Router();

const SIMILARITY_THRESHOLD = 10; // ปรับค่านี้ตามต้องการ

// Function สำหรับหา IP ของผู้ใช้งาน
const getUserIp = (req: Request) => {
  let ipAddress = req.headers['x-forwarded-for']
    ? (req.headers['x-forwarded-for'] as string).split(',')[0]
    : req.socket.remoteAddress;

  if (ipAddress === '::1') {
    ipAddress = '127.0.0.1';
  }
  return ipAddress || 'unknown';
};

router.get('/bus', async (req: Request, res: Response, next: NextFunction) => {
  const { bus_name } = req.query;

  if (!bus_name || typeof bus_name !== 'string') {
    return res.status(400).json({ success: false, msg: "bus_name is required and must be a string" });
  }

  try {
    const userIP = getUserIp(req); // หาที่อยู่ IP ของผู้ใช้งาน

    const [rows] = await pool.query('SELECT * FROM Bus');
    const buses = rows as { Bus_Name: string; Bus_Line: string; Dip_Switch_Value: string }[];

    // กรองและหาค่าที่ใกล้เคียงที่สุด
    const startsWithMatches = buses.filter(bus => bus.Bus_Name.startsWith(bus_name));
    
    // ถ้ามีผลลัพธ์ที่เริ่มต้นด้วย bus_name
    if (startsWithMatches.length > 0) {
      const bestMatch = startsWithMatches[0]; // แสดงเพียงตัวแรก
      await pool.query(
        'INSERT INTO SearchLog (User_IP_Address, Type, Search_Term) VALUES (?, ?, ?)',
        [userIP, 'Bus Search', bus_name]
      );

      return res.status(200).json({
        success: true,
        data: bestMatch
      });
    }

    // ใช้ Levenshtein distance สำหรับผลลัพธ์ที่เหลือ
    const fuzzyMatches = buses.map(bus => ({
      ...bus,
      distance: levenshtein.get(bus.Bus_Name, bus_name)
    }))
      .filter(bus => bus.distance <= SIMILARITY_THRESHOLD)
      .sort((a, b) => a.distance - b.distance);

    // ถ้ามีผลลัพธ์ที่ใกล้เคียง
    if (fuzzyMatches.length > 0) {
      const bestMatch = fuzzyMatches[0]; // แสดงเพียงตัวแรก
      await pool.query(
        'INSERT INTO SearchLog (User_IP_Address, Type, Search_Term) VALUES (?, ?, ?)',
        [userIP, 'Bus Search', bus_name]
      );

      return res.status(200).json({
        success: true,
        data: bestMatch
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
    const userIP = getUserIp(req); // หาที่อยู่ IP ของผู้ใช้งาน

    const [rows] = await pool.query('SELECT * FROM BusStop');
    const busStops = rows as { BusStop_Name: string; BusStop_Latitude: number; BusStop_Longitude: number; Search_Details: string }[];

    // กรองและหาค่าที่ใกล้เคียงที่สุดจาก BusStop_Name หรือ Search_Details
    const startsWithMatches = busStops.filter(busStop => {
      // แยก Search_Details ด้วย ','
      const searchDetailsArray = busStop.Search_Details.split(',').map(detail => detail.trim());
      return (
        busStop.BusStop_Name.startsWith(busstop_name) ||
        searchDetailsArray.some(detail => detail.startsWith(busstop_name))
      );
    });

    // ถ้ามีผลลัพธ์ที่เริ่มต้นด้วย busstop_name หรือ Search_Details
    if (startsWithMatches.length > 0) {
      const bestMatch = startsWithMatches[0]; // แสดงเพียงตัวแรก
      await pool.query(
        'INSERT INTO SearchLog (User_IP_Address, Type, Search_Term) VALUES (?, ?, ?)',
        [userIP, 'BusStop Search', busstop_name]
      );

      return res.status(200).json({
        success: true,
        data: bestMatch
      });
    }

    // ใช้ Levenshtein distance สำหรับผลลัพธ์ที่เหลือจาก BusStop_Name หรือ Search_Details
    const fuzzyMatches = busStops
      .map(busStop => {
        // แยก Search_Details ด้วย ','
        const searchDetailsArray = busStop.Search_Details.split(',').map(detail => detail.trim());

        // หา Levenshtein distance น้อยที่สุดจากทั้ง BusStop_Name และ searchDetailsArray
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
      .sort((a, b) => a.distance - b.distance);

    // ถ้ามีผลลัพธ์ที่ใกล้เคียง
    if (fuzzyMatches.length > 0) {
      const bestMatch = fuzzyMatches[0]; // แสดงเพียงตัวแรก
      await pool.query(
        'INSERT INTO SearchLog (User_IP_Address, Type, Search_Term) VALUES (?, ?, ?)',
        [userIP, 'BusStop Search', busstop_name]
      );

      return res.status(200).json({
        success: true,
        data: bestMatch
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
