const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

// Rutas para usuarios
router.get('/', userController.ObtenerTodosLosUsuarios);
router.get('/:id', userController.ObtenerUsuarioPorId);

// SOLO SE PUEDEN CREAR USUARIOS CON MULTER
router.post('/', userController.crearUsuario);

router.put('/:id', userController.ActualizarUsuario);
router.delete('/:id', userController.BorrarUsuario);

// Ruta de autenticación
router.post('/login', userController.loginUsuario);

module.exports = router;
