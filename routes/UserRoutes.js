'use strict'

var express = require('express');
var UserController = require('../Controller/UserController');

var routes = express.Router();
var md_auth = require('../middleware/authenticate')

//rustas de usuarios 
routes.post('/register',UserController.save);
routes.post('/login',UserController.login);
routes.put('/user/update',md_auth.authenticate,UserController.update);

module.exports = routes;