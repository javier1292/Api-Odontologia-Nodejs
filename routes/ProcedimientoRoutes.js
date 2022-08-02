'use strict'
var express = require('express');
var procedimientoController = require('../Controller/ProcedimientoController');

var router = express.Router();
var md_auth = require('../middleware/authenticate');


router.post('/procedimiento/:idP', md_auth.authenticate,procedimientoController.save);
router.put('/procedimiento/update/:id', md_auth.authenticate,procedimientoController.update);
router.delete('/procedimiento/delete/:idP/:id', md_auth.authenticate,procedimientoController.delete);

module.exports = router;