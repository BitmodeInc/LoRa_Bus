CREATE TABLE Admin (
    Admin_ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(60) NOT NULL,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(50) NOT NULL UNIQUE,
    CreateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UpdateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE Bus (
    Bus_ID INT(10) AUTO_INCREMENT PRIMARY KEY,
    Bus_Name VARCHAR(50) NOT NULL UNIQUE,
    Bus_Line INT(3) NULL,
    Dip_Switch_Value INT NULL UNIQUE,
    CreateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UpdateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE BusStop (
    BusStop_ID INT(10) AUTO_INCREMENT PRIMARY KEY,
    BusStop_Name VARCHAR(50) NOT NULL UNIQUE,
    BusStop_Latitude DECIMAL(10, 7) NOT NULL,
    BusStop_Longitude DECIMAL(10, 7) NOT NULL,
    Search_Details VARCHAR(255) NOT NULL,
    CreateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UpdateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE SearchLog (
    Log_ID INT(13) AUTO_INCREMENT PRIMARY KEY,
    User_IP_Address VARCHAR(45) NOT NULL,
    Type VARCHAR(50) NOT NULL,
    Search_Term VARCHAR(50) NOT NULL,
    Search_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE UserReport (
    Report_ID INT(13) AUTO_INCREMENT PRIMARY KEY,
    Type VARCHAR(50) NOT NULL,
    Detail VARCHAR(255) NOT NULL,
    Report_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE LoginLog (
    Log_ID INT(10) AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    Status BOOLEAN NOT NULL,
    IP_Address VARCHAR(45) NOT NULL,
    Login_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE EditLog (
    Log_ID INT(10) AUTO_INCREMENT PRIMARY KEY,
    Admin_ID INT(13) NULL,
    ID INT(10) NOT NULL,
    Type VARCHAR(50) NOT NULL,
    Edit_Detail VARCHAR(255) NOT NULL,
    Edit_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE LoRa ( 
    Dip_Switch_Value INT NOT NULL PRIMARY KEY,
    Transmission_Interval INT NOT NULL,
    Status BOOLEAN NOT NULL,
    Bus_ID INT(10) NULL,
    CreateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UpdateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    Last_Update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE LoRaLog (
    Log_ID INT(10) AUTO_INCREMENT PRIMARY KEY,
    Dip_Switch_Value INT NOT NULL,
    LoRa_Battery FLOAT(6) NULL,
    LoRa_Temp FLOAT(6) NULL,
    LoRa_Latitude DECIMAL(10, 7) NULL,
    LoRa_Longitude DECIMAL(10, 7) NULL,
    LoRa_SNR DECIMAL(5, 2) NULL,
    LoRa_RSSI INT(5) NULL,
    Update_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE LoRa5MinLog (
    Log_ID INT(10) AUTO_INCREMENT PRIMARY KEY,
    Dip_Switch_Value INT NOT NULL,
    LoRa_Battery FLOAT(6) NULL,
    LoRa_Temp FLOAT(6) NOT NULL,
    LoRa_Latitude DECIMAL(10, 7) NULL,
    LoRa_Longitude DECIMAL(10, 7) NULL,
    LoRa_SNR DECIMAL(5, 2) NULL,
    LoRa_RSSI INT(5) NULL,
    Update_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE LoRa1HourLog (
    Log_ID INT(10) AUTO_INCREMENT PRIMARY KEY,
    Dip_Switch_Value INT NOT NULL,
    LoRa_Battery FLOAT(6) NULL,
    LoRa_Temp FLOAT(6) NULL,
    LoRa_Latitude DECIMAL(10, 7) NULL,
    LoRa_Longitude DECIMAL(10, 7) NULL,
    LoRa_SNR DECIMAL(5, 2) NULL,
    LoRa_RSSI INT(5) NULL,
    Update_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE Notifications (
    Notifications_ID INT(10) AUTO_INCREMENT PRIMARY KEY,
    Dip_Switch_Value INT NOT NULL,
    Issue_Type VARCHAR(255) NOT NULL,
    Issue_Description VARCHAR(255) NOT NULL,
    Resolved BOOLEAN NOT NULL,
    Is_Current BOOLEAN NOT NULL,
    Event_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE Road (
    Road_ID INT AUTO_INCREMENT PRIMARY KEY, -- รหัสถนน
    Road_Name VARCHAR(100) NOT NULL, -- ชื่อถนน
    Coordinates JSON NOT NULL -- พิกัดที่เก็บ array ของตำแหน่ง latitude และ longitude
);


-- CREATE TABLE Line (
--     Line_ID INT(3) AUTO_INCREMENT PRIMARY KEY,
--     Line_Name VARCHAR(50) NOT NULL UNIQUE,
--     Description VARCHAR(255)
-- );

-- CREATE TABLE RoutePoints (
--     RoutePoint_ID INT AUTO_INCREMENT PRIMARY KEY,
--     Line_ID INT NOT NULL, 
--     Latitude DECIMAL(10, 7) NOT NULL,
--     Longitude DECIMAL(10, 7) NOT NULL,
--     Sequence INT NOT NULL 
-- );

-- Foreign Key Constraints
-- ALTER TABLE Bus
-- ADD CONSTRAINT FK_Bus_Line
-- FOREIGN KEY (Bus_Line) REFERENCES Line(Line_ID)

ALTER TABLE Bus
ADD CONSTRAINT FK_Bus_DipSwitch
FOREIGN KEY (Dip_Switch_Value) REFERENCES LoRa(Dip_Switch_Value)

ALTER TABLE LoRa
ADD CONSTRAINT FK_LoRa_Bus
FOREIGN KEY (Bus_ID) REFERENCES Bus(Bus_ID)

ALTER TABLE Notifications
ADD CONSTRAINT FK_Notifications_DipSwitch
FOREIGN KEY (Dip_Switch_Value) REFERENCES LoRa(Dip_Switch_Value)

ALTER TABLE EditLog
ADD CONSTRAINT FK_EditLog_Admin
FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID)

-- ALTER TABLE RoutePoints
-- ADD CONSTRAINT FK_RoutePoints_RouteID
-- FOREIGN KEY (Route_ID) REFERENCES Routes(Route_ID)

