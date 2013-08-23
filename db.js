var async = require('async');
var Sequelize = require('sequelize');
var rand = require('./rand.js');

// connect to db
var sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: '/tmp/test.db',
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
    console.log('init is called');
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
        console.log('init is done');
        if(callback){
            callback(err);
        }
    });
}

var createTestData = function(callback){
    console.log('createTestData is called');
    async.series([
        function(callback){
            async.times(20, function(n, next){
                Lawsuit.create({ 
                    title: (rand.randstr(6) + '(判決名稱)'),
                    court: (rand.randstr(6) + '(法院名稱)'),
                    type: rand.randstr(2),
                    year: rand.randint(1911, 2013),
                    word: rand.randstr(1),
                    num: rand.randint(1, 3000),
                    content: rand.randstr(1000)
                }).success(function(lawsuit){
                    next(null);
                });
            }, function(err){
                callback(err);
            });
        },
        function(callback){
            async.times(10, function(n, next){
                Category.create({ 
                    title: (rand.randstr(4) + '(類別)') 
                }).success(function(category){
                    next(null);
                });
            }, function(err){
                callback(err);
            });
        },
        function(callback){
            async.times(10, function(n, next){
                Group.create({ 
                    title: (rand.randstr(4) + '(團體名稱)') 
                }).on('success', function(group){
                    next(null);
                });
            }, function(err){
                callback(err);
            });
        }
    ], 
    function(err, result){
        console.log('createTestData is done');
        if(callback){
            callback(err);
        }
    });
}

var createTestRelation = function(callback){
    console.log('createTestRelation is called');
    async.series([
        function(callback){
            // find all categories
            Category.findAll().success(function(categories){
                // for each category
                console.log('for each category');
                console.log(categories.length);
                async.each(categories, function(category, callback){
                    // create five lawsuit relations
                    console.log('create five lawsuit relations');
                    async.times(5, function(n, next){
                        Lawsuit.find(rand.randint(1, 10)).success(function(lawsuit){
                            next(null, lawsuit);
                        }).error(function(err){
                            next(err);
                        });
                    }, function(err, lawsuits){
                        category.setLawsuits(lawsuits).success(function(){
                            callback(null);
                        }).error(function(err){
                            callback(err);
                        });
                    });
                }, function(err){
                    callback(err);
                });
            });
        }
    ], 
    function(err, result){
        console.log('createTestRelation is done');
        if(err){
            console.log(err);
        }
        if(callback){
            callback(err);
        }
    });
}

init(function(err){
    createTestData(function(err){
        createTestRelation();
    });
});

// exports
exports.Lawsuit = Lawsuit;
exports.Category = Category;
exports.Group = Group;