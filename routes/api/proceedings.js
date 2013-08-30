var async = require('async');
var db = require('../../db.js');

exports.get = function (req, res) {
    res.statusCode = 99;
    res.end();
};

exports.getProceedingOfLawsuit = function (req, res) {
    async.waterfall([
        function (callback) {
            db.Lawsuit.find({where: {title: req.params.lawsuitId}})
                .success(function (lawsuit) {
                    callback(null, lawsuit);
                });
        },
        function (lawsuit, callback) {
            db.Proceeding.find(lawsuit.proceedingsId)
                .success(function (proceeding) {
                    callback(null, proceeding);
                });
        }
    ], function (err, proceeding) {
        res.statusCode = 200;
        res.json(proceeding);
        res.end();
    });
};

exports.addProceedingToLawsuit = function (req, res) {
    async.parallel({
        proceeding: function (callback) {
            db.Proceeding.find({where: {title: req.params.proceedingId}}).success(function (proceeding) {
                callback(null, proceeding);
            });
        },
        lawsuit: function (callback) {
            db.Lawsuit.find({where: {title: req.params.lawsuitId}}).success(function (lawsuit) {
                callback(null, lawsuit);
            });
        }
    }, function (err, results) {
        results.proceeding.addLawsuit(results.lawsuit).success(function () {
            res.statusCode = 201;
            res.end();
        });
    });
};

exports.listProceedings = function (req, res) {
    db.Proceeding.findAll().success(function (proceedings) {
        res.statusCode = 200;
        res.json(proceedings);
        res.end();
    });
}

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