const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.get('/', async (req, res) => {
    try {
        const { idioma = 'es', busqueda, tipo } = req.query;
        
        let sql = `SELECT id_norma, art_num, tipo_multa, 
                   ${idioma === 'en' ? 'desc_en' : 'desc_es'} AS descripcion
                   FROM normas_transito WHERE 1=1`;
        const params = [];
        
       
        if (tipo === 'Bicicleta') {
            sql += ` AND (tipo_vehiculo = 'Bicicleta' OR tipo_vehiculo = 'Ambos')`;
        } else if (tipo === 'Moto') {
            sql += ` AND (tipo_vehiculo = 'Moto' OR tipo_vehiculo = 'Ambos')`;
        }
        
        if (busqueda) {
            sql += ` AND (desc_es LIKE ? OR desc_en LIKE ? OR art_num LIKE ?)`;
            params.push(`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`);
        }
        
        sql += ` ORDER BY CAST(art_num AS UNSIGNED)`;
        
        const [rows] = await db.query(sql, params);
        res.json({ success: true, data: rows, total: rows.length });
        
    } catch (error) {
        console.error('Error en /api/normas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { idioma = 'es' } = req.query;
        
        const [rows] = await db.query(
            `SELECT id_norma, art_num, tipo_multa,
             ${idioma === 'en' ? 'desc_en' : 'desc_es'} AS descripcion
             FROM normas_transito WHERE id_norma = ?`,
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Norma no encontrada' });
        }
        
        res.json({ success: true, data: rows[0] });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;