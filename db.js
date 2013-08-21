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
Lawsuit.sync({force: true}).success(function(){
    for(var i = 0; i < 20; i++){
        Lawsuit.create({ 
            title: (rand.randstr(6) + '(判決名稱)'),
            court: (rand.randstr(6) + '(法院名稱)'),
            type: rand.randstr(2),
            year: rand.randint(1911, 2013),
            word: rand.randstr(1),
            num: rand.randint(1, 3000),
            content: rand.randstr(1000)
        });
    }
});

Category.sync({force: true}).success(function(){
    for(var i = 0; i < 10; i++){
        Category.create({ 
            title: (rand.randstr(4) + '(類別)') 
        });
    }
});

Group.sync({force: true}).success(function(){
    for(var i = 0; i < 10; i++){
        Group.create({ 
            title: (rand.randstr(4) + '(團體名稱)') 
        });
    }
});

// exports
exports.Lawsuit = Lawsuit;
exports.Category = Category;
exports.Group = Group;