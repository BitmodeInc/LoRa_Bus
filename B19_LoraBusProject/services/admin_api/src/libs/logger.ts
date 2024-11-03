import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// กำหนดตำแหน่งของไฟล์ log
const logFilePath = path.resolve(__dirname, '../hostLog.txt');

// สร้าง stream เพื่อเขียน log ลงในไฟล์
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// กำหนดรูปแบบการบันทึกข้อมูลของ morgan
const format = `[:date[iso]] :method :url :status :res[content-length] - :response-time ms - :remote-addr - :user-agent`;

// ใช้ morgan สำหรับการ logging พร้อมรูปแบบที่กำหนด
const logger = morgan(format, { stream: logStream });

export default logger;
