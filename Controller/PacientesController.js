"use strict";

var Paciente = require("../model/pacientes");
var validator = require("validator");

var controller = {
  save: function (req, res) {
    //recoger los parametros por post
    var params = req.body;

    //validar los datos
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_telefono = !validator.isEmpty(params.telefono);
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_edad = !validator.isEmpty(params.edad);
    } catch (ex) {
      return res.status(403).send({
        message: "Faltan datos",
      });
    }

    if (
      validate_name &&
      validate_surname &&
      validate_telefono &&
      validate_email &&
      validate_edad
    ) {
      //crear el objeto
      var paciente = new Paciente();
      //asignar valores
      paciente.name = params.name;
      paciente.surname = params.surname;
      paciente.telefono = params.telefono;
      paciente.email = params.email;
      paciente.edad = params.edad;

      //guardar el paciente
      paciente.save((err, pacienteStore) => {
        if (err) {
          return res.status(400).send({
            message: "No se pudo guardar el paciente",
          });
        }
        //devolcer respuesta
        return res.status(200).send({
          status: "success",
          paceinte: pacienteStore,
        });
      });
    } else {
      return res.status(400).send({
        message: "error al validar los datos",
      });
    }
  },
  list: function(req, res){
    //cargar la libreria de paginacion 
    //recoger la pagina actual 
    //indicar las opciones de paginacion 
    //find paginado
    //devolver resultado
    return res.status(200).send({
      message:'list'});
  }
};

module.exports = controller;
