'use strict'
var express = require('express');
var procedimientoController = require('../Controller/ProcedimientoController');

var router = express.Router();
var md_auth = require('../middleware/authenticate');


router.post('/procedimiento', md_auth.authenticate,procedimientoController.save);
router.put('/procedimiento/update/:id', md_auth.authenticate,procedimientoController.update);
router.delete('/procedimiento/delete/:id', md_auth.authenticate,procedimientoController.delete);

module.exports = router;