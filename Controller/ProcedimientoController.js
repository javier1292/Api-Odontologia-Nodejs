'use strict'

var Controller = {
    save: function(req,res){
        return res.status(404).send({
            message: "store"
        });
    },
    update: function(req,res){

        return res.status(404).send({
            message: "update"
        });
    },
    delete: function(req,res){

        return res.status(404).send({
            message: "delete"
        });
    }
}
module.exports = Controller;