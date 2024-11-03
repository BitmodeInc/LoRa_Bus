-- -- ตาราง Admin
INSERT INTO Admin (Username, Password, FirstName, LastName, Email) VALUES
('HopeCvsx', '$2a$12$V5IWkSj34iC.f7aatcsstOKIxj3CSGTZqTzefqdkeGlotsg6I8Igq', 'Kantapong', 'Chanphotia', 'teenracing0900934208@gmail.com'),
('bleximo', '$2a$12$3CfVrAv1YOM.r6PwugO.Aun6h1GBYncWs3f6VoYD3B3dD4v0s9DlS', 'Supavit', 'Manitsin', 'supavit.manitsin@gmail.com'),
('ainzzlow', '$2a$12$F2weSfWSl20rwLfYRxMUEu7XKpTxqM/.jp3qiJYNs5u2X1/JGAVgu', 'Teerapat', 'Donmon', 'ainzzlow@gmail.com');

-- -- ตาราง Bus
-- INSERT INTO Bus (Bus_Name, Bus_Line, LoRa_ID) VALUES
-- ('Bus 101', 'A1', 1),
-- ('Bus 102', 'B2', 2);

-- ตาราง BusStop
-- INSERT INTO BusStop (BusStop_Name, BusStop_Latitude, BusStop_Longitude, Search_Details) VALUES
-- ('ตึกวิศวกรรม', 14.03581996783106, 100.72599983417055, '{"NearbyLandmark": "Mall", "Routes": ["A1", "B2"]}'),
-- ('หอใน', 14.03244593477846, 100.72289606602845, '{"NearbyLandmark": "Park", "Routes": ["A1"]}'),
-- ('โรงอาหารกลาง', 14.035308842392592, 100.72438569500312, '{"NearbyLandmark": "Mall", "Routes": ["A1", "B2"]}'),
-- ('ประตู 3', 14.03602285077969, 100.73151540844388, '{"NearbyLandmark": "Mall", "Routes": ["A1", "B2"]}'),
-- ('ใกล้ตึก รป', 14.039185147044371, 1100.7303109185175, '{"NearbyLandmark": "Mall", "Routes": ["A1", "B2"]}'),
-- ('จุดจอดรถ', 14.036053380540398, 100.73154336271914, '{"NearbyLandmark": "Mall", "Routes": ["A1", "B2"]}'),
-- ('ตึกสื่อสารมวลชน', 14.039072614263604, 100.72862113431597, '{"NearbyLandmark": "Mall", "Routes": ["A1", "B2"]}')
;

-- -- ตาราง SearchLog
-- INSERT INTO SearchLog (User_IP_Address, Type, Search_Term) VALUES
-- ('192.168.1.1', 'Bus Search', 'Bus 101'),
-- ('192.168.1.2', 'BusStop Search', 'Stop 1');

-- -- ตาราง UserReport
-- INSERT INTO UserReport (Type, Detail) VALUES
-- ('Bus Issue', 'Bus 101 has a technical issue.'),
-- ('LoRa Issue', 'LoRa sensor disconnected.');

-- -- ตาราง LoginLog
-- INSERT INTO LoginLog (Username, Status, IP_Address) VALUES
-- ('admin1', TRUE, '192.168.1.1'),
-- ('admin2', FALSE, '192.168.1.2');

-- -- ตาราง EditLog
-- INSERT INTO EditLog (Admin_ID, ID, Type, Edit_Detail) VALUES
-- (1, 1, 'Bus', 'Changed Bus Name from "Bus 100" to "Bus 101"'),
-- (2, 2, 'LoRa', 'Updated LoRa Battery status.');

-- -- ตาราง LoRa
-- INSERT INTO LoRa (LoRa_ID, Transmission_Interval, LoRa_Battery, LoRa_Temp, Status, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI, Bus_ID) VALUES
-- (1, 60, 85.0, 35.5, TRUE, 13.7563, 100.5018, 12.5, -85, 1),
-- (2, 120, 90.0, 36.0, TRUE, 13.7569, 100.5020, 10.0, -90, 2);

-- -- ตาราง LoRaLog
-- INSERT INTO LoRaLog (LoRa_ID, LoRa_Battery, LoRa_Temp, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI) VALUES
-- (1, 84.5, 35.4, 13.7563, 100.5018, 12.4, -86),
-- (2, 89.5, 35.9, 13.7569, 100.5020, 10.1, -91);

-- -- ตาราง LoRa5MinLog
-- INSERT INTO LoRa5MinLog (LoRa_ID, LoRa_Battery, LoRa_Temp, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI) VALUES
-- (1, 84.0, 35.3, 13.7563, 100.5018, 12.3, -87),
-- (2, 89.0, 35.8, 13.7569, 100.5020, 10.2, -92);

-- -- ตาราง LoRa1HourLog
-- INSERT INTO LoRa1HourLog (LoRa_ID, LoRa_Battery, LoRa_Temp, LoRa_Latitude, LoRa_Longitude, LoRa_SNR, LoRa_RSSI) VALUES
-- (1, 83.5, 35.2, 13.7563, 100.5018, 12.2, -88),
-- (2, 88.5, 35.7, 13.7569, 100.5020, 10.3, -93);

-- -- ตาราง Notifications
-- INSERT INTO Notifications (LoRa_ID, Issue_Type, Issue_Description, Resolved, Is_Current) VALUES
-- (1, 'Battery Low', 'LoRa 1 battery level is below threshold.', FALSE, TRUE),
-- (2, 'Connection Lost', 'LoRa 2 disconnected from network.', TRUE, FALSE);
