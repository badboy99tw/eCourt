var async = require('async');
var db = require('../../db.js');

exports.get = function (req, res) {
    res.statusCode = 99;
    res.end();
};

exports.addLawsuitToCause = function (req, res) {
    async.parallel({
        event_: function (callback) {
            db.Event.find({where: {title: req.params.eventId}}).success(function (event_) {
                callback(null, event_);
            });
        },
        lawsuit: function (callback) {
            db.Lawsuit.find({where: {title: req.params.lawsuitId}}).success(function (lawsuit) {
                callback(null, lawsuit);
            });
        }
    }, function (err, results) {
        results.event_.getCauses({where: {title: req.params.causeId}}).success(function (causes) {
            causes[0].addLawsuit(results.lawsuit).success(function () {
                res.statusCode = 201;
                res.end();
            });
        });
    });
};

exports.getLawsuit = function (req, res) {
    db.Lawsuit.find({where: {title: req.params.lawsuitId}}).success(function (lawsuit) {
        res.statusCode = 200;
        res.json(lawsuit);
        res.end();
    });
}

exports.createLawsuit = function (req, res) {
    db.Lawsuit.find({where: {title: req.body.title}}).success(function (lawsuit) {
        if (lawsuit === null) {
            db.Lawsuit.create(req.body).success(function (newLawsuit) {
                res.statusCode = 201;
                res.json(newLawsuit);
                res.end();
            });
        } else {
            res.statusCode = 400;
            res.send('Error 400: duplicated lawsuit');
            res.end();
        }
    });
};