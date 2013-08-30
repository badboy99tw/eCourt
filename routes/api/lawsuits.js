var async = require('async');
var db = require('../../db.js');
var utils = require('../../lib/utils.js');

exports.listLawsuitsOfCategory = function (req, res) {
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
            var allLawsuits = new Array();
            async.each(events, function (event_, callback){
                event_.getLawsuits().success(function (lawsuits) {
                    utils.union(allLawsuits, lawsuits);
                    callback(null);
                });
            }, function (err) {
                callback(err, allLawsuits);
            });
        }
    ], function (err, lawsuits) {
        res.statusCode = 200;
        res.json(lawsuits);
        res.end();
    });
};

exports.listLawsuits = function (req, res) {
    async.waterfall([
        function (callback) {
            db.Lawsuit.findAll()
                .success(function (lawsuits) {
                    callback(null, lawsuits);
                });
        }
    ], function (err, lawsuits) {
        res.statusCode = 200;
        res.json(lawsuits);
        res.end();
    });
};

exports.listLawsuitsOfGroup = function (req, res) {
    async.waterfall([
        function (callback) {
            db.Group.find({where: {title: req.params.groupId}})
                .success(function (group) {
                    callback(null, group);
                });
        },
        function (group, callback) {
            group.getLawsuits()
                .success(function (lawsuits) {
                    callback(null, lawsuits);
                });
        }
    ], function (err, lawsuits) {
        res.statusCode = 200;
        res.json(lawsuits);
        res.end();
    });
};

exports.listLawsuitsOfEvent = function (req, res) {
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
        }
    ], function (err, lawsuits) {
        res.statusCode = 200;
        res.json(lawsuits);
        res.end();
    });
};

exports.addLawsuitToGroup = function (req, res) {
    async.parallel({
        group: function (callback) {
            db.Group.find({where: {title: req.params.groupId}}).success(function (group) {
                callback(null, group);
            });
        },
        lawsuit: function (callback) {
            db.Lawsuit.find({where: {title: req.params.lawsuitId}}).success(function (lawsuit) {
                callback(null, lawsuit);
            });
        }
    }, function (err, results) {
        results.group.addLawsuit(results.lawsuit).success(function () {
            res.statusCode = 201;
            res.end();
        });
    });
}

exports.addLawsuitToEvent = function (req, res) {
    async.parallel({
        event_: function (callback) {
            db.Event.find({where: {title: req.params.eventId}}).success(function (event_) {
                callback(null, event_);
            });
        },
        lawsuit: function (callback) {
            db.Lawsuit.find({where: {title: req.params.lawsuitId}}).success(function (lawsuit) {
                callback(null, lawsuit);
            });
        }
    }, function (err, results) {
        results.event_.addLawsuit(results.lawsuit).success(function () {
            res.statusCode = 201;
            res.end();
        });
    });
}

exports.listLawsuitsOfLaw = function (req, res) {
    async.waterfall([
        function (callback) {
            db.Law.find({where: {title: req.params.lawId}})
                .success(function (law) {
                    callback(null, law);
                });
        },
        function (law, callback) {
            law.getLawsuits()
                .success(function (lawsuits) {
                    callback(null, lawsuits);
                });
        }
    ], function (err, lawsuits) {
        res.statusCode = 200;
        res.json(lawsuits);
        res.end();
    });
};

exports.getLawsuit = function (req, res) {
    db.Lawsuit.find({where: {title: req.params.lawsuitId}}).success(function (lawsuit) {
        res.statusCode = 200;
        res.json(lawsuit);
        res.end();
    });
}

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