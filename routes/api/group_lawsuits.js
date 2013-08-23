var db = require("../../db.js");
var url = require('url');

module.exports = function(req, res){
    db.Group.find(req.params.group_id).success(function(group){
        group.getLawsuits().success(function(lawsuits){
            res.json(lawsuits);
        });
    });
};