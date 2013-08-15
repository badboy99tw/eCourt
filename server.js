var util = require('util'),
    connect = require('connect');

var port = process.env.PORT || 5566;

connect.createServer(connect.static(__dirname)).listen(port);
util.puts('Listening on ' + port + '...');
util.puts('Press Ctrl + C to stop.');
