import express, { Request, NextFunction } from 'express';
import pool from '../../libs/db';
import { typedResponse } from '../../types/express';

const router = express.Router();

router.get('/', async (req: Request, res: typedResponse, next: NextFunction) => {
  try {
    const [rows] = await pool.query('SELECT * FROM BusStop');
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
});

export default router;
