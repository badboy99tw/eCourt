var db = require("../../db.js");

exports.get = function(req, res){
    db.Group.find(req.params.group_id).success(function(group) {
        res.json(group);
    });
};

exports.post = function(req, res){
    if(!req.body.hasOwnProperty('title') || 
       !req.body.hasOwnProperty('address')) {

        console.log(req.body);
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    db.Group.create({ 
        title: req.body.title,
        address: req.body.address
    }).success(function(group){
        res.json(group);
    });
};