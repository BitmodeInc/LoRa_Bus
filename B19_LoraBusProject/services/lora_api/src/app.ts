import express, { Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { corsOrigins } from "./libs/cors";
import helmetMiddleware from './libs/helmet'; // เพิ่ม import helmetMiddleware
import logger from './libs/logger'; // นำเข้า logger
import apiRoute from "./routes/api";
import mysql from 'mysql2/promise';
import { config } from './config';
import pool from "./libs/db";

const app = express();

app.set("trust proxy", 1); // trust first proxy

app.disable("x-powered-by");


// Middleware
app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmetMiddleware); // เรียกใช้งาน Helmet middleware
app.use(corsOrigins);

// ====================== Handle route =======================
// Setup Authencation and use api router
app.use("/", apiRoute);
// เส้นทาง (route) สำหรับการทดสอบการเชื่อมต่อ
app.get('/test-connection', async (req, res) => {
  const result = await testConnection();
  console.log(result);
  
  res.send(result);
});

// ฟังก์ชันทดสอบการเชื่อมต่อฐานข้อมูล
async function testConnection(): Promise<string> {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return 'Database connection successful!';
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      return `Error connecting to the database: ${error.message}`;
    } else {
      return 'Unknown error occurred';
    }
  }
}

// ====================== Handle error =======================
// custom 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that");
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


export default app;
