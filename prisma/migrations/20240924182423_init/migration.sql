-- CreateTable
CREATE TABLE `Registrar` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(255) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `Nombreyapellido` VARCHAR(255) NOT NULL,
    `Direccion` VARCHAR(255) NOT NULL,
    `Contacto` VARCHAR(255) NOT NULL,
    `BilleteraPago` VARCHAR(255) NOT NULL,
    `DNI` INTEGER NOT NULL,

    UNIQUE INDEX `Registrar_Email_key`(`Email`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistorialMedico` (
    `Cliente` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NULL,

    PRIMARY KEY (`Cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HistorialMedico` ADD CONSTRAINT `HistorialMedico_Cliente_fkey` FOREIGN KEY (`Cliente`) REFERENCES `Registrar`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
