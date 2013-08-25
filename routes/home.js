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
        }
    },
    function(err, results){
        res.render('home', { 
            title: 'eCourt', 
            categories: results.categories
        });
    });
};
