var db = require('../../db.js');

exports.get = function(req, res){
    res.statusCode = 99;
    res.end();
};

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