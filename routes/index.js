
/*
 * GET home page.
 */

var fs = require("fs");

exports.index = function(req, res){
	var filePath = 'index.html'
    var encode = 'utf-8';

    res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});

    fs.readFile(filePath, encode, function(err, file){
        res.write(file);
        res.end();
    });
};