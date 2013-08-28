var db = require("../../db.js");

exports.get = function(req, res){
};

exports.createEvent = function(req, res){
    if (!req.body.hasOwnProperty('title') ||
        !req.body.hasOwnProperty('url')) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    db.Event.find({ where: {title: req.body.title}}).success(function (event_) {
        if (event_ === null){
            db.Event.create({ 
                title: req.body.title,
                url: req.body.url
            }).success(function (event_) {
                res.statusCode = 200;
                res.json(event_);
            });
        } else {
            res.statusCode = 400;
            return res.send('Error 400: duplicate event.');
        }
    });
};