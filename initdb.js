var sqlite3 = require("sqlite3").verbose();
var rand = require("./rand");
var fs = require("fs");

var dbFile = "test.db";
var exists = fs.existsSync(dbFile);

if(!exists) {
    console.log("Creating DB file.");
    fs.openSync(dbFile, "w");
}

var db = new sqlite3.Database(dbFile);

db.serialize(function() {
    if(!exists) {
        db.run("CREATE TABLE categories(name TEXT);");
        var stmt = db.prepare("INSERT INTO categories VALUES (?)");

        //Insert random data
        for (var i = 0; i < 10; i++) {
            stmt.run(rand.randstr(4));
        }

        stmt.finalize();
        db.each("SELECT * FROM categories", function(err, row) {
            console.log(row);
        });
    }
});

db.close();

db = new sqlite3.Database(dbFile);

exports.db = db;