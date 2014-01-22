/**
* Sencillo script con nodejs trabajando con sqlite3,
* bootstrap de twitter y el motor de plantillas jade
*/

var sqlite3 = require('sqlite3').verbose(),//necesario para utilizar sqlite3
db = new sqlite3.Database('blogNode'),//creamos la base de datos llamada blogNode si no existe
UserModel = {};//objeto para exportar y manejar la información del modelo

//funcion para crear la tabla usuarios
UserModel.createUsersTable = function()
{
	db.run("DROP TABLE IF EXISTS usuarios");
	db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, username NCHAR(55), password NCHAR(55), registerDate DATE)");
	console.log("La tabla usuarios ha sido correctamente creada");
}

//obtenemos todos los clientes de la tabla clientes
//con db.all obtenemos un array de objetos, es decir todos
UserModel.getUsers = function(callback)
{
    db.all("SELECT * FROM usuarios", function(err, rows) 
    {
        if(err)
        {
            throw err;
        }
        else
        {
            callback(null, rows);
        }
    });
}

//funcion para registrar nuevos usuarios
UserModel.registerUser = function(userData, callback)
{
	var response = {};//respuesta para devolver 
	//consultamos si existe el usuario con parámetros, así escapamos los datos
	stmt = db.prepare("SELECT * FROM usuarios WHERE username = ?");
	//pasamos el nombre del usuario a la consulta
    stmt.bind(userData.username);
    //hacemos uso de get para saber el número de filas afectadas
    //error contiene el error o null, y rows las filas afectadas, si hay algo
    //es que el usuario ya existe, bingo!
    stmt.get(function(error, rows) 
    {
    	//console.log(JSON.stringify(error)); return;
        if(error) 
        {
            throw err;
        } 
        else 
        {
            if(rows) 
            {
                callback({msg:"existe"});
            }
            else
            {

            	//insertamos al usuario en la tabla usuarios
            	stmt = db.prepare("INSERT INTO usuarios VALUES (?,?,?,?)");
                stmt.bind(null,userData.username,userData.password,currentDate());
				//aquí hacemos uso de run porque queremos ejecutar la consulta, no obtener
             stmt.run(function(err, result) 
             {
                 if(err) 
                 {
                     throw err;
                 } 
                 else 
                 {
                     callback({msg:"creado"});
                 }
             });
         }
     }
 });
}

//funcion para obtener la fecha actual formateada
//formato DD-MM-YYYY
function currentDate()
{
    var currDate = new Date(),
    year = currDate.getFullYear(),
    month = currDate.getMonth()+1,//los meses en javascript empiezan por 0
    day = currDate.getDate();
    if(month <= 9)
        month = '0'+month;

    if(day <= 9)
        day = '0'+day;
    var formatDate = day +'-'+ month +'-'+ year; 
    return formatDate;    
}

//debemos escribir esta linea para poder utilizar el modelo
module.exports = UserModel;