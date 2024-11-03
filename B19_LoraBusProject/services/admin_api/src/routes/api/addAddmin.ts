



// // api นี้ใช้ทดสอบเท่านั้น ไม่มีแผนจะใช้งานจริง







// // serviceUser/src/routes/admin.ts
// import express, { Request, NextFunction } from "express";
// import pool from "../../libs/db"; // ใช้ฐานข้อมูล
// import { typedResponse } from "../../types/express";

// const router = express.Router();

// // Route to get all admin records
// router.get("/", async (req: Request, res: typedResponse, next: NextFunction) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM Admin");
//     res.status(200).json({
//       success: true,
//       data: rows,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // Route to add a new admin
// router.post("/", async (req: Request, res: typedResponse, next: NextFunction) => {
//   const { Username, Password, FirstName, LastName, Email } = req.body;

//   if (!Username || !Password || !FirstName || !LastName || !Email) {
//     return res.status(400).json({ success: false, msg: "All fields are required" });
//   }

//   try {
//     const CreateAt = Math.floor(Date.now() / 1000); // ใช้ timestamp ปัจจุบัน
//     const UpdateAt = CreateAt;

//     // Assuming the password is already hashed before inserting
//     const [result] = await pool.query(
//       `INSERT INTO Admin (Username, Password, FirstName, LastName, Email, CreateAt, UpdateAt) 
//       VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [Username, Password, FirstName, LastName, Email, CreateAt, UpdateAt]
//     );

//     res.status(201).json({
//       success: true,
//       msg: "Admin added successfully",
//       data: result
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// export default router;
