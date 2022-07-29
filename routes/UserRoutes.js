'use strict'

var express = require('express');
var UserController = require('../Controller/UserController');

var routes = express.Router();

//rustas de usuarios 
routes.post('/register',UserController.save);


module.exports = routes;