var async = require('async');
var db = require('../../db.js');
var utils = require('../../lib/utils.js');

exports.listLaws = function (req, res) {
    async.waterfall([
        function (callback) {
            db.Law.findAll()
                .success(function (laws) {
                    callback(null, laws);
                });
        }
    ], function (err, laws) {
        res.statusCode = 200;
        res.json(laws);
        res.end();
    });
};

exports.listLawsOfLawsuit = function (req, res) {
    async.waterfall([
        function (callback) {
            db.Lawsuit.find({where: {title: req.params.lawsuitId}})
                .success(function (lawsuit) {
                    callback(null, lawsuit);
                });
        },
        function (lawsuit, callback) {
            lawsuit.getLaws()
                .success(function (laws) {
                    callback(null, laws);
                });
        }
    ], function (err, laws) {
        res.statusCode = 200;
        res.json(laws);
        res.end();
    });
};

exports.listLawsOfEvent = function (req, res) {
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
            var lawsAll = [];
            async.each(lawsuits, function (lawsuit, callback) {
                lawsuit.getLaws()
                    .success(function (laws) {
                        lawsAll = utils.union(lawsAll, laws);
                        callback(null);
                    });
            }, function (err) {
                callback(null, lawsAll);
            });
        }
    ], function (err, laws) {
        res.statusCode = 200;
        res.json(laws);
        res.end();
    });
};

exports.listLawsOfCategory = function (req, res) {
    async.waterfall([
        function (callback) {
            db.Category.find({where: {title: req.params.categoryId}})
                .success(function (category) {
                    callback(null, category);
                });
        },
        function (category, callback) {
            category.getEvents()
                .success(function (events) {
                    callback(null, events);
                });
        },
        function (events, callback) {
            var lawsuitsAll = [];
            async.each(events, function (event_, callback) {
                event_.getLawsuits()
                    .success(function (lawsuits) {
                        lawsuitsAll = utils.union(lawsuitsAll, lawsuits);
                        callback(null);
                    });
            }, function (err) {
                callback(null, lawsuitsAll);
            });
        },
        function (lawsuits, callback) {
            var lawsAll = [];
            async.each(lawsuits, function (lawsuit, callback) {
                lawsuit.getLaws()
                    .success(function (laws) {
                        lawsAll = utils.union(lawsAll, laws);
                        callback(null);
                    });
            }, function (err) {
                callback(null, lawsAll);
            });
        }
    ], function (err, laws) {
        res.statusCode = 200;
        res.json(laws);
        res.end();
    });
};

exports.addLawToLawsuit = function (req, res) {
    async.parallel({
        law: function (callback) {
            db.Law.find({where: {title: req.params.lawId}}).success(function (law) {
                callback(null, law);
            });
        },
        lawsuit: function (callback) {
            db.Lawsuit.find({where: {title: req.params.lawsuitId}}).success(function (lawsuit) {
                callback(null, lawsuit);
            });
        }
    }, function (err, results) {
        results.lawsuit.addLaw(results.law).success(function () {
            res.statusCode = 201;
            res.end();
        });
    });
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