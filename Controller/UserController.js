"use strict";
var validator = require("validator");
var User = require("../model/user");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
var fs = require("fs");
var path = require("path");

var controller = {
  save: function (req, res) {
    //recoger los parametros de la peticion
    var params = req.body;

    //validar los datos
    var validate_name = !validator.isEmpty(params.name);
    var validate_surname = !validator.isEmpty(params.surname);
    var validate_email =
      !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);

    if (
      validate_name &&
      validate_surname &&
      validate_email &&
      validate_password
    ) {
      //crear objeto
      var user = new User();

      //asignar valores
      user.name = params.name;
      user.surname = params.surname;
      user.password = params.password;
      user.email = params.email.toLowerCase();
      user.role = "admin";
      user.image = null;

      //comprobar si el usuario ya existe
      User.findOne({ email: user.email }, (err, issetuser) => {
        if (err) {
          return res.status(400).send({
            message:
              "Ya existe un usuario con estta direccion de correo electronico ",
          });
        }

        if (!issetuser) {
          //cifrar la contraseña
          bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;

            //Guardar el usuario
            user.save((err, userStored) => {
              if (err) {
                return res.status(400).send({
                  message: "Error al guardar el usurio ",
                });
              }

              if (!userStored) {
                return res.status(400).send({
                  message: "El usuario no se guardo ",
                });
              }

              //devolver la respuesta
              return res.status(200).send({
                message: "Usuario guardado correctamente ",
                user: userStored,
              });
            });
          });
        } else {
          return res.status(400).send({
            message: "Ya existe un usuario con este correo",
          });
        }
      });
    } else {
      //devolver la respuesta
      return res.status(400).send({
        message: "Llene los datos correctamente ",
      });
    }
  },
  login: function (req, res) {
    //recoger los parametros de la peticion
    var params = req.body;

    //validar datos
    var validate_email =
      !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);

    if (!validate_email && validate_password) {
      return res.status(400).send({
        message: "los datos son incorrectos ",
      });
    }
    //buscar usuarios que coincida con el email que nos llega
    User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
      //comprobar si nos llega un error
      if (err) {
        return res.status(400).send({
          message: "User no encontrado ",
        });
      }

      //comprrbare si trae un usuario
      if (!user) {
        return res.status(400).send({
          message: "User no encontrado ",
        });
      }

      //si se encuentra
      //comprobar la password (coincidencia con email y password / bcrypt)
      bcrypt.compare(params.password, user.password, (err, check) => {
        //si es correcto
        if (check) {
          //generar token con jwt
          if (params.gettoken) {
            // devolver los datos de login
            return res.status(200).send({
              message: "Login succes",
              token: jwt.createToken(user),
            });
          } else {
            //Limpiar el objeto
            user.password = undefined;
          }
        } else {
          return res.status(400).send({
            message: "los credenciales no son corre3ctas ",
          });
        }
      });
    });
  },
  update: function (req, res) {
    //recoger los datos del usuari
    var params = req.body;
    //vaqlidar datos
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
    } catch (err) {
      res.status(400).send({
        message: "faltan datos por enviar ",
        params,
      });
    }

    //eliminar propiedades innecesarias
    delete params.password;
    //user id
    var userId = req.user.sub;

    //comprobar el email
    if (req.user.email != params.email) {
      User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
        if (err) {
          res.status(500).send({
            message: "error al intentar identificarse",
          });
        }

        if (user && user.email == params.email) {
          res.status(200).send({
            message: "el email no puede ser modificado",
          });
        }
      });
    } else {
      //buscar y actualizar documentos de la base de datos
      User.findOneAndUpdate(
        { _id: userId },
        params,
        { new: true },
        (err, userupdated) => {
          if (err) {
            res.status(500).send({
              message: "error al actualizar el user",
              user: userupdated,
            });
          }

          if (!userupdated) {
            res.status(500).send({
              message: "error",
              user: userupdated,
            });
          }
          //devolver respusta
          res.status(200).send({
            message: "update user",
            user: userupdated,
          });
        }
      );
    }
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
      // sacar el usuario identificado
      var userId = req.user.sub;
      //hacer el update para actualizar el opbjeto
      User.findByIdAndUpdate(
        { _id: userId },
        { image: file_name },
        { new: true },
        (err, userUpdate) => {
          if (err || !userUpdate) {
            return res.status(500).send({
              message: "error al subir imagen ",
            });
          } else {
            //devolver una respusta
            return res.status(200).send({
              message: "uploaded",
              user: userUpdate,
            });
          }
        }
      );
    }

    //comprobar el usuario identificado
  },
  avatar: function (req, res) {
    var fileName = req.params.fileName;
    var pathfile = "./uploads/users/" + fileName;
    console.log(pathfile);

    if (fs.existsSync(pathfile)) {
      return res.sendFile(path.resolve(pathfile));
    }else{
      return res.status(404).send({
        message: "la imagen no existe",
      });
    }
  },
  getusers: function(req, res){
    User.find().exec((err,users)=>{
      if (err || !users){
        return res.status(404).send({
          message: "Usuarios no encontrados"
        });
      }else{
        return res.status(200).send({
          status: "success",
          users
        });
      }
    });

  },
  getuser: function(req,res){
    var userId = req.params.userId;
    User.findById(userId).exec((err,user)=>{
      if (err || !user){
        return res.status(404).send({
          message: "Usuarios no encontrados"
        });
      }else{
        return res.status(200).send({
          status: "success",
          user
        });
      }

    });
  }
};

module.exports = controller;
