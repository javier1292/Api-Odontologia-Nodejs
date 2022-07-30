"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3999;

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false );

mongoose
  .connect("mongodb://localhost:27017/api_odontologia", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado");


    //crear el servidor 
    app.listen(port,()=>{
        console.log('el servidor esta arriba ')
    })
  })
  .catch((error) => console.log(error));
