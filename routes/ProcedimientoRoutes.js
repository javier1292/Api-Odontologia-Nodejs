'use strict'
var express = require('express');
var procedimientoController = require('../Controller/ProcedimientoController');

var router = express.Router();
var md_auth = require('../middleware/authenticate');
var multiparty = require('connect-multiparty');
var md_uploaad = multiparty({uploadDir: './uploads/porcedure'})


router.post('/procedimiento/:idP', md_auth.authenticate,procedimientoController.save);
router.put('/procedimiento/update/:id', md_auth.authenticate,procedimientoController.update);
router.post('/procedimiento/upload/:id',[md_uploaad, md_auth.authenticate],procedimientoController.upload);
router.delete('/procedimiento/delete/:idP/:id', md_auth.authenticate,procedimientoController.delete);
router.get('/procedimiento/doc/:fileName',procedimientoController.getImagen);

module.exports = router;