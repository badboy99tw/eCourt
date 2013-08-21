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

Group.hasMany(Lawsuit, {joinTableName: 'groups_lawsuits'});
Lawsuit.hasMany(Group, {joinTableName: 'groups_lawsuits'});

Category.hasMany(Lawsuit, {joinTableName: 'categories_lawsuits'});
Lawsuit.hasMany(Category, {joinTableName: 'categories_lawsuits'});

Category.hasMany(Group, {joinTableName: 'categories_groups'});
Group.hasMany(Category, {joinTableName: 'categories_groups'});

// initialize database
var init = function(callback){
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
    ], 
    function(err, result){
        if(callback){
            callback(err);
        }
    });
}

var createTestData = function(callback){
    async.series([
        function(callback){
            async.times(20, function(){
                Lawsuit.create({ 
                    title: (rand.randstr(6) + '(判決名稱)'),
                    court: (rand.randstr(6) + '(法院名稱)'),
                    type: rand.randstr(2),
                    year: rand.randint(1911, 2013),
                    word: rand.randstr(1),
                    num: rand.randint(1, 3000),
                    content: rand.randstr(1000)
                });
            }, callback(null));
        },
        function(callback){
            async.times(10, function(){
                Category.create({ 
                    title: (rand.randstr(4) + '(類別)') 
                }).success(function(category){
                    console.log(category.title);
                });
            }, callback(null));
        },
        function(callback){
            async.times(10, function(callback){
                Group.create({ 
                    title: (rand.randstr(4) + '(團體名稱)') 
                });
            }, callback(null));
        }
    ], 
    function(err, result){
        if(callback){
            callback(err);
        }
    });
}

init(function(){
    createTestData();
});

// exports
exports.Lawsuit = Lawsuit;
exports.Category = Category;
exports.Group = Group;