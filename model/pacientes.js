'use strict'

var mongoose = require('mongoose');
var mongoosepaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

//Modelo de Procedimiento 
var ProcedureSchema = Schema({

    name: String,
    description:String,
    document:String,
    date:{type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'user'},

});

var procedure = mongoose.model('procedure', ProcedureSchema);

//Modelo de pacientes
var PacientesSchema = Schema({
    name: String,
    surname: String,
    telefono:String,
    email: String,
    edad: String,
    imagen:String,
    procedures: [ProcedureSchema],
    user: {type: Schema.ObjectId, ref: 'user'},

});

//cargar paginacion 
PacientesSchema.plugin(mongoosepaginate);

module.exports = mongoose.model('Pacientes', PacientesSchema);