var db = require("../../db.js");

exports.get = function (req, res) {
}

exports.listCategories = function (req, res) {
    db.Category.findAll().success(function (categories) {
        res.statusCode = 200;
        res.json(categories);
    });
};

exports.createCategory = function (req, res) {
    if (!req.body.hasOwnProperty('title')) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    db.Category.find({ where: {title: req.body.title}}).success(function (category) {
        if (category === null){
            db.Category.create({ 
                title: req.body.title
            }).success(function (category) {
                res.statusCode = 200;
                res.json(category);
            });
        } else {
            res.statusCode = 400;
            return res.send('Error 400: duplicate category.');
        }
    });
}