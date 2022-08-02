"use strict";

var Paciente = require("../model/pacientes");
var validator = require("validator");
const pacientes = require("../model/pacientes");

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
      paciente.user = req.user.sub;

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
  list: function (req, res) {
    //recoger la pagina actual
    if (
      !req.params.page ||
      req.params.page == null ||
      req.params.page == 0 ||
      req.params.page == "0" ||
      req.params.page == undefined
    ) {
      var pages = 1;
    } else {
      var pages = parseInt(req.params.page);
    }
    //indicar las opciones de paginacion
    var opciones = {
      sort: { date: -1 },
      populate: "user",
      limit: 6,
      page: pages,
    };
    //find paginado
    pacientes.paginate({}, opciones, (err, pacientes) => {
      if (err) {
        return res.status(500).send({
          message: "error al hacer una consulta ",
        });
      }
      if (!pacientes) {
        return res.status(404).send({
          message: "Not found",
        });
      }
      //devolver resultado
      return res.status(200).send({
        status: "success",
        pacientes: pacientes.docs,
        totalDocs: pacientes.totalDocs,
        totalPages: pacientes.totalPages,
      });
    });
  },
  getPacientes: function (req, res) {
    //conseguir id de usuario
    var userid = req.params.user;

    // find con una condicion de usuaio
    Paciente.find({ user: userid })
      .sort([["date", "descending"]])
      .exec((err, paciente) => {
        if (err) {
          return res.status(400).send({
            message: "Error al buscar un paciente",
          });
        }
        if (!paciente) {
          return res.status(400).send({
            message: "este user no tiene pacientes registardo ",
          });
        }
        //devolver el resultado
        return res.status(200).send({
          status: "success",
          pacientes: paciente,
        });
      });
  },
  detalllePaciente: function (req, res) {
    //sacr id del paciente
    var pacienteid = req.params.id;

    // find por id del paciente
    Paciente.findById(pacienteid)
      .populate("user")
      .exec((err, pacientes) => {
        if (err) {
          return res.status(400).send({
            message: "error al obtener el detalle",
          });
        }
        if (!pacientes) {
          return res.status(400).send({
            message: "no hay paciente ",
          });
        } else {
          //devlver el resultado
          return res.status(200).send({
            status: "success",
            pacientes,
          });
        }
      });
  },
  update: function (req, res){
    //recoger el id del paceinte 
    var pacientesId = req.params.id;
    // recoger los datos que llegan desde el post
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
      //montar  un json con los datos modificados 
      var update = {
        name: params.name,
        surname:params.surname,
        telefono:params.telefono,
        email:params.email,
        edad:params.edad
      };
      // find and update del paceinte por id de usuario 
      Paciente.findOneAndUpdate({_id:pacientesId, user:req.user.sub},update,{new:true},(err,paceinteUpdated)=>{

        if(err){
          return res.status(400).send({
            message:"error en la peticion"
          });
        }
        if(!paceinteUpdated){
          return res.status(400).send({
            message:"no se actualizo el paciente "
          });
        }
        
        //devolver respuesta
        return res.status(200).send({
          status:"success",
          paceinteUpdated
        });
      });
      
      
    }else{
      return res.status(400).send({
        message:"validacion de datos incorrecta"
      });
    }
  },
  delete: function (req, res){

    return res.status(200).send({
      message:"delete"
    });
  }
};

module.exports = controller;
