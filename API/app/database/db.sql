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