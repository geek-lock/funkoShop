const mySql = require('mysql2');

const connection = mySql.createConnection(
    {
        host : 'smy.h.filess.io',
        user: 'funkoShop_agerulelet',
        password : 'admin2023..',
        database: '2e0dae929593f951f324a0e4779c8498e0743c35'
    });


    connection.connect((err) => 
    {
        if(err)
        {
            console.error("ERROR conectando a la base de datos", err);
            return;
        }

        console.log("Conectado EXITOSAMENTE a la base de datos");

    });


module.exports = connection;
