// import WebSocket, { WebSocketServer } from 'ws';
// import http from 'http';
// import pool from '../src/libs/db'; // นำเข้า pool สำหรับการเชื่อมต่อฐานข้อมูล (MySQL)
// import { RowDataPacket } from 'mysql2';

// // Function to parse data string (ย้ายมาจาก insertLora.ts)
// const parseLoRaData = (data: string) => {
//   const dataMap: any = {};
//   let currentKey = '';

//   for (let i = 0; i < data.length; i++) {
//     const char = data[i];
//     if (char.match(/[A-Z]/)) {
//       currentKey = char;
//       dataMap[currentKey] = '';
//     } else if (currentKey) {
//       dataMap[currentKey] += char;
//     }
//   }
//   return dataMap;
// };

// // สร้าง WebSocket server
// export const server = http.createServer();
// const wss = new WebSocketServer({ server, path: "/websocket" });
// export let clients: WebSocket[] = [];


// wss.on('connection', (ws: WebSocket) => {
//   console.log('New WebSocket connection established.');
//   clients.push(ws);

//   ws.on('message', async (message: string) => {
//     console.log('Received message from WebSocket:', message.toString());

//     // Logic for parsing and processing LoRa data (จาก insertLora.ts)
//     try {
//       const parsedData = parseLoRaData(message.toString());

//       // Extract values from parsedData
//       let latitude = parsedData['L'] ? parseFloat(parsedData['L']) : null;
//       let longitude = parsedData['G'] ? parseFloat(parsedData['G']) : null;
//       const temperature = parsedData['T'] ? parseFloat(parsedData['T']) : null;
//       const voltage = parsedData['V'] ? parseFloat(parsedData['V']) : null;
//       const dipSwitchState = parsedData['D'] ? parseInt(parsedData['D'], 10) : null;
//       const RSSI = parsedData['R'] ? parseInt(parsedData['R']) : null;
//       const SNR = parsedData['S'] ? parseFloat(parsedData['S']) : null;

//       // ตรวจสอบค่า latitude และ longitude
//       if (latitude === 0) latitude = null;
//       if (longitude === 0) longitude = null;

//       // Function to calculate battery percentage
//       const calculateBatteryPercentage = (voltage: number | null): number | null => {
//         if (!voltage) return null;
//         const fullyChargedVoltage = 8.2; // Full charge voltage for 2 cells
//         const emptyVoltage = 6.0; // Minimum voltage before discharging completely
//         // คำนวณเปอร์เซ็นต์แบตเตอรี่ (จำกัดเป็นทศนิยม 2 หลัก)
//       let percentage = parseFloat((((voltage - emptyVoltage) / (fullyChargedVoltage - emptyVoltage)) * 100).toFixed(2));
//         return Math.max(0, Math.min(percentage, 100));         
//       };
      

//       // ตรวจสอบว่ามี Dip_Switch_Value ในฐานข้อมูล
//       let loraRows;
//       try {
//         [loraRows] = await pool.query('SELECT * FROM LoRa WHERE Dip_Switch_Value = ?', [dipSwitchState]) as RowDataPacket[];
//       } catch (dbError) {
//         console.error('Database query error:', dbError);
//         return;
//       }

//       if (!Array.isArray(loraRows) || loraRows.length === 0) {
//         console.error('Invalid Dip_Switch_Value: LoRa device not found');
//         return;
//       }

//       // Insert data into LoRaLog
//       try {
//         await pool.query(
//           `INSERT INTO LoRaLog (Dip_Switch_Value, LoRa_Battery, LoRa_Temp, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI) VALUES (?, ?, ?, ?, ?, ?, ?)`,
//           [dipSwitchState, calculateBatteryPercentage(voltage), temperature, latitude, longitude, SNR, RSSI]
//         );
//         console.log('Data successfully inserted into LoRaLog.');
//       } catch (dbInsertError) {
//         console.error('Database insert error:', dbInsertError);
//       }
//     } catch (error) {
//       console.error('Error processing WebSocket message:', error);
//     }
//   });
  

//   ws.on('close', () => {
//     console.log('WebSocket connection closed.');
//     clients = clients.filter(client => client !== ws);
//   });

//   ws.on('error', (error) => {
//     console.error('WebSocket error:', error);
//   });
// });
