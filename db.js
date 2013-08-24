var async = require('async');
var Sequelize = require('sequelize');
var S = require('string');
var rand = require('./rand.js');
var fs = require('fs');

var TEST_DB = '/tmp/test.db';

fs.unlink(TEST_DB, function(err){
    if (err) throw err;
    console.log('successfully deleted ' + TEST_DB);
});

// connect to db
var sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: TEST_DB,
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

var NUM_LAWSUITS = 20;
var NUM_GROUPS = 10;
var NUM_CATEGORIES = 10;

var createTestData = function(callback){
    console.log('createTestData is called');
    async.series([
        function(callback){
            async.times(NUM_LAWSUITS, function(n, next){
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
            async.times(NUM_CATEGORIES, function(n, next){
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
            async.times(NUM_GROUPS, function(n, next){
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

var catpialize = function(string){
    return S(string).capitalize().s
}

var createTestRelationBetween = function(Parent, Child, time, rand_min, rand_max, callback){
    Parent.findAll().success(function(parents){
        async.each(parents, function(parent, callback){
            async.timesSeries(time, function(n, next){
                var rand_id = rand.randint(rand_min, rand_max);
                Child.find(rand_id).success(function(child){
                    console.log('---> find ' + child.id);
                    parent['has' + catpialize(Child.name)](child).success(function(result){
                        if(result == true){
                            next(null);
                            return;
                        }
                        console.log('---> not has ' + child.id);
                        parent['add' + catpialize(Child.name)](child).success(function(){
                            console.log('---> set ' + child.id);
                            next(null);
                        }).error(function(err){
                            console.log(err);
                            next(null);
                        });
                    }).error(function(err){
                        console.log(err);
                        next(null);
                    });
                });
            }, function(err){ // error handle of async.times
                callback(err);
            });
        }, function(err){ // error handle of async.each
            callback(err);
        });
    }).error(function(err){ // error handle of Parent.findall
        callback(err);
    });
}

var createTestRelations = function(callback){
    async.parallel([
        function(callback){
            createTestRelationBetween(Category, Lawsuit, 5, 1, NUM_LAWSUITS, function(err){
                callback(err);
            });
        },
        function(callback){
            createTestRelationBetween(Group, Lawsuit, 5, 1, NUM_LAWSUITS, function(err){
                callback(err);
            });
        },
        function(callback){
            createTestRelationBetween(Category, Group, 5, 1, NUM_GROUPS, function(err){
                callback(err);
            });
        }
    ], 
    function(err){
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
        createTestRelations();
    });
});

// exports
exports.Lawsuit = Lawsuit;
exports.Category = Category;
exports.Group = Group;
