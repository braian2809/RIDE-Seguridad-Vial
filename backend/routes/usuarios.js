const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id_usuario, nombre, correo, edad, tipo_vehiculo, cil_val, mensaje_mot, fecha_rev FROM usuario'
        );
        res.json({
            success: true,
            usuarios: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener la lista de usuarios' 
        });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.query(
            `SELECT id_usuario, nombre, correo, edad, tipo_vehiculo, cil_val, mensaje_mot, fecha_rev
             FROM usuario WHERE id_usuario = ?`,
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
        
        res.json({ success: true, data: rows[0] });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


router.get('/buscar/email/:correo', async (req, res) => {
    try {
        const { correo } = req.params;
        
        const [rows] = await db.query(
            `SELECT id_usuario, nombre, correo, edad, tipo_vehiculo, cil_val, mensaje_mot, fecha_rev
             FROM usuario WHERE correo = ?`,
            [correo]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
        
        res.json({ success: true, data: rows[0] });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/registrar', async (req, res) => {
    
});

router.put('/:id', async (req, res) => {
    
});

module.exports = router;