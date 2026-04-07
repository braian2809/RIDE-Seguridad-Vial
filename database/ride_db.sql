-- 1. Limpieza y Creación de la Base de Datos
DROP DATABASE IF EXISTS ride_db;
CREATE DATABASE ride_db;
USE ride_db;

-- 2. Tabla: usuario
CREATE TABLE usuario (
    id_usuario INT(50) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    edad INT(3) NOT NULL,
    tipo_vehiculo ENUM('Moto', 'Cicla') NOT NULL,
    cil_val DECIMAL(10,2) DEFAULT NULL,
    mensaje_mot VARCHAR(150) DEFAULT NULL,
    fecha_rev DATE DEFAULT NULL,
    PRIMARY KEY (id_usuario)
) ENGINE=InnoDB;

-- 3. Tabla: componentes_seguridad
CREATE TABLE componentes_seguridad (
    id_comp INT(50) NOT NULL AUTO_INCREMENT,
    nom_comp VARCHAR(50) NOT NULL,
    estado_opt VARCHAR(100) NOT NULL,
    tipo_veh ENUM('Moto', 'Cicla') NOT NULL,
    prioridad VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_comp)
) ENGINE=InnoDB;

-- 4. Tabla: normas_transito
CREATE TABLE normas_transito (
    id_norma INT(50) NOT NULL AUTO_INCREMENT,
    art_num VARCHAR(10) NOT NULL,
    desc_es TEXT NOT NULL,
    desc_en TEXT NOT NULL,
    tipo_multa CHAR(1) DEFAULT NULL,
    PRIMARY KEY (id_norma)
) ENGINE=InnoDB;

-- 5. Tabla: notificaciones_historial
CREATE TABLE notificaciones_historial (
    id_notif INT(50) NOT NULL AUTO_INCREMENT,
    id_usuario INT(50) NOT NULL,
    mensaje TEXT NOT NULL,
    nivel_urgencia VARCHAR(20) NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_notif),
    CONSTRAINT fk_usuario_notif FOREIGN KEY (id_usuario) 
        REFERENCES usuario(id_usuario) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
