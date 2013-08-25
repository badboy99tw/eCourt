var async = require('async');
var db = require("../db.js");

module.exports = function(req, res){
    async.series({
        categories: function(callback){
            db.Category.findAll().success(function(categories){
                callback(null, categories);
            });
        },
        lawsuit: function(callback){
            db.Lawsuit.find(req.params.lawsuit_id).success(function(lawsuit){
                callback(null, lawsuit);
            });
        }
    },
    function(err, results){
        res.render('lawsuit', { 
            title: 'eCourt', 
            categories: results.categories,
            lawsuit: results.lawsuit
        });
    });
};