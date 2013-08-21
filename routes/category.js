var async = require('async');
var db = require("../db.js");

module.exports = function(req, res){
    async.series({
        categories: function(callback){
            db.Category.findAll().success(function(categories){
                callback(null, categories);
            });
        },
        category: function(callback){
            db.Category.find(1).success(function(category){
                callback(null, category);
            });
        },
        lawsuit: function(callback){
            db.Lawsuit.find(1).success(function(lawsuit){
                callback(null, lawsuit);
            });
        }
    },
    function(err, results){
        res.render('category', { 
            title: 'eCourt', 
            categories: results.categories,
            category: results.category,
            lawsuit: results.lawsuit
        });
    });
};