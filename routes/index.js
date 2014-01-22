/**
* Sencillo script con nodejs trabajando con sqlite3,
* bootstrap de twitter y el motor de plantillas jade
*/

//llamamos al modelo user.js para utilizar toda su funcionalidad
var UserModel = require('../models/user');

//aquí tenemos el objeto app que hemos traído de app.js
module.exports = function(app)
{

	//ruta para crear la tabla usuarios
    app.get("/createTable", function(req, res)
    {
		UserModel.createUsersTable();
		res.end();
	});

    //ruta que muestra el formulario de registro
    app.get("/", function(req, res)
    {
        //en este caso le decimos que queremos renderizar la vista views/index.jade con algunos datos
        res.render('index', { 
            titulo: 'Formularios en NodeJS con Bootstrap'
        });
    });

    //obtenemos y mostramos todos con getUsers() los datos de todos los usuarios
    app.get("/users", function(req, res){
        UserModel.getUsers(function(error, data)
        {
            res.render('users', { 
                titulo: 'Usuarios registrados en el blog',
                usuarios : data
            });
        });
    });

    //recibimos la interaccion de cuando el usuario envia el formulario de registro
   	app.post("/register", function(req,res)
   	{
    	UserModel.registerUser({username:req.body.username,password:req.body.password}, function(data)
    	{
    		if(data)
    		{
	    		//si el usuario ya existia en la bd
	    		if(data.msg === "existe")
	    		{
	    			res.send("existe", 200);
	    		}
	    		else
	    		{
	    			res.send("creado", 200);
	    		}
	    	}
	    	else
	    	{
	    		res.send("error", 400);
	    	}
    	});
    });
}