var db = require("../../db.js");

module.exports = function(req, res){
    db.Category.findAll().success(function(categories) {
        res.json(categories);
    });
};