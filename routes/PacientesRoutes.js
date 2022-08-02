'use strict'

var express = require('express');
var pacientesController = require('../Controller/PacientesController');

var router = express.Router();
var md_auth = require('../middleware/authenticate');


router.post('/paciente', md_auth.authenticate, pacientesController.save);
router.get('/pacientes/:page?', md_auth.authenticate, pacientesController.list);
router.get('/user-pacientes/:user', pacientesController.getPacientes);
router.get('/pacientes/detalles/:id', pacientesController.detalllePaciente);
router.put('/pacientes/update/:id', md_auth.authenticate,pacientesController.update);
router.delete('/pacientes/delete/:id', md_auth.authenticate,pacientesController.delete);
router.get('/pacientes-search/:search', md_auth.authenticate, pacientesController.search);

module.exports = router;