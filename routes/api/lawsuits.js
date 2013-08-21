var db = require("../../db.js");

module.exports = function(req, res){
    db.Lawsuit.findAll().success(function(lawsuits) {
        res.json(lawsuits);
    });
};