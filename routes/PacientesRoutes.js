'use strict'

var express = require('express');
var pacientesController = require('../Controller/PacientesController');

var router = express.Router();
var md_auth = require('../middleware/authenticate');
var multiparty = require('connect-multiparty');
var md_uploaad = multiparty({uploadDir: './uploads/Pacientes'})


router.post('/paciente', md_auth.authenticate, pacientesController.save);
router.get('/pacientes/:page?', md_auth.authenticate, pacientesController.list);
router.get('/user-pacientes/:user', pacientesController.getPacientes);
router.get('/pacientes/detalles/:id', pacientesController.detalllePaciente);
router.put('/pacientes/update/:id', md_auth.authenticate,pacientesController.update);
router.delete('/pacientes/delete/:id', md_auth.authenticate,pacientesController.delete);
router.get('/pacientes-search/:search', md_auth.authenticate, pacientesController.search);
router.post('/upload-paceinte/:id',[md_uploaad, md_auth.authenticate],pacientesController.upload);

module.exports = router;