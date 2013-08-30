var db = require("../../db.js");

exports.getCategory = function (req, res) {
    db.Category.find({where: {title: req.params.categoryId}})
        .success(function (category) {
            res.statusCode = 200;
            res.json(category);
            res.end();
        });
};

exports.listCategoriesOfEvent = function (req, res) {
    db.Event.find({where: {title: req.params.eventId}}).success(function (event_) {
        event_.getCategories().success(function (categories) {
            res.statusCode = 200;
            res.json(categories);
            res.end();
        });
    });
};

exports.listCategories = function (req, res) {
    db.Category.findAll().success(function (categories) {
        res.statusCode = 200;
        res.json(categories);
        res.end();
    });
};

exports.createCategory = function (req, res) {
    if (!req.body.hasOwnProperty('title')) {
        res.statusCode = 400;
        res.send('Error 400: Post syntax incorrect.');
        res.end();
    }
    db.Category.find({ where: {title: req.body.title}}).success(function (category) {
        if (category === null){
            db.Category.create({ 
                title: req.body.title
            }).success(function (category) {
                res.statusCode = 200;
                res.json(category);
                res.end();
            });
        } else {
            res.statusCode = 400;
            res.send('Error 400: duplicate category.');
            res.end();
        }
    });
}