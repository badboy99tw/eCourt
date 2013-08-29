var db = require('../../db.js');

exports.get = function (req, res) {
    res.statusCode = 99;
    res.end();
};

exports.getLaw = function (req, res) {
    db.Law.find({where: {title: req.params.lawId}}).success(function (law) {
        res.statusCode = 200;
        res.json(law);
        res.end();
    });
};

exports.createLaw = function (req, res) {
    db.Law.find({where: {title: req.body.title}}).success(function (law) {
        if (law === null){
            db.Law.create(req.body).success(function (law) {
                res.statusCode = 201;
                res.json(law);
                res.end();
            });
        } else {
            res.statusCode = 400;
            res.send('Error 400: duplicated law');
            res.end();
        }
    });
}