var async = require('async');
var db = require('../../db.js');
var utils = require('../../lib/utils.js');

exports.listCausesOfEvent = function (req, res) {
    async.waterfall([
        function (callback) {
            db.Event.find({where: {title: req.params.eventId}})
                .success(function (event_) {
                    callback(null, event_);
                });
        },
        function (event_, callback) {
            event_.getLawsuits()
                .success(function (lawsuits) {
                    callback(null, lawsuits);
                });
        },
        function (lawsuits, callback) {
            utils.createCausesFromLawsuits(lawsuits, function (causes) {
                callback(null, causes);
            });
        }
    ], function (err, causes) {
        res.statusCode = 200;
        res.json(causes);
        res.end();
    });
};
