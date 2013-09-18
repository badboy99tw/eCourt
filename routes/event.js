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
            var urlGetEvents = host + '/api/categories/' + req.params.categoryId + '/events';
            utils.url2json(urlGetEvents, function(events){
                    // for each event, get causes
                    async.each(events, function (event_, callback) {
                        var urlGetCauses = host + '/api/events/' + event_.title + '/causes';
                        utils.url2json(urlGetCauses, function (causes) {
                            event_.causes = causes;
                            callback(null); // callback of async.each(events)
                        });
                    }, function (err) {
                        callback(null, events);
                    });
            });
        },
        causes: function(callback){
            var urlGetCauses = host + '/api/events/' + req.params.eventId + '/causes';
            utils.url2json(urlGetCauses, function (causes) {
                callback(null, causes);
            });
        },
        groups: function(callback){
            var url = host + '/api/events/' + req.params.eventId + '/groups';
            utils.url2json(url, function(groups){
                callback(null, groups);
            });
        },
        laws: function(callback){
            var url = host + '/api/events/' + req.params.eventId + '/laws';
            utils.url2json(url, function(laws){
                callback(null, laws);
            });
        }
    },
    function(err, results){
        res.render('event', { 
            title: 'eCourt', 
            currentEvent: req.params.eventId,
            currentCategory: req.params.categoryId,
            categories: results.categories,
            events: results.events,
            causes: results.causes,
            laws: results.laws,
            groups: results.groups
        });
    });
};
