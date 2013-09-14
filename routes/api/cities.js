var db = require("../../db.js");

exports.getCityOfEvent = function (req, res) {
    db.Event.find({where: {title: req.params.eventId}}).success(function (event_) {
        db.City.find(event_.cityId).success(function (city) {
            res.statusCode = 200;
            res.json(city);
            res.end();
        });
    });
};

exports.listCities = function (req, res) {
    db.City.findAll().success(function (cities) {
        res.statusCode = 200;
        res.json(cities);
        res.end();
    });
};

exports.createCity = function (req, res) {
    if (!req.body.hasOwnProperty('title')) {
        res.statusCode = 400;
        res.send('Error 400: Post syntax incorrect.');
        res.end();
    }
    db.City.find({ where: {title: req.body.title}}).success(function (city) {
        if (city === null){
            console.log(req.body);
            db.City.create(req.body).success(function (city) {
                res.statusCode = 200;
                res.json(city);
                res.end();
            });
        } else {
            res.statusCode = 400;
            res.send('Error 400: duplicate city.');
            res.end();
        }
    });
}