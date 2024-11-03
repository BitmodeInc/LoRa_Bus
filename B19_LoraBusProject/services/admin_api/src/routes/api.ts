import express, { Request, NextFunction } from "express";
import { typedResponse } from "../types/express";
import loginRouter from './api/login';
// import adminRouter from "./api/addAddmin"; // นำเข้า adminRouter
import addBusRouter from "./api/addBus"; // นำเข้า addBusRouter
import addBusstopRouter from "./api/addBusStop"; // นำเข้า addBusstopRouter
import addLoRa_deviceRouter from './api/addLoRa_device'
import editBusRouter from './api/editBus'
import editBusStopRouter from './api/editBusStop'
import editLoRa_deviceRouter from './api/editLoRa_device'
import deleteBusStopRouter from "./api/deleteBusStop"; // นำเข้า deleteBusStopRouter
import deleteLoRa_deviceRouter from './api/deleteLoRa_device'
import deleteBusRouter from './api/deleteBus'
import requestResetRouter from "./api/requestReset"
import resetPasswordRouter from "./api/resetpassword"
import getLoRa_device from "./api/getLoRa_device"
import getLoRaLog from "./api/getLoRaLog"
import getBusRouter from "./api/getBus"
import getLoRa5Minbattery from "./api/getLoRa5Minbattery"
import getLoginLogRouter from "./api/getLoginlog"
import getEditLogRouter from "./api/geteditLog"
import getSearchLogRouter from "./api/getSearchLog"
import NotificationRouter from "./api/notification"
import getLastLoRaLog from "./api/getLastLoRaLog"
const router = express.Router();

router.get(
  "/",
  async (req: Request, res: typedResponse, next: NextFunction) => {
    return res.status(200).json({
      success: true,
      msg: "admin service",
    });
  }
);
router.use("/notification",NotificationRouter)

// เพิ่มการเชื่อมต่อเส้นทาง ยังไม่เสร็จ
router.use('/login', loginRouter);  

// เส้นทางสำหรับข้อมูล Admin
// router.use("/admin", adminRouter);

// เส้นทางสำหรับเพิ่มข้อมูลรถ
router.use("/addbus", addBusRouter);

router.use("/getBus", getBusRouter);

router.use("/requestreset",requestResetRouter);

router.use("/resetPassword",resetPasswordRouter);
// เส้นทางสำหรับแก้ไขข้อมูลรถ
router.use("/editBus", editBusRouter)

// เส้นทางสำหรับลบข้อมูลรถ
router.use("/deleteBus", deleteBusRouter)

// เส้นทางสำหรับเพิ่มข้อมูลป้ายรอรถ
router.use("/addbusstop", addBusstopRouter);

// เส้นทางสำหรับแก้ไขข้อมูลป้ายรอรถ
router.use("/editBusStop", editBusStopRouter);

// เส้นทางสำหรับลบข้อมูลป้ายรอรถ
router.use("/deleteBusStop", deleteBusStopRouter);

// เส้นทางสำหรับเพิ่มข้อมูลอุปกรณ์ LoRa
router.use("/addLoRa", addLoRa_deviceRouter)

// เส้นทางสำหรับแก้ไขข้อมูลอุปกรณ์ LoRa
router.use("/editLoRa", editLoRa_deviceRouter)

// เส้นทางสำหรับลบข้อมูลอุปกรณ์ LoRa
router.use("/deleteLoRa", deleteLoRa_deviceRouter)

// เส้นทางสำหรับลบข้อมูลอุปกรณ์ LoRa
router.use("/getLoRa", getLoRa_device)

router.use("/getLoRaLog", getLoRaLog)

router.use("/getLoRabattery", getLoRa5Minbattery)

router.use("/getLoginLog", getLoginLogRouter)

router.use("/getEditLog", getEditLogRouter)

router.use("/getSearchLog",getSearchLogRouter)

router.use("/getLoRaLast", getLastLoRaLog)

export default router;
