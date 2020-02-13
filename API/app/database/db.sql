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