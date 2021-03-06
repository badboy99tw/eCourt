var async = require('async');
var Sequelize = require('sequelize');

var TEST_DB = '/tmp/test.db';

// connect to db
var sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: TEST_DB,
    language: 'en'
});

// Models
var Category = sequelize.define('categories', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING
});

var City = sequelize.define('cities', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING
});

var Event = sequelize.define('events', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    lat: Sequelize.FLOAT,
    lng: Sequelize.FLOAT,
    url: Sequelize.TEXT
});

var Group = sequelize.define('groups', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    intro: Sequelize.TEXT,
    url: Sequelize.TEXT
});

var Law = sequelize.define('laws', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    article: Sequelize.TEXT
});

var Lawsuit = sequelize.define('lawsuits', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    cause: Sequelize.STRING,
    proceeding: Sequelize.STRING,
    date: Sequelize.DATE,
    article: Sequelize.TEXT,
});

var Proceeding = sequelize.define('proceedings', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    order: Sequelize.INTEGER
});

function syncAll (options, callback) {
    async.parallel([
        function (callback) {
            Category.sync(options).done(function () {
                callback(null);
            });
        },
        function (callback) {
            City.sync(options).done(function () {
                callback(null);
            });
        },
        function (callback) {
            Event.sync(options).done(function () {
                callback(null);
            });
        },
        function (callback) {
            Group.sync(options).done(function () {
                callback(null);
            });
        },
        function (callback) {
            Law.sync(options).done(function () {
                callback(null);
            });
        },
        function (callback) {
            Lawsuit.sync(options).done(function () {
                callback(null);
            });
        },
        function (callback) {
            Proceeding.sync(options).done(function () {
                callback(null);
            });
        }
    ], function (err, results) {
        if (callback) {
            callback();
        }
    });
};

syncAll();

// Associations

// one-to-many
City.hasMany(Event);

// many-to-many
Category.hasMany(Event, {joinTableName: 'categories_events'});
Event.hasMany(Category, {joinTableName: 'categories_events'});

Event.hasMany(Group, {joinTableName: 'events_groups'});
Group.hasMany(Event, {joinTableName: 'events_groups'});

Event.hasMany(Lawsuit, {joinTableName: 'events_lawsuits'});
Lawsuit.hasMany(Event, {joinTableName: 'events_lawsuits'});

Group.hasMany(Lawsuit, {joinTableName: 'groups_lawsuits'});
Lawsuit.hasMany(Group, {joinTableName: 'groups_lawsuits'});

Lawsuit.hasMany(Law, {joinTableName: 'lawsuits_laws'});
Law.hasMany(Lawsuit, {joinTableName: 'lawsuits_laws'});

// exports
exports.Category = Category;
exports.City = City;
exports.Event = Event;
exports.Group = Group;
exports.Law = Law;
exports.Lawsuit = Lawsuit;
exports.Proceeding = Proceeding;
exports.syncAll = syncAll;
