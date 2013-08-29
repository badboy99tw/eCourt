var db = require('../../db.js');

exports.get = function (req, res) {
    res.statusCode = 99;
    res.end();
};

exports.createProceeding = function (req, res) {
    db.Proceeding.find({where: {title: req.body.title}}).success(function (proceeding) {
        if (proceeding === null) {
            db.Proceeding.create(req.body).success(function (newProceeding) {
                res.statusCode = 201;
                res.json(newProceeding);
                res.end();
            });
        } else {
            res.statusCode = 400;
            res.send('Error 400: duplicated proceeding');
            res.end();
        }
    });
};