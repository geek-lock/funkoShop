const db = require('../db/db');

//ACTUALIZACIÓN CON MULTER Y CARPETA PUBLIC (en la base de datos se guarda el path)
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage(
    {
        destination: function (req,file,cb){
            cb(null,'uploads/');//Indica la carpeta donde se guardaran los archivos
        },
        filename: function(req,file,cb)
        {
            cb(null,Date.now() + '-' + file.originalname);//nombre del archivo en el disco
        },
        fileFilter: (req,file,cb) =>
        {
            const fileTypes = /jpeg|jpg|png|txt/;


            const mimeType = fileTypes.test(file.mimetype.toLowerCase());


            const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());


       
            if(mimeType && extname)
            {    
                return cb(null,true);
            }
        
        return cb(new Error('Error: Tipo de archivo NO PERMITIDO'), false);
       
        },
        limits:
        {
            fileSize: 100000000
        }

    });

    const upload = multer({storage: storage});




const ObtenerTodosLosUsuarios = (req,res) => 
{
    const sql = 'SELECT user_id as id, USER_NAME as name,USER_LASTNAME as apellido ,mail  FROM users';

    db.query(sql, (err,result) => 
    {
        if(err) throw err;

        res.json(result);
        //console.log('esto es result, ',result);
    });
}


const ObtenerUsuarioPorId = (req, res) =>{
    const {id} = req.params;
    const sql = 'SELECT user_id, USER_NAME,USER_LASTNAME,mail FROM users WHERE user_id = ?';
    db.query(sql,[id], (err,result) =>
    {
        if(err) throw err;        
        res.json(result);
    }); 
};


//ESTO SI ES NECESARIO EDITAR CON MULTER
const crearUsuario = (req, res) =>{
    const {nombre,apellido,mail,Pass} = req.body;
    const archivo = req.file? req.file.filename: null;//Obtener el nombre del archivo guardado
    const sql = 'INSERT INTO users (USER_NAME,USER_LASTNAME,mail,user_pass) VALUES (?,?,?,?)';
    db.query(sql,[nombre,apellido,mail,Pass], (err,result) =>
    {
        if(err) throw err;

  
        res.json({
            message : 'Usuario Creado',
            idUsuario: result.insertId
            });
    });
};






const ActualizarUsuario = (req, res) =>{
    const {id} = req.params;
    const {nombre,apellido,mail} = req.body;


    const sql = 'UPDATE users SET USER_NAME = ?, USER_LASTNAME = ?, mail = ? WHERE user_id = ?';
    db.query(sql,[nombre,apellido,mail,id], (err,result) =>
    {
        if(err) throw err;


        res.json(
            {
                message : 'Usuario editado'
            });
    });


};


const BorrarUsuario = (req, res) =>{
    const {id} = req.params;
    const sql  = 'DELETE FROM users WHERE user_id= ?';
    db.query(sql,[id],(err,result) =>
    {
        if(err) throw err;


        res.json(
            {
                message: 'Usuario eliminado'
            });
    });
};

//aqui tambien agrego multer para exportar el modulo UPLOAD
module.exports = 
{
    ObtenerTodosLosUsuarios,
    ObtenerUsuarioPorId,
    crearUsuario,
    ActualizarUsuario,
    BorrarUsuario,
    upload
}