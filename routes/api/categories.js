var sqlite3 = require("sqlite3").verbose();

module.exports = function(req, res){
    var fs = require("fs");
    var file = "db.test.sqlite";
    var db = new sqlite3.Database(file);

    db.all("SELECT * FROM categories", function(err, rows) {
        console.log(err);
        console.log(rows);
        res.json(rows);
    });
};