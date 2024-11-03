import dotenv from 'dotenv';

// โหลดค่าตัวแปรจากไฟล์ .env
dotenv.config();

export const config = {
  dbHost: process.env.DB_HOST || 'localhost',         // โฮสต์ฐานข้อมูล
  dbUser: process.env.DB_USER || 'bleximo',            // ชื่อผู้ใช้ฐานข้อมูล
  dbPassword: process.env.DB_PASSWORD || '12369874',   // รหัสผ่านฐานข้อมูล
  dbName: process.env.DB_NAME || 'lorabus',             // ชื่อฐานข้อมูล
  port: process.env.PORT || 3000,                       // พอร์ตที่ใช้สำหรับเซิร์ฟเวอร์
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret', // เพิ่ม secret สำหรับ JWT
};

// server port
export const PORT = process.env.PORT || "3000";

// url สำหรับเชื่อมต่อกับ database service
export const DATABASE_URL = process.env.DATABASE_URL;

// url ที่อนุญาติให้เข้าใช้งาน (ใช้โครงสร้างแบบ json เพื่อเก็บข้อมูล)
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? JSON.parse(process.env.ALLOWED_ORIGINS)
  : [];

  // ====================================== TOKEN ======================================

// อายุของ access token
export const ACCESS_TOKEN_MAX_AGE = process.env.ACCESS_TOKEN_MAX_AGE
? parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10)
: 1000 * 60 * 60 * 1; // 1H

// Secret สำหรับเข้ารหัส token
export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY || "";

// ข้อความใช้เพื่อร่วมในการเข้ารหัส token
export const SECRET_SALT = process.env.SECRET_SALT || "";
