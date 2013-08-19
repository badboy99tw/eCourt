var initdb = require("../../initdb.js");

var db = initdb.db;

module.exports = function(req, res){
    db.all("SELECT * FROM categories", function(err, rows) {
        console.log(err);
        console.log(rows);
        res.json(rows);
    });
};