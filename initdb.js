var sqlite3 = require("sqlite3").verbose();
var rand = require("./rand");
var fs = require("fs");

var dbFile = "test.db";
var exists = fs.existsSync(dbFile);

if (exists){
    fs.unlinkSync(dbFile);
}
exists = fs.existsSync(dbFile);

if(!exists) {
    console.log("Creating DB file.");
    fs.openSync(dbFile, "w");
}

var db = new sqlite3.Database(dbFile);

db.serialize(function() {
    if(!exists) {
        // create db for lawsuits
        db.run('CREATE TABLE lawsuits(id INTEGER PRIMARY KEY, court TEXT, type TEXT, year INTEGER, word TEXT, num INTEGER, content TEXT);');
        var stmt = db.prepare("INSERT INTO lawsuits (court, type, year, word, num, content) VALUES (?, ?, ?, ?, ?, ?)");

        for (var i = 0; i < 10; i++) {
            stmt.run(
                rand.randstr(6), // court name 
                rand.randstr(10), // case name
                rand.randint(1911, 2013), // year
                rand.randstr(1), // word
                rand.randint(1, 3000), // num
                rand.randstr(500)); // content
        }
        stmt.finalize();

        db.each("SELECT * FROM lawsuits", function(err, row) {
            console.log(row);
        });

        // create db for categories
        db.run("CREATE TABLE categories(id INTEGER PRIMARY KEY, name TEXT);");
        var stmt = db.prepare("INSERT INTO categories (name) VALUES (?)");

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