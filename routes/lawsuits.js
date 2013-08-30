var async = require('async');
var utils = require('../lib/utils.js');

exports.showOne = function (req, res) {
    var host = 'http://' + req.headers.host;

    async.series({
        categories: function(callback){
            var url = host + '/api/categories';
            utils.url2json(url, function(categories){
                callback(null, categories);
            });
        },
        lawsuit: function(callback){
            var url = host + '/api/lawsuits/' + req.params.lawsuitId;
            utils.url2json(url, function(lawsuit){
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

exports.listAll = function (req, res) {
    var host = 'http://' + req.headers.host;

    async.series({
        categories: function(callback){
            var url = host + '/api/categories';
            utils.url2json(url, function(categories){
                callback(null, categories);
            });
        },
        category: function(callback){
            var url = host + '/api/categories/' + req.params.categoryId;
            utils.url2json(url, function(category){
                callback(null, category);
            });
        },
        lawsuits: function(callback){
            var url = host + '/api/categories/' + req.params.categoryId + '/lawsuits';
            utils.url2json(url, function(lawsuits){
                callback(null, lawsuits);
            });
        }
    },
    function(err, results){
        res.render('category_lawsuits', { 
            title: 'eCourt', 
            categories: results.categories,
            category: results.category,
            lawsuits: results.lawsuits
        });
    });
};
