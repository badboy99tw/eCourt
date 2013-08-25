var async = require('async');
var tools = require('../lib/tools');

module.exports = function(req, res){
    var host = 'http://' + req.headers.host;

    async.series({
        categories: function(callback){
            var url = host + '/api/categories';
            tools.url2json(url, function(categories){
                callback(null, categories);
            });
        },
        category: function(callback){
            var url = host + '/api/category/' + req.params.category_id;
            tools.url2json(url, function(category){
                callback(null, category);
            });
        },
        lawsuits: function(callback){
            var url = host + '/api/category/' + req.params.category_id + '/lawsuits';
            tools.url2json(url, function(lawsuits){
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
