const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.get('/', async (req, res) => {
    try {
        const { tipo } = req.query;
        
    
        let tipoVehiculo = '';
        if (tipo === 'Bicicleta') {
            tipoVehiculo = 'Cicla';
        } else if (tipo === 'Moto') {
            tipoVehiculo = 'Moto';
        } else {
            return res.status(400).json({ 
                success: false, 
                error: 'Tipo de vehículo no especificado' 
            });
        }
        
        const [rows] = await db.query(
            `SELECT id_comp, nom_comp, estado_opt, prioridad 
             FROM componentes_seguridad 
             WHERE tipo_veh = ? 
             ORDER BY CASE prioridad 
                WHEN 'Alta' THEN 1 
                WHEN 'Media' THEN 2 
                WHEN 'Baja' THEN 3 
                END, nom_comp`,
            [tipoVehiculo]
        );
        
        res.json({ 
            success: true, 
            data: rows,
            total: rows.length
        });
        
    } catch (error) {
        console.error('Error en /api/chequeo:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al cargar el checklist' 
        });
    }
});

module.exports = router;