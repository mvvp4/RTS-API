USE defaultdb;
CREATE TABLE `defaultdb`.`services` (
  `name` VARCHAR(255) NOT NULL,
  `isactive` BINARY NOT NULL DEFAULT 0,
  `modality` VARCHAR(45) NOT NULL,
  `cost` FLOAT(10,3) NOT NULL DEFAULT 0.0,
  `introduction` MEDIUMTEXT NOT NULL,
  `content` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`name`));
  
CREATE TABLE `defaultdb`.`clients` (
  `user` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `dni` INT(100) NOT NULL,
  `genre` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `adress` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user`),
  UNIQUE INDEX `dni_UNIQUE` (`dni` ASC) VISIBLE);

CREATE TABLE service_days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT,
    day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
