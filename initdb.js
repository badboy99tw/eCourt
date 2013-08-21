var sqlite3 = require("sqlite3").verbose();
var Nonsense = require("Nonsense");
var fs = require("fs");

var dbFile = "/tmp/test.db";
var exists = fs.existsSync(dbFile);

if(!exists) {
    console.log("Creating DB file.");
    fs.openSync(dbFile, "w");
}

var db = new sqlite3.Database(dbFile);
var ns = new Nonsense();

db.serialize(function() {
    if(!exists) {
        db.run("CREATE TABLE categories(name TEXT);");
        var stmt = db.prepare("INSERT INTO categories VALUES (?)");

        //Insert random data
        var categories = ['食品安全', '自然災害', '環境污染', '生態公害', '司法改革', '再生能源', '基本人權', '文化保護', '勞資爭議', '土地正義'];
        for (var i = 0; i < categories.length; i++) {
            stmt.run(categories[i]);
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