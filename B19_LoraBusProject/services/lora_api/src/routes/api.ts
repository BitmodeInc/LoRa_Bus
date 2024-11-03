import express, { Request, NextFunction } from "express";
import { typedResponse } from "../types/express";
import insertLora from './api/insertLora';
import Transmission_Interval from './api/Transmission_Interval';
import upDateDip from './api/upDateDipSwitch';
// import updateLocation from './api/updateLocation';

const router = express.Router();

router.get(
  "/",
  async (req: Request, res: typedResponse, next: NextFunction) => {
    return res.status(200).json({
      success: true,
      msg: "lora service",
    });
  }
);

//api 
router.use('/insertLora', insertLora);
router.use('/Transmission', Transmission_Interval);
router.use('/updateDip', upDateDip);

export default router;
