'use strict'

var express = require('express');
var pacientesController = require('../Controller/PacientesController');

var router = express.Router();
var md_auth = require('../middleware/authenticate');


router.post('/paciente', md_auth.authenticate, pacientesController.save);
router.get('/pacientes/:page', md_auth.authenticate, pacientesController.list);

module.exports = router;