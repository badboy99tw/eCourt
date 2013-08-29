/*jslint node: true */
'use strict';

var express = require('express');
var http = require('http');
var path = require('path');

var routes = require('./routes');

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
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

// Views
app.get('/', routes.home);
app.get('/lawsuit/:lawsuit_id', routes.lawsuit);
app.get('/category/:category_id/lawsuits', routes.category_lawsuits);

// APIs
// categories
app.post('/api/categories', routes.api.categories.createCategory);
app.get('/api/categories', routes.api.categories.listCategories);
app.get('/api/events/:eventId/categories', routes.api.categories.listCategoriesOfEvent);

// causes
app.post('/api/events/:eventId/causes', routes.api.causes.createCauseForEvent);
app.post('/api/groups/:groupId/causes/:causeId', routes.api.causes.addCauseToGroup);
app.get('/api/events/:eventId/causes/:causeId', routes.api.causes.getCauseOfEvent);
app.get('/api/categories/:categoryId/causes', routes.api.causes.get);
app.get('/api/events/:eventId/causes', routes.api.causes.listCausesOfEvent);
app.get('/api/lawsuits/:lawsuitId/causes', routes.api.causes.get);

// events
app.get('/api/events/:eventId', routes.api.events.getEvent);
app.get('/api/categories/:categoryId/events', routes.api.events.listEventsOfCategory);
app.get('/api/causes/:causeId/events', routes.api.events.get);
app.get('/api/groups/:groupId/events', routes.api.events.get);
app.post('/api/events', routes.api.events.createEvent);
app.post('/api/categories/:categoryId/events/:eventId', routes.api.events.addEventToCategory);

// groups
app.get('/api/groups/:groupId', routes.api.groups.getGroup);
app.get('/api/categories/:categoryId/groups', routes.api.groups.get);
app.get('/api/events/:eventId/groups', routes.api.groups.get);
app.post('/api/groups', routes.api.groups.createGroup);
app.post('/api/events/:eventId/groups/:groupId', routes.api.groups.addGroupToEvent);

// laws
app.post('/api/laws', routes.api.laws.createLaw);
app.post('/api/lawsuits/:lawsuitId/laws/:lawId', routes.api.laws.addLawToLawsuit);
app.get('/api/laws/:lawId', routes.api.laws.getLaw);
app.get('/api/categories/:categoryId/laws', routes.api.laws.get);
app.get('/api/lawsuits/:lawsuitId/laws', routes.api.laws.get);

// lawsuits
app.post('/api/lawsuits', routes.api.lawsuits.createLawsuit);
app.post('/api/events/:eventId/causes/:causeId/lawsuits/:lawsuitId', routes.api.lawsuits.addLawsuitToCause);
app.get('/api/lawsuits/:lawsuitId', routes.api.lawsuits.getLawsuit);
app.get('/api/laws/:lawId/lawsuits', routes.api.lawsuits.get);

// proceedings
app.post('/api/proceedings', routes.api.proceedings.createProceeding);
app.post('/api/lawsuits/:lawsuitId/proceedings/:proceedingId', routes.api.proceedings.addProceedingToLawsuit);
app.get('/api/proceedings', routes.api.proceedings.listProceedings);
app.get('/api/lawsuits/:lawsuitId/proceedings', routes.api.proceedings.get);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    console.log('Press Ctrl + C to stop.');
});
