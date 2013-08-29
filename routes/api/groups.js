var db = require("../../db.js");

exports.get = function (req, res) {
    res.statusCode = 99;
    res.end();
};

exports.createGroup = function (req, res) {
    db.Group.find({where: {title: req.body.title}}).success(function (group) {
        if (group === null){
            db.Group.create(req.body).success( function (newGroup) {
                res.statusCode = 200;
                res.json(newGroup);
                res.end();
            })
        } else {
            res.statusCode = 400;
            res.send('Error 400: duplicate group.');
            res.end()
        }
    });
};
