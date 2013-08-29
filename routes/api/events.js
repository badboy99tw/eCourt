var db = require("../../db.js");

exports.get = function (req, res) {
    res.statusCode = 99;
    res.end();
}

exports.getEventByTitle = function (req, res) {
    db.Event.find({where: {title: req.params.eventId}}).success(function (event_) {
        if (event_ === null){
            res.statusCode = 400;
            res.send('Error 400: Not found.');
            res.end();
        } else {
            res.statusCode = 200;
            console.log(event_)
            res.json(event_);
            res.end();
        }
    }).error(function (err){
        res.statusCode = 500;
        res.send('Error 500: Query DB error.');
        res.end();
    });
};

exports.createEvent = function(req, res){
    if (!req.body.hasOwnProperty('title') ||
        !req.body.hasOwnProperty('url')) {
        res.statusCode = 400;
        res.send('Error 400: Post syntax incorrect.');
        res.end();
    }
    db.Event.find({ where: {title: req.body.title}}).success(function (event_) {
        if (event_ === null){
            db.Event.create({ 
                title: req.body.title,
                url: req.body.url
            }).success(function (event_) {
                res.statusCode = 200;
                res.json(event_);
                res.end();
            });
        } else {
            res.statusCode = 400;
            res.send('Error 400: duplicate event.');
            res.end();
        }
    });
};

exports.addEventToCategory = function (req, res) {
    db.Event.find({ where: {title: req.params.eventId}}).success(function (event_) {
        db.Category.find({ where: {title: req.params.categoryId}}).success(function (category) {
            category.addEvent(event_);
            res.statusCode = 201;
            res.end();
        });
    });
}