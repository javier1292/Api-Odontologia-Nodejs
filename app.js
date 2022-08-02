'use strict'

//Requires
var express = require('express');
var bodyParser = require ('body-parser');

//Ejecutar express
var app = express();

//cargar  archivos de rutas
var user_routes = require('./routes/UserRoutes');
var Pacientes_routes = require('./routes/PacientesRoutes');
var procedimiento_routes = require('./routes/ProcedimientoRoutes');

//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cors
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Reescribir routes 
app.use('/api', user_routes);
app.use('/api', Pacientes_routes);
app.use('/api', procedimiento_routes);


//Exportar el modulo 
module.exports = app;