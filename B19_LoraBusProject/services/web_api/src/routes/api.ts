import express, { Request, NextFunction } from "express";
import { typedResponse } from "../types/express";
import getBusStops from './api/getBusStops';
import getBus from './api/getBus';
import searchRouter from './api/search';
import userreportRouter from "./api/userreport"
import searchboxRouter from "./api/searchbox"
const router = express.Router();

router.get(
  "/",
  async (req: Request, res: typedResponse, next: NextFunction) => {
    return res.status(200).json({
      success: true,
      msg: "web service",
    });
  }
);

//api 
router.use('/getBusStop', getBusStops);

router.use('/getBus', getBus);

router.use("/userreport",userreportRouter)

router.use('/search', searchRouter);

router.use("/searchbox",searchboxRouter)
export default router;
