import http from "http";
import net from "net";
import WebSocket, { WebSocketServer } from "ws";
import "dotenv/config";
import app from "./app";
import pool from "../src/libs/db"; // นำเข้า pool สำหรับการเชื่อมต่อฐานข้อมูล (MySQL)
import { PORT } from "./config";
import { RowDataPacket } from "mysql2";

// Function to parse data string (จาก insertLora.ts)
const parseLoRaData = (data: string) => {
  const dataMap: any = {};
  let currentKey = "";

  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if (char.match(/[A-Z]/)) {
      currentKey = char;
      dataMap[currentKey] = "";
    } else if (currentKey) {
      dataMap[currentKey] += char;
    }
  }
  return dataMap;
};

// Normalize port function
function normalizePort(val: string) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

const port = normalizePort(PORT);
app.set("port", port);

// สร้าง HTTP server และ WebSocket server
export const server = http.createServer(app);

// สร้าง WebSocket server และเชื่อมต่อกับ HTTP server เดียวกัน
const wss = new WebSocketServer({ server, path: "/websocket" });
export let clients: WebSocket[] = [];

export const sendDIPtoGateway = async () => {
  try {
    console.log("Fetching Dip Switch values from database:");

    // ดึงค่า dip switch จากฐานข้อมูล
    const [rows] = (await pool.query(
      "SELECT dip_switch_value FROM LoRa WHERE Status = 1"
    )) as [RowDataPacket[], any];

    // สร้างข้อมูลที่จะส่งกลับไปยัง LoRa Gateway
    const dipSwitchValues = rows.map((row: any) => row.dip_switch_value);
    console.log("Dip Switch values from database:", dipSwitchValues);
    const dataToSend = JSON.stringify({
      type: "dip_switch",
      values: dipSwitchValues,
    });

    clients.forEach((client) => {
      client.send(dataToSend);
    });
    // ส่งค่า dip switch กลับไปยัง LoRa Gateway ผ่าน WebSocket    
    console.log("Sent dip switch values:", dataToSend);
  } catch (error) {
    console.error("Error fetching dip switch values:", error);   
  }
};

