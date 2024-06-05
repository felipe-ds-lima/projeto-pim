CREATE DATABASE facilitime;
USE facilitime;

CREATE TABLE User (
  userId INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(255),
  birthdate DATETIME
);

CREATE TABLE Timeline (
  timelineId INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  userId INT,
  FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE Point (
  pointId INT PRIMARY KEY AUTO_INCREMENT,
  startDate DATETIME,
  endDate DATETIME,
  title VARCHAR(255),
  content TEXT,
  color VARCHAR(100),
  timelineId INT,
  userId INT,
  FOREIGN KEY (timelineId) REFERENCES Timeline(timelineId) ON DELETE CASCADE
  FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE Note (
  noteId INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  userId INT,
  FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE Task (
  taskId INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  checked TINYINT,
  userId INT,
  FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

CREATE TABLE ScheduleEvent(
  eventId INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  startDate DATETIME,
  endDate DATETIME,
  color VARCHAR(100),
  sendNotification TINYINT,
  repeatAt VARCHAR(255),
  userId INT,
  FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);
