var db = require("../../db.js");
var url = require('url');

module.exports = function(req, res){
    db.Category.find(req.params.category_id).success(function(category){
        res.json(category);
    });
};