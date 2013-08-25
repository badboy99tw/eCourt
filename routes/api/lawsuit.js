var db = require("../../db.js");

exports.get = function(req, res){
    db.Lawsuit.find(req.params.lawsuit_id).success(function(lawsuit) {
        res.json(lawsuit);
    });
};

exports.post = function(req, res){
    if(!req.body.hasOwnProperty('title') || 
       !req.body.hasOwnProperty('court') ||
       !req.body.hasOwnProperty('type') ||
       !req.body.hasOwnProperty('year') ||
       !req.body.hasOwnProperty('word') ||
       !req.body.hasOwnProperty('num') ||
       !req.body.hasOwnProperty('content')) {

        console.log(req.body);
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    db.Lawsuit.create({ 
        title: req.body.title,
        court: req.body.court,
        type: req.body.type,
        year: req.body.year,
        word: req.body.word,
        num: req.body.num,
        content: req.body.content
    }).success(function(lawsuit){
        res.json(lawsuit);
    });
};