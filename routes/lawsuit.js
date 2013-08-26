var async = require('async');
var tools = require("../lib/tools.js");

module.exports = function(req, res){
    var host = 'http://' + req.headers.host;

    async.series({
        categories: function(callback){
            var url = host + '/api/categories';
            tools.url2json(url, function(categories){
                callback(null, categories);
            });
        },
        lawsuit: function(callback){
            var url = host + '/api/lawsuit/' + req.params.lawsuit_id;
            tools.url2json(url, function(lawsuit){
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