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
Category.sync();

var Cause = sequelize.define('causes', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING
});
Cause.sync();

var Event = sequelize.define('events', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    url: Sequelize.TEXT
});
Event.sync();

var Group = sequelize.define('groups', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    intro: Sequelize.TEXT,
    url: Sequelize.TEXT
});
Group.sync();

var Law = sequelize.define('laws', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    article: Sequelize.TEXT
});
Law.sync();

var Lawsuit = sequelize.define('lawsuits', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    date: Sequelize.DATE,
    article: Sequelize.TEXT,
});
Lawsuit.sync();

var Proceeding = sequelize.define('proceedings', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    order: Sequelize.INTEGER
});
Proceeding.sync();

// Associations

// one-to-one
Lawsuit.hasOne(Proceeding);


// one-to-many
Cause.hasMany(Lawsuit);

// many-to-many
Category.hasMany(Event, {joinTableName: 'categories_events'});
Event.hasMany(Category, {joinTableName: 'categories_events'});

Event.hasMany(Group, {joinTableName: 'events_groups'});
Group.hasMany(Event, {joinTableName: 'events_groups'});

Event.hasMany(Cause, {joinTableName: 'events_causes'});
Cause.hasMany(Event, {joinTableName: 'events_causes'});

Group.hasMany(Cause, {joinTableName: 'groups_causes'});
Cause.hasMany(Group, {joinTableName: 'groups_causes'});

Lawsuit.hasMany(Law, {joinTableName: 'lawsuits_laws'});
Law.hasMany(Lawsuit, {joinTableName: 'lawsuits_laws'});

// exports
exports.Category = Category;
exports.Cause = Cause;
exports.Event = Event;
exports.Group = Group;
exports.Law = Law;
exports.Lawsuit = Lawsuit;
exports.Proceeding = Proceeding;
