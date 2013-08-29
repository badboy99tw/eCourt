var async = require('async');
var db = require('../../db.js');

exports.getCauseOfLawsuit = function (req, res) {
    console.log(req.params);
    db.Lawsuit.find({where: {title: req.params.lawsuitId}}).success(function (lawsuit) {
        db.Cause.find(lawsuit.causeId).success(function (cause) {
            res.statusCode = 200;
            res.json(cause);
            res.end();
        });
    });
};

exports.addCauseToGroup = function (req, res) {
    async.parallel({
        group: function (callback) {
            db.Group.find({where: {title: req.params.groupId}}).success(function (group) {
                callback(null, group);
            });
        },
        cause: function (callback) {
            db.Cause.find({where: {title: req.params.causeId}}).success(function (cause) {
                callback(null, cause);
            });
        }
    }, function (err, results) {
        results.group.addCause(results.cause).success(function () {
            res.statusCode = 201;
            res.end();
        });
    });
};

exports.listCausesOfEvent = function (req, res) {
    db.Event.find({where: {title: req.params.eventId}}).success(function (event_) {
        event_.getCauses().success(function (causes) {
            res.statusCode = 200;
            res.json(causes);
            res.end();
        });
    });
};

exports.getCauseOfEvent = function (req, res) {
    db.Event.find({where: {title: req.params.eventId}}).success(function (event_) {
        event_.getCauses({where: {title: req.params.causeId}}).success(function (cause) {
            res.statusCode = 200;
            res.json(cause[0]);
            res.end();
        });
    });
};

exports.createCauseForEvent = function (req, res) {
    db.Event.find({where: {title: req.params.eventId}}).success(function (event_) {
        event_.getCauses({where: {title: req.body.title}}).success(function (causes) {
            if (causes.length === 0){
                db.Cause.create({
                    title: req.body.title
                }).success(function (cause){
                    event_.addCause(cause).success(function (){
                        res.statusCode = 200;
                        res.json(cause);
                        res.end();
                    });
                });
            } else {
                res.statusCode = 400;
                res.send('Error 400: duplicate cause.');
                res.end()
            }
        });
    });
};