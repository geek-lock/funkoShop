const db = require('../db/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|txt/;
        const mimeType = fileTypes.test(file.mimetype.toLowerCase());
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extname) {
            return cb(null, true);
        }

        return cb(new Error('Error: Tipo de archivo NO PERMITIDO'), false);
    },
    limits: {
        fileSize: 100000000
    }
});

const upload = multer({ storage: storage });

const ObtenerTodosLosUsuarios = (req, res) => {
    const sql = 'SELECT user_id as id, USER_NAME as name, USER_LASTNAME as apellido, mail FROM users';

    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};

const ObtenerUsuarioPorId = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT user_id, USER_NAME, USER_LASTNAME, mail FROM users WHERE user_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};

const crearUsuario = (req, res) => {
    const { nombre, apellido, mail, Pass } = req.body;
    const archivo = req.file ? req.file.filename : null;

        const sql = 'INSERT INTO users (USER_NAME, USER_LASTNAME, mail, user_pass) VALUES (?,?,?,?)';
        db.query(sql, [nombre, apellido, mail, Pass], (err, result) => {
            if (err) throw err;

            res.json({
                message: 'Usuario Creado'
            });
        });
    
};

const ActualizarUsuario = (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, mail, Pass } = req.body;

    // Hash the password before updating it in the database
    bcrypt.hash(Pass, 10, (err, hashedPassword) => {
        if (err) throw err;

        const sql = 'UPDATE users SET USER_NAME = ?, USER_LASTNAME = ?, mail = ?, user_pass = ? WHERE user_id = ?';
        db.query(sql, [nombre, apellido, mail, hashedPassword, id], (err, result) => {
            if (err) throw err;

            res.json({
                message: 'Usuario editado'
            });
        });
    });
};

const BorrarUsuario = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE user_id= ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;

        res.json({
            message: `Usuario eliminado: ${id}`
        });
    });
};

const loginUsuario = (req, res) => {
   // console.log('esto es antes de los datos');
    const { email, password } = req.body;
   // console.log('estos son los datos, ',email,password);

    const sql = 'SELECT mail, user_pass,user_id FROM users WHERE mail = ?';
    
    db.query(sql, [email], (err, result) => {
        if (err) throw err;
       // console.log('esto es la query result' , result);
        if (result.length === 0) {
           // console.log('estoy en error');
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const user = result[0];
        const id = user.user_id;
        console.log('este es el id, desde el back, ',id);
      //  console.log('esto es el user , ',user);
        if(password === user.user_pass){
            res.json({ success: true, message: 'Inicio de sesión exitoso', idUser: id});
        }else{
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }
       
    });
};

module.exports = {
    ObtenerTodosLosUsuarios,
    ObtenerUsuarioPorId,
    crearUsuario,
    ActualizarUsuario,
    BorrarUsuario,
    loginUsuario,
    upload
};
