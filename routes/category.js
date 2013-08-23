var async = require('async');
var url = require('url');
var http = require('http');

var url2json = function(url, callback){
    http.get(url, function(res){
        var data = '';
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function(){
            var json = JSON.parse(data);
            callback(json);
        });
    });
}

module.exports = function(req, res){
    var queryData = url.parse(req.url, true).query;
    var id = queryData.id;
    if(!queryData.id){
        id = 1;
    }
    var host = 'http://' + req.headers.host;

    async.series({
        categories: function(callback){
            var url = host + '/api/categories';
            url2json(url, function(categories){
                callback(null, categories);
            });
        },
        category: function(callback){
            var url = host + '/api/category/' + id;
            url2json(url, function(category){
                callback(null, category);
            });
        },
        lawsuits: function(callback){
            var url = host + '/api/category/' + id + '/lawsuits';
            url2json(url, function(lawsuits){
                callback(null, lawsuits);
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