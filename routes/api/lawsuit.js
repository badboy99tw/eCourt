var db = require("../../db.js");

module.exports = function(req, res){
    db.Lawsuit.find(req.params.lawsuit_id).success(function(lawsuit) {
        res.json(lawsuit);
    });
};