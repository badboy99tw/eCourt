
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 5566);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.home);
app.get('/lawsuit/:lawsuit_id', routes.lawsuit);
app.get('/category/:category_id/lawsuits', routes.category_lawsuits);
app.get('/api/categories', routes.api.categories);
app.get('/api/category/:category_id/lawsuits', routes.api.category_lawsuits);
app.get('/api/category/:category_id/groups', routes.api.category_groups);
app.get('/api/category/:category_id', routes.api.category);
app.get('/api/groups', routes.api.groups);
app.get('/api/group/:group_id/lawsuits', routes.api.group_lawsuits);
app.get('/api/group/:group_id', routes.api.group.get);
app.get('/api/lawsuits', routes.api.lawsuits);
app.get('/api/lawsuit/:lawsuit_id', routes.api.lawsuit.get);

app.post('/api/lawsuit', routes.api.lawsuit.post);
app.post('/api/group', routes.api.group.post);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    console.log('Press Ctrl + C to stop.');
});
