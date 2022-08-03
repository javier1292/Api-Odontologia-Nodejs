'use strict'

const mongoose = require('mongoose');
const mongoosepaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

//Modelo de Procedimiento 
const ProcedureSchema = Schema({

    name: String,
    description:String,
    imagen:String,
    date:{type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'user'},

});

const procedure = mongoose.model('procedure', ProcedureSchema);

//Modelo de pacientes
const PacientesSchema = Schema({
    name: String,
    surname: String,
    telefono:String,
    email: String,
    edad: String,
    imagen:String,
    procedure: [ProcedureSchema],
    user: {type: Schema.ObjectId, ref: 'user'},

});

//cargar paginacion 
PacientesSchema.plugin(mongoosepaginate);

module.exports = mongoose.model('Pacientes', PacientesSchema);