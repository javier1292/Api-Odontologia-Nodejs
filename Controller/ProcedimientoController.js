"use strict";

var Paciente = require("../model/pacientes");
var validator = require("validator");
var fs = require("fs");
var path = require("path");

var Controller = {
  save: function (req, res) {
    //recoger el id del paceinte
    var pacienteid = req.params.idP;
    //find por id  del paciente
    Paciente.findById(pacienteid).exec((err, pacientes) => {
      if (err) {
        return res.status(400).send({
          message: "Eroor",
        });
      }
      if (!pacientes) {
        return res.status(404).send({
          message: "Not found",
        });
      }

      //comprobar si el obj usuario y validar los datos
      if (req.body.name && req.body.description) {
        //validar los datos
        try {
          var validate_name = !validator.isEmpty(req.body.name);
          var validate_description = !validator.isEmpty(req.body.description);
        } catch (ex) {
          return res.status(400).send({
            message: "No agrergaste una descripcion",
          });
        }
        if (validate_name && validate_description) {
          var procedure = {
            use: req.user.sub,
            name: req.body.name,
            description: req.body.description,
          };
          //en la propiedad  de procedures del paciente resultante hacer un push
          pacientes.procedure.push(procedure);

          //gauarda el paciente completo
          pacientes.save((err,procedurestored) => {
            if (err) {
              return res.status(400).send({
                message: "error",
               
              });
            }
           

            //devolver la respuesta
            return res.status(200).send({
              message: "store",
              procedurestored
            });
          });
        } else {
          return res.status(400).send({
            message: "faltan datos",
          });
        }
      } else {
        return res.status(400).send({
          message: "debes madar todos los datos ",
        });
      }
    });
  },
  update: function (req, res) {
    //conseguir el id del procedure
    var procedureId = req.params.id

    //recoger datos y validar
    var params = req.body;

     //validar los datos
     try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_description = !validator.isEmpty(params.description);
    } catch (ex) {
      return res.status(400).send({
        message: "No agrergaste una descripcion",
      });
    }

    if(validate_name && validate_description){
      //find and update de sub documento
      Paciente.findOneAndUpdate(
        {"procedure._id":procedureId},
        {
          "$set":{
            "procedure.$.name": params.name,
            "procedure.$.description": params.description
          }
        },{new:true},(err,procedureUpdate)=>{
          if(err){
            return res.status(400).send({
              message: "no se pudo actualizar"
            });
            
          }
          if(!procedureUpdate){
            return res.status(400).send({
              message: "ese procedimiento no existe "
            });
          } else{

            //devolver datos
            return res.status(200).send({
              message: "update",
              procedureUpdate
            });
          }
          
        });
    }else{
      return res.status(400).send({ message:"faltan datos "});
    }
    
  },
  delete: function (req, res) {
    //sacar el id del paceinte y del procedure
    var pacienteId = req.params.idP
    var procedureId = req.params.id
    //buscar el paciente 
    Paciente.findById(pacienteId,(err,paciente)=>{
      if(err){
        return res.status(400).send({
          message:"error"
        })

      }
      if(!paciente){
        return res.status(400).send({
          message:"Not found paceintes "
        })

      }
      //seleccionar el ,procedure 
      var Proces = paciente.procedure.id(procedureId);
      if(Proces){
        //borrar el procedure 
        Proces.remove();
        //guardar el paciente 
        paciente.save((err,pacientes)=>{
          if(err){
            return res.status(400).send({
              message:"error al guardar "
            });
          }
          if(!pacientes){
            return res.status(400).send({
              message:"not found paciente"
            });
          }else{
            return res.status(200).send({
              message:"success",
              pacientes
            });
          }
        });
      }else{
        return res.status(400).send({
          message:"no se pudo borrar el procedure"
        });
      }
    })
  },
  upload: function (req, res) {
    //recoger el fichero de la peticion
    var filename = "avatar no subido.....";

    if (!req.files) {
      return res.status(404).send({
        status: "error",
        message: filename,
      });
    }

    //conseguir el nombre y la extencion del archivo subido
    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\");
    //nombre del archivo
    var file_name = file_split[2];
    //extencion del archivo
    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];
    //comprobar extension
    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      fs.unlink(file_path, (err) => {
        return res.status(400).send({
          message: "la extencion del archivo no es valida",
        });
      });
    } else {
      //conseguir el id del procedure
      var procedureId = req.params.id
      //hacer el update para actualizar el opbjeto 
      Paciente.findOneAndUpdate(
        {"procedure._id":procedureId},
        {
          "$set":{
            "procedure.$.imagen": file_name,
          }
        },{new:true},(err,procedureUpdate)=>{
          if (err || !procedureUpdate) {
            return res.status(500).send({
              message: "error al subir imagen ",
              err
            });
          } else{

            //devolver datos
            return res.status(200).send({
              message: "update",
              procedureUpdate
            });
          }
        }
      );
    }

    //comprobar el usuario identificado
  },
};
module.exports = Controller;
