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
        res.render('home', { 
            title: 'eCourt', 
            currentEvent: '[請先選擇類別]',
            currentCategory: '[請選擇類別]',
            categories: results.categories,
            events: [],
        });
    });
};
