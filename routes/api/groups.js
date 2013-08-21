var db = require("../../db.js");

module.exports = function(req, res){
    db.Group.findAll().success(function(groups) {
        res.json(groups);
    });
};