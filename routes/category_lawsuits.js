var async = require('async');
var utils = require('../lib/utils.js');

module.exports = function(req, res){
    var host = 'http://' + req.headers.host;

    async.series({
        categories: function(callback){
            var url = host + '/api/categories';
            utils.url2json(url, function(categories){
                callback(null, categories);
            });
        },
        category: function(callback){
            var url = host + '/api/category/' + req.params.category_id;
            utils.url2json(url, function(category){
                callback(null, category);
            });
        },
        lawsuits: function(callback){
            var url = host + '/api/category/' + req.params.category_id + '/lawsuits';
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
