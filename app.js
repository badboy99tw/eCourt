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
app.get('/categories/:categoryId/', routes.categories);
app.get('/mapview', routes.mapview);
app.get('/lawsuits/:lawsuitId', routes.lawsuits.showOne);
app.get('/categories/:categoryId/lawsuits', routes.lawsuits.listAll);

// APIs
// categories
app.post('/api/categories', routes.api.categories.createCategory);
app.get('/api/categories', routes.api.categories.listCategories);
app.get('/api/categories/:categoryId', routes.api.categories.getCategory);
app.get('/api/events/:eventId/categories', routes.api.categories.listCategoriesOfEvent);

// cities
app.post('/api/cities', routes.api.cities.createCity);
app.get('/api/cities', routes.api.cities.listCities);
app.get('/api/events/:eventId/cities', routes.api.cities.getCityOfEvent);

// events
app.post('/api/events', routes.api.events.createEvent);
app.post('/api/categories/:categoryId/events/:eventId', routes.api.events.addEventToCategory);
app.post('/api/cities/:cityId/events/:eventId', routes.api.events.addEventToCity);
app.post('/api/groups/:groupId/events/:eventId', routes.api.events.addEventToGroup);
app.get('/api/events', routes.api.events.listEvents);
app.get('/api/events/:eventId', routes.api.events.getEvent);
app.get('/api/categories/:categoryId/events', routes.api.events.listEventsOfCategory);
app.get('/api/cities/:cityId/events', routes.api.events.listEventsOfCity);
app.get('/api/groups/:groupId/events', routes.api.events.listEventsOfGroup);

// groups
app.post('/api/groups', routes.api.groups.createGroup);
app.post('/api/events/:eventId/groups/:groupId', routes.api.groups.addGroupToEvent);
app.get('/api/groups', routes.api.groups.listGroups);
app.get('/api/groups/:groupId', routes.api.groups.getGroup);
app.get('/api/categories/:categoryId/groups', routes.api.groups.listGroupsOfCategory);
app.get('/api/events/:eventId/groups', routes.api.groups.listGroupsOfEvent);

// laws
app.post('/api/laws', routes.api.laws.createLaw);
app.post('/api/lawsuits/:lawsuitId/laws/:lawId', routes.api.laws.addLawToLawsuit);
app.get('/api/laws', routes.api.laws.listLaws);
app.get('/api/laws/:lawId', routes.api.laws.getLaw);
app.get('/api/categories/:categoryId/laws', routes.api.laws.listLawsOfCategory);
app.get('/api/lawsuits/:lawsuitId/laws', routes.api.laws.listLawsOfLawsuit);

// lawsuits
app.post('/api/lawsuits', routes.api.lawsuits.createLawsuit);
app.post('/api/events/:eventId/lawsuits/:lawsuitId', routes.api.lawsuits.addLawsuitToEvent);
app.post('/api/groups/:groupId/lawsuits/:lawsuitId', routes.api.lawsuits.addLawsuitToGroup);
app.get('/api/lawsuits', routes.api.lawsuits.listLawsuits);
app.get('/api/lawsuits/:lawsuitId', routes.api.lawsuits.getLawsuit);
app.get('/api/categories/:categoryId/lawsuits', routes.api.lawsuits.listLawsuitsOfCategory);
app.get('/api/events/:eventId/lawsuits', routes.api.lawsuits.listLawsuitsOfEvent);
app.get('/api/groups/:groupId/lawsuits', routes.api.lawsuits.listLawsuitsOfGroup);
app.get('/api/laws/:lawId/lawsuits', routes.api.lawsuits.listLawsuitsOfLaw);

// proceedings
app.post('/api/proceedings', routes.api.proceedings.createProceeding);
app.get('/api/proceedings', routes.api.proceedings.listProceedings);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    console.log('Press Ctrl + C to stop.');
});
