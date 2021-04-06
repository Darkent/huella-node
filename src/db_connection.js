const mysql = require('mysql');

const database = require("../index");
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    port:3307,
    password : ''
});
connection.connect((error)=>{
  console.log(database);
    if (error) {
      console.error('El error de conexión es: ' + error);
      return;
    }
    console.log('¡Conectado a la Base de Datos!');
  });
module.exports = connection;