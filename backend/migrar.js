const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrar() {
    console.log('🔌 Conectando a la base de datos en la nube...');
    
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    console.log('✅ Conectado. Creando tablas...\n');

    await connection.execute(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✓ Tabla "usuarios" creada');


    await connection.execute(`
        CREATE TABLE IF NOT EXISTS normas_transito (
            id_norma INT AUTO_INCREMENT PRIMARY KEY,
            art_num VARCHAR(10) NOT NULL,
            tipo_vehiculo VARCHAR(20) NOT NULL,
            desc_es TEXT NOT NULL,
            desc_en TEXT,
            tipo_multa VARCHAR(50),
            gravedad VARCHAR(20)
        )
    `);
    console.log('✓ Tabla "normas_transito" creada');


    await connection.execute(`
        CREATE TABLE IF NOT EXISTS componentes_seguridad (
            id_comp INT AUTO_INCREMENT PRIMARY KEY,
            nom_comp VARCHAR(50) NOT NULL,
            tipo_veh VARCHAR(10) NOT NULL,
            prioridad VARCHAR(10),
            instruccion_es TEXT,
            instruccion_en TEXT
        )
    `);
    console.log('✓ Tabla "componentes_seguridad" creada');

   
    await connection.execute(`
        INSERT IGNORE INTO normas_transito (art_num, tipo_vehiculo, desc_es, gravedad) VALUES 
        ('1', 'Bicicleta', 'Usar casco de seguridad en vías interurbanas.', 'Grave'),
        ('2', 'Bicicleta', 'No circular por autopistas ni túneles.', 'Muy grave'),
        ('3', 'Bicicleta', 'Contar con luces delantera y trasera en la noche.', 'Leve'),
        ('4', 'Ambos', 'Respetar las señales de tránsito y semáforos.', 'Grave'),
        ('5', 'Bicicleta', 'Circular por la derecha y usar ciclorrutas.', 'Leve'),
        ('6', 'Bicicleta', 'Mantener distancia mínima de 1.5 metros con vehículos motorizados.', 'Grave'),
        ('8', 'Ambos', 'No usar dispositivos móviles mientras conduces.', 'Grave'),
        ('10', 'Ambos', 'Revisar frenos y neumáticos antes de cada salida.', 'Leve'),
        ('101', 'Motocicleta', 'Usar casco certificado en todo momento.', 'Muy grave'),
        ('102', 'Ambos', 'No exceder los límites de velocidad.', 'Grave')
    `);
    console.log('✓ Normas insertadas');

   
    await connection.execute(`
        INSERT IGNORE INTO componentes_seguridad (nom_comp, tipo_veh, prioridad, instruccion_es) VALUES 
        ('Casco', 'Cicla', 'Alta', 'Inspeccionar visualmente por grietas. Debe estar certificado.'),
        ('Frenos', 'Cicla', 'Alta', 'Revisar pastillas y cableado. Deben responder al instante.'),
        ('Luces', 'Cicla', 'Alta', 'Luces delantera (blanca) y trasera (roja) funcionando.'),
        ('Neumáticos', 'Cicla', 'Alta', 'Presión adecuada (40-60 PSI) y sin cortes o desgaste.'),
        ('Cadena', 'Cicla', 'Media', 'Lubricada, sin óxido y con tensión adecuada.'),
        ('Manillar', 'Cicla', 'Media', 'Firme sin juego. Revisar ajuste de la potencia.'),
        ('Pedales', 'Cicla', 'Media', 'Giran libremente. Sin grietas o desgaste.'),
        ('Reflectivos', 'Cicla', 'Media', 'Limpios y visibles. Chaleco reflectivo recomendado.'),
        ('Sillín', 'Cicla', 'Media', 'Ajustado a la altura correcta. Sin grietas.'),
        ('Timbre', 'Cicla', 'Baja', 'Debe sonar fuerte y claro. Obligatorio en ciudades.')
    `);
    console.log('✓ Componentes de bicicleta insertados');

    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('📊 Bases de datos listas para usar.');
    
    await connection.end();
}

migrar().catch(error => {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
});