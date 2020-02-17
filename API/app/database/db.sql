# Local Development Only

-- Remove commentary if you want build database from zero
# DROP DATABASE IF EXISTS `dev-sob`;
# CREATE DATABASE `dev-sob`;
# USE `dev-sob`;

# End Local Development Only

-- Table User (Login)
DROP TABLE IF EXISTS User;
CREATE TABLE IF NOT EXISTS User (
    ID VARCHAR(50) NOT NULL UNIQUE,
    Password TEXT NOT NULL,
    Nama VARCHAR(255),

    CONSTRAINT pk_User_ID PRIMARY KEY(ID)
)ENGINE=InnoDb;

-- Table Flight
DROP TABLE IF EXISTS Flight;
CREATE TABLE IF NOT EXISTS Flight (
    ID VARCHAR(50) NOT NULL UNIQUE,
    No VARCHAR(50),
    Status ENUM('Opening', 'New', 'Closing'),
    Time VARCHAR(30),

    CONSTRAINT pk_Flight_ID PRIMARY KEY(ID)
)ENGINE=InnoDb;

-- Table Product
DROP TABLE IF EXISTS Product;
CREATE TABLE IF NOT EXISTS Product (
    ID VARCHAR(50) NOT NULL UNIQUE,
    Nama VARCHAR(255),
    Price INT UNSIGNED NOT NULL DEFAULT 0,
    Stock INT UNSIGNED NOT NULL DEFAULT 0,
    Flight VARCHAR(50) DEFAULT NULL, -- FK
    Sold INT UNSIGNED NOT NULL DEFAULT 0,
    Total INT UNSIGNED NOT NULL DEFAULT 0,

    CONSTRAINT pk_Product_ID PRIMARY KEY(ID),
    CONSTRAINT fk_Product_Flight FOREIGN KEY(Flight) REFERENCES Flight(ID)
)ENGINE=InnoDb;

-- Table Passenger
DROP TABLE IF EXISTS Passenger;
CREATE TABLE IF NOT EXISTS `Passanger` (
  `ID` varchar(50) NOT NULL UNIQUE,
  `Flight` varchar(50) DEFAULT NULL, --FK
  `Nama` varchar(50) NOT NULL,
  `Category` varchar(30) NOT NULL,
  `Seat` varchar(30) NOT NULL,
  `Birth` varchar(10) NOT NULL,
  `Phone` varchar(20) NOT NULL,

   CONSTRAINT pk_Passenger_ID PRIMARY KEY(ID),
   CONSTRAINT fk_Passenger_Flight FOREIGN KEY(Flight) REFERENCES Flight(ID)

) ENGINE=InnoDB;

-- Table Sync Order
DROP TABLE IF EXISTS Sync_Order;
CREATE TABLE IF NOT EXISTS `Sync_Order` (
  `ID` INT AUTO_INCREMENT UNSIGNED NOT NULL,
  `Product` varchar(50) DEFAULT NULL,
  `Flight` varchar(50) DEFAULT NULL,
  `Sold` int(10) NOT NULL,
  `Total` int(10) NOT NULL,
  `Passanger` varchar(50) DEFAULT NULL,

   CONSTRAINT pk_Sync_Order_ID PRIMARY KEY(ID),
   CONSTRAINT fk_Sync_Order_Flight FOREIGN KEY(Flight) REFERENCES Flight(ID),
   CONSTRAINT fk_Sync_Order_Product FOREIGN KEY(Product) REFERENCES Product(ID),
   CONSTRAINT fk_Sync_Order_Passenger FOREIGN KEY(Passenger) REFERENCES Passenger(ID)

) ENGINE=InnoDB;

--Table Sync User
DROP TABLE IF EXISTS Sync_User;
CREATE TABLE IF NOT EXISTS `Sync_User`(
  `ID` varchar(50) NOT NULL UNIQUE,
  `Flight` varchar(50) DEFAULT NULL,
  `Status` varchar(30) NOT NULL,
  `User` varchar(50) DEFAULT NULL,

   CONSTRAINT pk_Sync_User_ID PRIMARY KEY(ID),
   CONSTRAINT fk_Sync_User_Flight FOREIGN KEY(Flight) REFERENCES Flight(ID),
   CONSTRAINT fk_Sync_User_User FOREIGN KEY(User) REFERENCES User(ID)

) ENGINE=InnoDB;