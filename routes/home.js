var initdb = require("../initdb.js");

var db = initdb.db;

module.exports = function(req, res){
    db.all("SELECT * FROM categories", function(err, rows) {
        console.log(rows);
        res.render('index', { title: 'eCourt', types: rows });
    });
};