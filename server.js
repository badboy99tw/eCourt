var express = require('express');
var fs = require('fs');

var port = process.env.PORT || 5566;

app = express();
app.use("/assets", express.static(__dirname + '/assets'));
app.listen(port);

app.get('/*', function(req, res){
    var filePath = 'index.html'
    var encode = 'utf-8';

    res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});

    fs.readFile(filePath, encode, function(err, file){
        res.write(file);
        res.end();
    });
});

console.log('Listening on ' + port + '...');
console.log('Press Ctrl + C to stop.');
