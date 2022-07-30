'use strict'

var express = require('express');
var UserController = require('../Controller/UserController');

var routes = express.Router();
var md_auth = require('../middleware/authenticate');
var multiparty = require('connect-multiparty');
var md_uploaad = multiparty({uploadDir: './uploads/users'})

//rustas de usuarios 
routes.post('/register',UserController.save);
routes.post('/login',UserController.login);
routes.post('/uploadAvatar',[md_uploaad, md_auth.authenticate],UserController.upload);
routes.put('/user/update',md_auth.authenticate,UserController.update);
routes.get('/avatar/:fileName',UserController.avatar);
routes.get('/users',UserController.getusers);
routes.get('/user/:userId',UserController.getuser);
 
module.exports = routes;