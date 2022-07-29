'use strict'

//Requires
var express = require('express');
var bodyParser = require ('body-parser');

//Ejecutar express
var app = express();

//cargar  archivos de rutas
var user_routes = require('./routes/UserRoutes');

//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//Cors

//Reescribir routes 
app.use('/api', user_routes)


//Exportar el modulo 
module.exports = app;