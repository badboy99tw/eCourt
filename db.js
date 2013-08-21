var async = require('async');
var Sequelize = require('sequelize');
var rand = require('./rand.js');

// connect to db
var sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: './test.db',
    language: 'en'
});

// define schema
var Lawsuit = sequelize.define('lawsuit', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    title: Sequelize.TEXT,
    court: Sequelize.TEXT,
    type: Sequelize.TEXT,
    year: Sequelize.INTEGER,
    word: Sequelize.TEXT,
    num: Sequelize.INTEGER,
    content: Sequelize.TEXT
});

var Category = sequelize.define('category', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    title: Sequelize.TEXT    
});

var Group = sequelize.define('group', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    title: Sequelize.TEXT,
    address: Sequelize.TEXT 
});

// initialize database
async.series([
    function(callback){
        Lawsuit.sync({force: true}).on('success', function(){
            callback(null);
        });
    },
    function(callback){
        Category.sync({force: true}).on('success', function(){
            callback(null);
        });
    },
    function(callback){
        Group.sync({force: true}).on('success', function(){
            callback(null);
        });
    }
], function(callback){
    // create fake data
    async.times(20, function(callback){
        Lawsuit.create({ 
            title: (rand.randstr(6) + '(判決名稱)'),
            court: (rand.randstr(6) + '(法院名稱)'),
            type: rand.randstr(2),
            year: rand.randint(1911, 2013),
            word: rand.randstr(1),
            num: rand.randint(1, 3000),
            content: rand.randstr(10)
        });
    });

    async.times(10, function(callback){
        Category.create({ 
            title: (rand.randstr(4) + '(類別)') 
        });
    });

    async.times(10, function(callback){
        Group.create({ 
            title: (rand.randstr(4) + '(團體名稱)') 
        });
    });
});

// exports
exports.Lawsuit = Lawsuit;
exports.Category = Category;
exports.Group = Group;