wss.on("connection", (ws: WebSocket) => {
  console.log("New WebSocket connection established.");
  clients.push(ws);
  // ส่ง ping ทุกๆ 50 วินาที
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      console.log("Sending ping to WebSocket client.");
      ws.ping(); // ส่งสัญญาณ ping ไปที่ client
    }
  }, 50000); // 50 วินาที

  ws.on("message", async (message: string) => {
    const ReceivMsg = message.toString();
    console.log("Received message from WebSocket:", ReceivMsg);

    // ตรวจสอบว่าข้อความที่ได้รับคือการร้องขอค่า dip switch หรือไม่
    if (ReceivMsg === "request_dip_switch") {
      sendDIPtoGateway();
    } else {
      try {
        const dataJson = JSON.parse(ReceivMsg);

        if (dataJson.type === "node_data") {
          const parsedData = parseLoRaData(dataJson.data);
          // Extract values from parsedData
          let latitude = parsedData["L"] ? parseFloat(parsedData["L"]) : null;
          let longitude = parsedData["G"] ? parseFloat(parsedData["G"]) : null;
          const temperature = parsedData["T"]
            ? parseFloat(parsedData["T"])
            : null;
          const voltage = parsedData["V"] ? parseFloat(parsedData["V"]) : null;
          const dipSwitchState = parsedData["D"]
            ? parseInt(parsedData["D"], 10)
            : null;
          const RSSI = parsedData["R"] ? parseInt(parsedData["R"]) : null;
          const SNR = parsedData["S"] ? parseFloat(parsedData["S"]) : null;

          if (latitude === 0) latitude = null;
          if (longitude === 0) longitude = null;

          // คำนวณเปอร์เซ็นต์แบตเตอรี่
          const calculateBatteryPercentage = (
            voltage: number | null
          ): number | null => {
            if (!voltage) return null;
            const fullyChargedVoltage = 8.2;
            const emptyVoltage = 6.0;
            let percentage = parseFloat(
              (
                ((voltage - emptyVoltage) /
                  (fullyChargedVoltage - emptyVoltage)) *
                100
              ).toFixed(2)
            );
            return Math.max(0, Math.min(percentage, 100));
          };

          let loraRows;
          try {
            [loraRows] = (await pool.query(
              "SELECT * FROM LoRa WHERE Dip_Switch_Value = ?",
              [dipSwitchState]
            )) as RowDataPacket[];
          } catch (dbError) {
            console.error("Database query error:", dbError);
            return;
          }

          if (!Array.isArray(loraRows) || loraRows.length === 0) {
            console.error("Invalid Dip_Switch_Value: LoRa device not found");
            console.log("Dip Switch value being searched: ", dipSwitchState);
            return;
          }

          // Insert data into LoRaLog
          try {
            await pool.query(
              `INSERT INTO LoRaLog (Dip_Switch_Value, LoRa_Battery, LoRa_Temp, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                dipSwitchState,
                calculateBatteryPercentage(voltage),
                temperature,
                latitude,
                longitude,
                SNR,
                RSSI,
              ]
            );
            console.log("Data successfully inserted into LoRaLog.");
          } catch (dbInsertError) {
            console.error("Database insert error:", dbInsertError);
          }
        }

        // ส่ง ack กลับไปที่ Gateway
        ws.send(JSON.stringify({ type: "ack", data: "" }));
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
    clients = clients.filter((client) => client !== ws);
    clearInterval(pingInterval);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// // ฟังก์ชันตรวจสอบการเปลี่ยนแปลงของ status จาก 0 เป็น 1 หรือจาก 1 เป็น 0
// const watchStatusChanges = async () => {
//   let lastStatusValues: { dip_switch_value: number; status: number }[] = [];

//   setInterval(async () => {
//     try {
//       const [rows] = (await pool.query(
//         "SELECT dip_switch_value, Status FROM LoRa"
//       )) as [RowDataPacket[], any];
//       const currentStatusValues = rows.map((row: any) => ({
//         dip_switch_value: row.dip_switch_value,
//         status: row.Status,
//       }));

//       currentStatusValues.forEach((currentValue, index) => {
//         const lastValue = lastStatusValues[index];

//         if (lastValue && lastValue.status === 0 && currentValue.status === 1) {
//           console.log(
//             `Status for Dip Switch ${currentValue.dip_switch_value} changed from 0 to 1`
//           );
//           clients.forEach((client) => {
//             client.send(
//               JSON.stringify({
//                 type: "broadcast_dip_switch",
//                 value: currentValue.dip_switch_value,
//               })
//             );
//           });
//         }

//         if (lastValue && lastValue.status === 1 && currentValue.status === 0) {
//           console.log(
//             `Status for Dip Switch ${currentValue.dip_switch_value} changed from 1 to 0`
//           );
//           clients.forEach((client) => {
//             client.send(
//               JSON.stringify({
//                 type: "stop_broadcast_dip_switch",
//                 value: currentValue.dip_switch_value,
//               })
//             );
//           });
//         }
//       });

//       lastStatusValues = currentStatusValues;
//     } catch (error) {
//       console.error("Error watching status changes:", error);
//     }
//   }, 5000);
// };

// // เริ่มฟังก์ชันตรวจสอบการเปลี่ยนแปลง Status ของ Dip Switch
// watchStatusChanges();

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  console.error(error.message);
  process.exit(1);
});

server.on("listening", () => {
  const addr = server.address();
  const bind =
    typeof addr === "string"
      ? "pipe " + addr
      : "port " + (addr as net.AddressInfo).port;
  console.log(`Server is Listening on ${bind}.`);
});

// Start the server
server.listen(port);
