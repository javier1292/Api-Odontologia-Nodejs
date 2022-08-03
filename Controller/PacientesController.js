"use strict";

const Paciente = require("../model/pacientes");
const validator = require("validator");
const fs = require("fs");
const path = require("path");

const controller = {
  save: function (req, res) {
    //recoger los parametros por post
    const params = req.body;

    //validar los datos
    try {
      const validate_name = !validator.isEmpty(params.name);
      const validate_surname = !validator.isEmpty(params.surname);
      const validate_telefono = !validator.isEmpty(params.telefono);
      const validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
      const validate_edad = !validator.isEmpty(params.edad);
      if (
        validate_name &&
        validate_surname &&
        validate_telefono &&
        validate_email &&
        validate_edad
      ) {
        //crear el objeto
        const paciente = new Paciente();
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
    } catch (ex) {
      return res.status(403).send({
        message: "Faltan datos",
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
      var page = 1;
    } else {
      var page = parseInt(req.params.page);
    }
    //indicar las opciones de paginacion
    const opciones = {
      sort: { date: -1 },
      populate: "user",
      limit: 6,
      page: page,
    };
    //find paginado
    Paciente.paginate({}, opciones, (err, pacientes) => {
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
    const userid = req.params.user;

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
    const pacienteid = req.params.id;

    // find por id del paciente
    Paciente.findById(pacienteid)
      .populate("user")
      .exec((err, paciente) => {
        if (err) {
          return res.status(400).send({
            message: "error al obtener el detalle",
            err,
          });
        }
        if (!paciente) {
          return res.status(400).send({
            message: "no hay paciente ",
          });
        } else {
          //devlver el resultado
          return res.status(200).send({
            status: "success",
            paciente,
          });
        }
      });
  },
  update: function (req, res) {
    try {
      //recoger el id del paceinte
      const pacientesId = req.params.id;
      // recoger los datos que llegan desde el post
      const params = req.body;
      //validar los datos

        //montar  un json con los datos modificados
        const update = {
          name: params.name,
          surname: params.surname,
          telefono: params.telefono,
          email: params.email,
          edad: params.edad,
        };
        // find and update del paceinte por id de usuario
        Paciente.findOneAndUpdate(
          { _id: pacientesId, user: req.user.sub },
          update,
          { new: true },
          (err, paceinteUpdated) => {
            if (err) {
              return res.status(400).send({
                message: "error en la peticion",
              });
            }
            if (!paceinteUpdated) {
              return res.status(400).send({
                message: "no se actualizo el paciente ",
              });
            }

            //devolver respuesta
            return res.status(200).send({
              status: "success",
              paceinteUpdated,
            });
          }
        );
      
        
      
    } catch (ex) {
      return res.status(400).send({
        ex,
      });
    }
  },
  delete: function (req, res) {
    //sacra el id del paceinte por url
    const pacienteId = req.params.id;
    //find and delete paciente by user id
    Paciente.findByIdAndDelete(
      { _id: pacienteId, user: req.user.sub },
      (err, pacienteDeleted) => {
        if (err) {
          return res.status(400).send({
            status: "error",
            message: "error al borrar apaciente",
          });
        }
        if (!pacienteDeleted) {
          return res.status(400).send({
            status: "error",
            message: "no se encontro el paciente",
          });
        }
        //devolver una respuesta
        return res.status(200).send({
          status: "success",
          pacienteDeleted,
        });
      }
    );
  },
  search: function (req, res) {
    //sacar el string a buscar de la url
    const search = req.params.search;
    //find or
    Paciente.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { surname: { $regex: search, $options: "i" } },
      ],
    }).exec((err, pacientes) => {
      if (err) {
        return res.status(400).send({
          message: "error en la peticion ",
        });
      }
      if (!pacientes) {
        return res.status(404).send({
          message: "no hay pacientes disponibles ",
        });
      }
      return res.status(200).send({
        message: "success",
        pacientes,
      });
    });
  },
  upload: function (req, res) {
    //recoger el fichero de la peticion
    const filename = "avatar no subido.....";

    if (!req.files) {
      return res.status(404).send({
        status: "error",
        message: filename,
      });
    }

    //conseguir el nombre y la extencion del archivo subido
    const file_path = req.files.file0.path;
    const file_split = file_path.split("\\");
    //nombre del archivo
    const file_name = file_split[2];
    //extencion del archivo
    const ext_split = file_name.split(".");
    const file_ext = ext_split[1];
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
      // sacar el usuario identificado
      const pacienteId = req.params.id;
      //hacer el update para actualizar el opbjeto
      Paciente.findByIdAndUpdate(
        { _id: pacienteId },
        { imagen: file_name },
        { new: true },
        (err, pacienteUpdate) => {
          if (err || !pacienteUpdate) {
            return res.status(500).send({
              message: "error al subir imagen ",
            });
          } else {
            //devolver una respusta
            return res.status(200).send({
              message: "uploaded",
              user: pacienteUpdate,
            });
          }
        }
      );
    }

    //comprobar el usuario identificado
  },
  getImagen: function (req, res) {
    const fileName = req.params.fileName;
    const pathfile = "./uploads/Pacientes/" + fileName;
    console.log(pathfile);

    if (fs.existsSync(pathfile)) {
      return res.sendFile(path.resolve(pathfile));
    } else {
      return res.status(404).send({
        message: "la imagen no existe",
      });
    }
  },
};

module.exports = controller;
