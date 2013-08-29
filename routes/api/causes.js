var db = require("../../db.js");

exports.get = function (req, res) {
    res.statusCode = 99;
    res.end();
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