const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.post('/calcular', async (req, res) => {
    try {
        const { velocidad, tipo_vehiculo, componentes, id_usuario } = req.body;
        
        let puntaje = 0;
        let factores = [];
        let recomendaciones = [];
        let multasRelacionadas = [];
        
      
        if (velocidad > 60) {
            puntaje += 50;
            factores.push('Velocidad extremadamente alta (>60km/h)');
            recomendaciones.push('🚨 Reduce tu velocidad inmediatamente');
            
           
            const [multas] = await db.query(
                "SELECT art_num, desc_es FROM normas_transito WHERE desc_es LIKE '%velocidad%' OR desc_es LIKE '%exceso%' LIMIT 1"
            );
            if (multas.length > 0) multasRelacionadas.push(multas[0]);
        } else if (velocidad > 40) {
            puntaje += 25;
            factores.push('Velocidad moderadamente alta (>40km/h)');
            recomendaciones.push('⚠️ Disminuye la velocidad en zonas urbanas');
        }
        
     
        if (componentes) {
            if (!componentes.casco) {
                puntaje += 35;
                factores.push('No uso de casco');
                recomendaciones.push('🚨 CASCO OBLIGATORIO. Reduce un 70% el riesgo de muerte');
                
                const [multas] = await db.query(
                    "SELECT art_num, desc_es FROM normas_transito WHERE desc_es LIKE '%casco%' LIMIT 1"
                );
                if (multas.length > 0) multasRelacionadas.push(multas[0]);
            }
            
            if (!componentes.luces) {
                puntaje += 25;
                factores.push('Sin luces funcionando');
                recomendaciones.push('💡 Usa luces delantera y trasera. Sé visible');
            }
            
            if (!componentes.frenos) {
                puntaje += 30;
                factores.push('Frenos en mal estado');
                recomendaciones.push('🔧 Revisa tus frenos antes de salir');
            }
            
            if (tipo_vehiculo === 'Cicla' && !componentes.reflectivos) {
                puntaje += 15;
                factores.push('Sin elementos reflectivos');
                recomendaciones.push('🦺 Usa chaleco reflectivo o bandas reflectivas');
            }
        }
        
        
        let nivel, color, mensaje;
        
        if (puntaje >= 70) {
            nivel = 'crítico';
            color = 'danger';
            mensaje = '🚨 ¡ALTO RIESGO! Detente ahora. Revisa tu vehículo.';
        } else if (puntaje >= 40) {
            nivel = 'moderado';
            color = 'warning';
            mensaje = '⚠️ Riesgo moderado. Toma precauciones.';
        } else if (puntaje >= 20) {
            nivel = 'leve';
            color = 'info';
            mensaje = 'ℹ️ Riesgo leve. Pequeñas mejoras aumentan tu seguridad.';
        } else {
            nivel = 'seguro';
            color = 'success';
            mensaje = '✅ ¡Vas bien! Mantén estos hábitos.';
        }
        
        if (id_usuario && puntaje >= 40) {
            await db.query(
                `INSERT INTO notificaciones_historial (id_usuario, mensaje, nivel_urgencia) 
                 VALUES (?, ?, ?)`,
                [id_usuario, mensaje, nivel === 'crítico' ? 'Crítico' : 'Alto']
            );
        }
        
        res.json({
            success: true,
            nivel,
            color,
            puntaje,
            mensaje,
            factores,
            recomendaciones,
            multas: multasRelacionadas
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;