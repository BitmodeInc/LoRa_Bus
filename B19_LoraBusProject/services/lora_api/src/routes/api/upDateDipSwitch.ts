import express from "express";
import { clients, sendDIPtoGateway } from "../../server"; // การเชื่อมต่อ WebSocket clients
// import { RowDataPacket } from "mysql2";
// import pool from "../../libs/db"; // การเชื่อมต่อกับฐานข้อมูล

const router = express.Router();

// API สำหรับดึงค่า dip switch
router.get("/", async (req, res) => {
  sendDIPtoGateway();
  return res.status(200).json({
    success: true
  })
});

export default router;
