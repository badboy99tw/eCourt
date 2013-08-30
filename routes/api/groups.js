var async = require('async');
var db = require('../../db.js');

exports.listGroupsOfEvent = function (req, res) {
    async.parallel({
        event_: function (callback) {
            db.Event.find({where: {title: req.params.eventId}})
                .success(function (event_) {
                    callback(null, event_);
                });
        }
    }, function (err, results) {
        results.event_.getGroups()
            .success(function (groups) {
                res.statusCode = 200;
                res.json(groups);
                res.end();
            });
    });
};

function union (array, arrayOut) {
    for (var itemOutIndex in arrayOut) {
        var itemOut = arrayOut[itemOutIndex];
        var isExist = false;
        for (var itemIndex in array) {
            var item = array[itemIndex];
            if (item.id === itemOut.id) {
                isExist = true;
            }
        } 
        if (isExist === false) {
            array.push(itemOut);
        }
    }
    return array;
}

exports.listGroupsOfCategory = function (req, res) {
    db.Category.find({where: {title: req.params.categoryId}}).success(function (category) {
        category.getEvents().success(function (events) {
            var allGroups = new Array();
            async.each(events, function (event_, callback){
                event_.getGroups().success(function (groups) {
                    union(allGroups, groups);
                    console.log(groups);
                    console.log(allGroups);
                    callback(null, groups);
                });
            }, function (err) {
                res.statusCode = 200;
                res.json(allGroups);
                res.end();
            }); 
        });
    });
};

exports.getGroup = function (req, res) {
    db.Group.find({where: {title: req.params.groupId}}).success(function (group) {
        res.statusCode = 200;
        res.json(group);
        res.end();
    });
};

exports.addGroupToEvent = function (req, res) {
    async.series({
        group: function (callback) {
            db.Group.find({where: {title: req.params.groupId}}).success(function (group) {
                callback(null, group);
            });
        },
        event_: function (callback) {
            db.Event.find({where: {title: req.params.eventId}}).success(function (event_) {
                callback(null, event_);
            });
        }
    }, function (err, results) {
        results.event_.addGroup(results.group).success(function () {
            res.statusCode = 201;
            res.end();
        });    
    });
}

exports.createGroup = function (req, res) {
    db.Group.find({where: {title: req.body.title}}).success(function (group) {
        if (group === null){
            db.Group.create(req.body).success( function (newGroup) {
                res.statusCode = 200;
                res.json(newGroup);
                res.end();
            })
        } else {
            res.statusCode = 400;
            res.send('Error 400: duplicate group.');
            res.end()
        }
    });
};
