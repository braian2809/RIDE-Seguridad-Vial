const mysql = require('mysql2/promise');
require('dotenv').config();

async function insertarInstrucciones() {
    console.log('🔌 Conectando a la base de datos...');
    
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ Conectado. Insertando instrucciones...\n');
    
    // Verificar/crear columna instruccion_es si no existe
    try {
        const [columns] = await conn.execute('SHOW COLUMNS FROM componentes_seguridad LIKE "instruccion_es"');
        if (columns.length === 0) {
            await conn.execute('ALTER TABLE componentes_seguridad ADD COLUMN instruccion_es TEXT');
            console.log('✓ Columna instruccion_es creada');
        } else {
            console.log('✓ Columna instruccion_es ya existe');
        }
    } catch(e) {
        console.log('⚠️  Verificando columna:', e.message);
    }
    
    // ==============================================
    // INSTRUCCIONES PARA BICICLETA (tipo_veh = 'Cicla')
    // ==============================================
    const instruccionesBici = [
        { nombre: 'Casco', texto: 'Inspeccionar visualmente por grietas. Debe estar certificado.', prioridad: 'Alta' },
        { nombre: 'Frenos', texto: 'Revisar pastillas y cableado. Deben responder al instante.', prioridad: 'Alta' },
        { nombre: 'Luces', texto: 'Luces delantera (blanca) y trasera (roja) funcionando.', prioridad: 'Alta' },
        { nombre: 'Neumáticos', texto: 'Presión adecuada (40-60 PSI) y sin cortes o desgaste.', prioridad: 'Alta' },
        { nombre: 'Cadena', texto: 'Lubricada, sin óxido y con tensión adecuada.', prioridad: 'Media' },
        { nombre: 'Manillar', texto: 'Firme sin juego. Revisar ajuste de la potencia.', prioridad: 'Media' },
        { nombre: 'Pedales', texto: 'Giran libremente. Sin grietas o desgaste.', prioridad: 'Media' },
        { nombre: 'Reflectivos', texto: 'Limpios y visibles. Chaleco reflectivo recomendado.', prioridad: 'Media' },
        { nombre: 'Espejos', texto: 'Opcional pero recomendado. Ajustados para buena visibilidad.', prioridad: 'Baja' },
        { nombre: 'Sillín', texto: 'Ajustado a la altura correcta. Sin grietas.', prioridad: 'Media' },
        { nombre: 'Timbre', texto: 'Debe sonar fuerte y claro. Obligatorio en ciudades.', prioridad: 'Baja' }
    ];
    
    // ==============================================
    // INSTRUCCIONES PARA MOTO (tipo_veh = 'Moto')
    // ==============================================
    const instruccionesMoto = [
        { nombre: 'Casco', texto: 'Casco integral o certificado. Sin golpes, grietas o correas desgastadas.', prioridad: 'Alta' },
        { nombre: 'Chaquetón', texto: 'Con protecciones en codos, hombros y espalda. Preferiblemente certificado.', prioridad: 'Alta' },
        { nombre: 'Guantes', texto: 'Protegen manos en caídas. Deben tener refuerzos en nudillos.', prioridad: 'Media' },
        { nombre: 'Botas', texto: 'Cubren el tobillo. Suela antideslizante y protección en punta.', prioridad: 'Media' },
        { nombre: 'Rodilleras', texto: 'Protección para rodillas. Opcional pero recomendada para viajes largos.', prioridad: 'Baja' },
        { nombre: 'Frenos', texto: 'Revisar pastillas y nivel de líquido. Frenar con suavidad y potencia.', prioridad: 'Alta' },
        { nombre: 'Neumáticos', texto: 'Presión correcta (ver manual). Profundidad del dibujo > 1.6mm.', prioridad: 'Alta' },
        { nombre: 'Luces', texto: 'Alta, baja, direccionales y stop funcionando correctamente.', prioridad: 'Alta' },
        { nombre: 'Espejos', texto: 'Ajustados, limpios y sin grietas. Visibilidad trasera completa.', prioridad: 'Alta' },
        { nombre: 'Aceite', texto: 'Nivel correcto (entre mínimo y máximo). Cambio cada 3000-5000km.', prioridad: 'Alta' },
        { nombre: 'Cadena', texto: 'Lubricada y tensión adecuada (2-3 cm de juego).', prioridad: 'Media' },
        { nombre: 'Batería', texto: 'Bornes limpios y apretados. Sin corrosión. Carga adecuada (12.5V+).', prioridad: 'Media' },
        { nombre: 'Líquido frenos', texto: 'Nivel entre mínimo y máximo. Sin fugas. Cambio cada 2 años.', prioridad: 'Alta' },
        { nombre: 'Kit arrastre', texto: 'Plato, piñón y cadena en buen estado. Sin dientes rotos.', prioridad: 'Media' }
    ];
    
    // ==============================================
    // FUNCIÓN PARA INSERTAR O ACTUALIZAR
    // ==============================================
    async function guardarInstruccion(vehiculo, item) {
        // Primero verificar si existe el componente
        const [existe] = await conn.execute(
            'SELECT id_comp FROM componentes_seguridad WHERE nom_comp = ? AND tipo_veh = ?',
            [item.nombre, vehiculo]
        );
        
        if (existe.length > 0) {
            // Actualizar existente
            await conn.execute(
                'UPDATE componentes_seguridad SET instruccion_es = ?, prioridad = ? WHERE nom_comp = ? AND tipo_veh = ?',
                [item.texto, item.prioridad, item.nombre, vehiculo]
            );
            console.log(`   ✓ Actualizado ${vehiculo}: ${item.nombre}`);
        } else {
            // Insertar nuevo
            await conn.execute(
                'INSERT INTO componentes_seguridad (nom_comp, tipo_veh, instruccion_es, prioridad) VALUES (?, ?, ?, ?)',
                [item.nombre, vehiculo, item.texto, item.prioridad]
            );
            console.log(`   ✓ Insertado ${vehiculo}: ${item.nombre}`);
        }
    }
    
    // Insertar BICICLETAS
    console.log('🚲 Insertando componentes para BICICLETA...');
    for (const item of instruccionesBici) {
        await guardarInstruccion('Cicla', item);
    }
    
    // Insertar MOTOS
    console.log('\n🏍️ Insertando componentes para MOTO...');
    for (const item of instruccionesMoto) {
        await guardarInstruccion('Moto', item);
    }
    
    // ==============================================
    // VERIFICACIÓN FINAL
    // ==============================================
    console.log('\n📊 VERIFICACIÓN FINAL:');
    
    const [bicis] = await conn.execute('SELECT nom_comp, instruccion_es, prioridad FROM componentes_seguridad WHERE tipo_veh = "Cicla" ORDER BY prioridad DESC, nom_comp');
    console.log(`\n🚲 BICICLETA (${bicis.length} componentes):`);
    bicis.forEach(row => {
        const texto = row.instruccion_es ? row.instruccion_es.substring(0, 55) + '...' : 'SIN DESCRIPCIÓN';
        console.log(`   ✓ ${row.nom_comp} (${row.prioridad}): ${texto}`);
    });
    
    const [motos] = await conn.execute('SELECT nom_comp, instruccion_es, prioridad FROM componentes_seguridad WHERE tipo_veh = "Moto" ORDER BY prioridad DESC, nom_comp');
    console.log(`\n🏍️ MOTO (${motos.length} componentes):`);
    motos.forEach(row => {
        const texto = row.instruccion_es ? row.instruccion_es.substring(0, 55) + '...' : 'SIN DESCRIPCIÓN';
        console.log(`   ✓ ${row.nom_comp} (${row.prioridad}): ${texto}`);
    });
    
    console.log(`\n✅ ¡Script completado exitosamente!`);
    console.log(`   Total: ${bicis.length} componentes de bicicleta, ${motos.length} componentes de moto`);
    await conn.end();
}

insertarInstrucciones().catch(error => {
    console.error('❌ Error durante la ejecución:', error.message);
    process.exit(1);
});