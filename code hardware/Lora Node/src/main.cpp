#include <Arduino.h>
#include <SPI.h>
#include <LoRa.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <Adafruit_INA219.h>
#include <DHT.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

// Define pins
#define SS 5
#define RST 4
#define DI0 34
#define DHTPIN 15   // Pin connected to DHT11 data pin
#define DHTTYPE DHT11
#define DIP1 14
#define DIP2 27
#define DIP3 12
#define DIP4 13

// Create objects
TinyGPSPlus gps;
HardwareSerial serialGPS(2);
Adafruit_INA219 ina219;
DHT dht(DHTPIN, DHTTYPE);

// Define a struct to hold sensor data
struct SensorData {
  float latitude = 0.0;
  float longitude = 0.0;
  float temperature = 0.0;
  float battery_voltage = 0.0;
  int dipSwitchState = 0;
};

// Shared SensorData instance
SensorData sensorData;

// Task handle
TaskHandle_t checkBroadcastTaskHandle;
TaskHandle_t readSensorsTaskHandle;

// ฟังก์ชันสำหรับการส่งข้อมูลไปยัง Gateway
void sendDataToGateway() {
  // สร้างข้อความพร้อมกับข้อมูลเซนเซอร์
  String message = "L" + String(sensorData.latitude, 6) + 
                   "G" + String(sensorData.longitude, 6) + 
                   "T" + String(sensorData.temperature) + 
                   "V" + String(sensorData.battery_voltage) + 
                   "D" + String(sensorData.dipSwitchState);
  
  Serial.print("Sending data to Gateway: ");
  Serial.println(message);

  // ส่งข้อมูลผ่าน LoRa
  LoRa.beginPacket();
  LoRa.print(message);
  LoRa.endPacket();
}

// Task สำหรับการเช็คการ broadcast จาก Gateway
void checkForBroadcastTask(void *parameter) {
  while (true) {
    int packetSize = LoRa.parsePacket();
    if (packetSize) {
      String receivedMessage = "";
      while (LoRa.available()) {
        receivedMessage += (char)LoRa.read();
      }
    
      Serial.print("Received message from Gateway: ");
      Serial.println(receivedMessage);

      // ตรวจสอบว่าเป็นคำสั่ง DIP switch หรือไม่
      if (receivedMessage.startsWith("DIP:")) {
        // ดึงค่า DIP switch ออกมา
        int receivedDipSwitch = receivedMessage.substring(4).toInt();
        Serial.print("Received dip switch: ");
        Serial.println(receivedDipSwitch);

        // ถ้าค่า DIP ตรงกับ DIP ของ Node ให้ส่งข้อมูลกลับไป
        if (receivedDipSwitch == sensorData.dipSwitchState) {
          sendDataToGateway();  // ถ้าตรง ให้ส่งข้อมูลกลับไปยัง Gateway
        }
      }
    }
    vTaskDelay(100 / portTICK_PERIOD_MS);  // Delay เล็กน้อยเพื่อไม่ให้ใช้ CPU มากเกินไป
  }
}

// Task for reading GPS
void readGPSTask(void *parameter) {
  while (true) {
    while (serialGPS.available() > 0) {
      gps.encode(serialGPS.read());
      if (gps.location.isUpdated()) {       
        sensorData.latitude = gps.location.lat();
        sensorData.longitude = gps.location.lng();       
      }
    }
    vTaskDelay(100 / portTICK_PERIOD_MS);  // Delay to avoid using too much CPU
  }
}


// Task สำหรับการอ่านข้อมูลเซนเซอร์
void readSensorsTask(void *parameter) {
  while (true) {
    // อ่านข้อมูลจาก DHT sensor
    sensorData.temperature = dht.readTemperature();
    sensorData.battery_voltage = ina219.getBusVoltage_V();

    vTaskDelay(2000 / portTICK_PERIOD_MS);  // อ่านข้อมูลทุกๆ 2 วินาที
  }
}

void setup() {
  Serial.begin(115200);
  serialGPS.begin(9600, SERIAL_8N1, 16, 17);  // GPS Serial connection (TX, RX)
  
  // กำหนดขา DIP switch เป็น input
  pinMode(DIP1, INPUT_PULLUP);
  pinMode(DIP2, INPUT_PULLUP);
  pinMode(DIP3, INPUT_PULLUP);
  pinMode(DIP4, INPUT_PULLUP);
  
  // Initialize DHT sensor
  dht.begin();

  // Initialize INA219 sensor
  ina219.begin();

  // อ่านค่า DIP Switch
  String dipStateStr = String(!digitalRead(DIP1)) + String(!digitalRead(DIP2)) + String(!digitalRead(DIP3)) + String(!digitalRead(DIP4));
  sensorData.dipSwitchState = strtol(dipStateStr.c_str(), NULL, 2);
  Serial.print("Node DIP Switch Value: ");
  Serial.println(sensorData.dipSwitchState);
  
  // Initialize LoRa
  LoRa.setPins(SS, RST, DI0);
  if (!LoRa.begin(915E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  LoRa.setSpreadingFactor(12);
  LoRa.setTxPower(20);
  Serial.println("LoRa Node initialized in Receiver Mode.");

  // สร้าง task สำหรับการเช็คการ broadcast และการอ่านข้อมูลเซนเซอร์
  xTaskCreate(checkForBroadcastTask, "Check Broadcast", 4096, NULL, 1, &checkBroadcastTaskHandle);
  xTaskCreate(readSensorsTask, "Read Sensors", 4096, NULL, 1, &readSensorsTaskHandle);
  xTaskCreate(readGPSTask, "Read GPS", 4096, NULL, 1, NULL);

}

void loop() {
  // Empty loop, task จะทำงานอยู่ใน background
}
