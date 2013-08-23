var path = require('path');
var fs = require("fs");

module.exports = {};

var root = './routes/api/';
fs.readdirSync(root).forEach(function(file){
    var name = file.split('.')[0];
    var ext = path.extname(file);

    if (path.extname(file) != '.js' || file == 'index.js'){
        return;
    }
    module.exports[name] = require('./' + file);
});