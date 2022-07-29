"use strict";
var validator = require("validator");
var User = require("../model/user");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");

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
  update: function(req, res){
    res.status(200).send({
      message: "update user"
    });
  }
};

module.exports = controller;
