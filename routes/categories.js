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
        events: function(callback){
            var url = host + '/api/categories/' + req.params.categoryId + '/events';
            utils.url2json(url, function(events){
                callback(null, events);
            });
        }
    },
    function(err, results){
        console.log(results.categories);
        res.render('categories', { 
            title: 'eCourt', 
            currentCategory: req.params.categoryId,
            categories: results.categories,
            currentEvent: '[請選擇事件]',
            events: results.events
        });
    });
};
