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
        }
    },
    function(err, results){
        res.render('mapview', { 
            title: 'eCourt', 
            categories: results.categories
        });
    });
};
