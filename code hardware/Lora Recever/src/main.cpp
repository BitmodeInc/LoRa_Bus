#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <LoRa.h>

// กำหนดข้อมูล Wi-Fi
const char *ssid = "POCO F3";
const char *password = "600105419";

// WebSocket settings
const char *webSocketServer = "service.lora-bus.com";
const uint16_t webSocketPort = 443;
const char *webSocketPath = "/lora_api/websocket";

// LoRa settings
#define SS 5
#define RST 4
#define DI0 34
#define BAND 915E6

// WebSocket client object
WebSocketsClient webSocket;
unsigned long previousReconnectAttempt = 0;
const long reconnectInterval = 5000; // พยายามเชื่อมต่อใหม่ทุก 5 วินาที


String dipValue = "";

// ฟังก์ชันสำหรับส่งข้อมูลจาก Node ไปยัง WebSocket Server
void sendDataToWebSocket(String nodeData)
{
	if (webSocket.isConnected())
	{
		StaticJsonDocument<256> doc;
		doc["type"] = "node_data";
		doc["data"] = nodeData;

		String jsonData;
		serializeJson(doc, jsonData);

		webSocket.sendTXT(jsonData);
		Serial.print("Sent data to WebSocket Server: ");
		Serial.println(jsonData);
	}
	else
	{
		Serial.println("WebSocket is not connected.");
	}
}

// ฟังก์ชันสำหรับรับข้อมูลจาก Node
void receiveDataFromNode() {
    unsigned long startTime = millis();
    while (millis() - startTime < 5000) { // รอประมาณ 5 วินาที
        int packetSize = LoRa.parsePacket();
        if (packetSize) {
            String received = "";
            while (LoRa.available()) {
                received += (char)LoRa.read();
            }
            
            // ดึงค่า SNR และ RSSI หลังจากรับข้อมูลจาก LoRa Node
            char rssiInfo[64];
            snprintf(rssiInfo, sizeof(rssiInfo), " R%d:S%.2f", LoRa.packetRssi(), LoRa.packetSnr());

            // รวมค่า SNR และ RSSI เข้ากับข้อความหลัก
            received += rssiInfo;

            Serial.print("Received from Node: ");
            Serial.println(received);

            // ส่งข้อมูลไปยัง WebSocket Server พร้อมค่า RSSI และ SNR
            sendDataToWebSocket(received);
            return;
        }
    }
    Serial.println("No response from Node.");
}



// ฟังก์ชันเพื่อ broadcast ค่า Dip Switch ไปยัง LoRa Node
void broadcastDipSwitchValues()
{
	StaticJsonDocument<256> doc;
	DeserializationError error = deserializeJson(doc, dipValue);
	if (error)
	{
		Serial.print(F("deserializeJson() failed: "));
		Serial.println(error.f_str());
		return;
	}

	JsonArray jsonArray = doc.as<JsonArray>();;
	int size = jsonArray.size();

	if (size > 0)
	{
		for (size_t i = 0; i < size; i++)
		{
			int dipSwitchValue = jsonArray[i].as<int>();
			String message = "DIP:" + String(dipSwitchValue);

			// ส่งข้อความผ่าน LoRa
			LoRa.beginPacket();
			LoRa.print(message);
			LoRa.endPacket();

			// แสดงผลการ Broadcast ใน Serial Monitor
			Serial.print("Broadcasting DIP Switch Value: ");
			Serial.println(message);

			// รอการตอบกลับจาก Node ก่อนทำการ broadcast ค่าใหม่
			receiveDataFromNode(); // ฟังก์ชันที่รอรับข้อมูลจาก Node
			Serial.println("receiveDataFromNode success");
			delay(100);

		}
	}
}

// ฟังก์ชันเมื่อได้รับข้อความจาก WebSocket
void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{
	switch (type)
	{
	case WStype_DISCONNECTED:
		Serial.println("Disconnected from WebSocket");
		break;
	case WStype_CONNECTED:
		Serial.println("Connected to WebSocket");
		webSocket.sendTXT("request_dip_switch"); // ส่งคำขอรับค่า Dip Switch จาก server
		break;
	case WStype_TEXT:
	{
		StaticJsonDocument<256> doc;
		DeserializationError error = deserializeJson(doc, payload);
		if (error)
		{
			Serial.print(F("deserializeJson() failed: "));
			Serial.println(error.f_str());
			return;
		}

		// ดึงข้อมูลจาก JSON object
		const char *type = doc["type"];
		JsonArray data_payload = doc["values"];

		if (strcmp(type, "dip_switch") == 0)
		{
			serializeJson(data_payload, dipValue);
		}
		break;
	}
	case WStype_BIN:
		Serial.println("Received binary data");
		break;
	}
}

void connectWiFi()
{
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("Reconnecting to WiFi...");
        WiFi.begin(ssid, password);
        while (WiFi.status() != WL_CONNECTED)
        {
            delay(1000);
            Serial.println("Connecting to WiFi...");
        }
        Serial.println("Connected to WiFi");
    }
}

// ฟังก์ชันการเชื่อมต่อ WebSocket
void connectWebSocket()
{
    if (!webSocket.isConnected())
    {
        unsigned long currentMillis = millis();
        if (currentMillis - previousReconnectAttempt >= reconnectInterval)
        {
            Serial.println("Attempting to reconnect WebSocket...");
            webSocket.beginSSL(webSocketServer, webSocketPort, webSocketPath); // พยายามเชื่อมต่อใหม่
            previousReconnectAttempt = currentMillis;
        }
    }
}

void setup()
{
	Serial.begin(115200);
	
    // เชื่อมต่อ WiFi โดยใช้ฟังก์ชัน connectWiFi()
    connectWiFi();

	// ตั้งค่า WebSocket
	webSocket.onEvent(webSocketEvent);
	webSocket.beginSSL(webSocketServer, webSocketPort, webSocketPath);

	// ตั้งค่า LoRa
	LoRa.setPins(SS, RST, DI0);
	if (!LoRa.begin(BAND))
	{ // เริ่มการทำงานของ LoRa
		Serial.println("Starting LoRa failed!");
		while (1)
		{
		};
	}
	LoRa.setSpreadingFactor(12); // ปรับค่า spreading factor
	Serial.println("LoRa Initialised.");
}

void loop()
{
	webSocket.loop();
	broadcastDipSwitchValues();
	connectWebSocket(); // ตรวจสอบและพยายาม reconnect หากไม่เชื่อมต่อ
	connectWiFi();      // ตรวจสอบและ reconnect WiFi หากหลุด
}
