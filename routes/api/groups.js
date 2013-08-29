var async = require('async');
var db = require("../../db.js");

exports.get = function (req, res) {
    res.statusCode = 99;
    res.end();
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
