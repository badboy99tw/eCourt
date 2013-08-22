var async = require('async');
var url = require('url');
var db = require("../db.js");

module.exports = function(req, res){
    var queryData = url.parse(req.url, true).query;
    var id = queryData.id;
    if(!queryData.id){
        id = 1;
    }
    console.log(queryData);

    async.series({
        categories: function(callback){
            db.Category.findAll().success(function(categories){
                callback(null, categories);
            });
        },
        category: function(callback){
            db.Category.find(id).success(function(category){
                callback(null, category);
            });
        },
        lawsuits: function(callback){
            db.Category.find(id).success(function(category){
                category.getLawsuits().success(function(lawsuits){
                    console.log(lawsuits);
                    callback(null, lawsuits);
                });
            }); 
        }
    },
    function(err, results){
        res.render('category', { 
            title: 'eCourt', 
            categories: results.categories,
            category: results.category,
            lawsuits: results.lawsuits
        });
    });
};