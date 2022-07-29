'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Modelo de Procediento 
var ProcedureSchema = Schema({

    name: String,
    description:String,
    date:{type: Date, default: Date.now},
});

var procedure = mongoose.model('procedure', ProcedureSchema);

//Modelo de pacientes
var PacientesSchema = Schema({
    name: String,
    surname: String,
    telefono:String,
    email: String,
    procedure: [ProcedureSchema],
    user: {type:schema.objectId, ref: 'user'},

});

module.exports = mongoose.model('Pacientes', PacientesSchema);