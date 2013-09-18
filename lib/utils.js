var async = require('async');
var http = require('http');
var db = require('../db.js');

function hasCause(causes, causeTitle) {
    for (var i in causes) {
        var cause = causes[i];
        if (causes.title === causeTitle) {
            return true;
        }
    }
    return false;
}

function getCause(causes, causeTitle) {
    for (var i in causes) {
        var cause = causes[i];
        if (cause.title === causeTitle) {
            return cause;
        }
    }
}

function sortLawsuitsByProceeding(lawsuits, callback) {
    db.Proceeding.findAll().success(function (proceedings) {
        lawsuits.sort(function (a, b) {
            for (var i in proceedings) {
                p = proceedings[i];
                if (a.title === p.title) {
                    a.order = p.order;
                }
                if (b.title === p.title) {
                    b.order === p.order
                }
            }
            return a.order - b.order;
        });
        callback();
    });
}

exports.createCausesFromLawsuits = function (lawsuits, callback) {
    var causes = []
    for (var i in lawsuits) {
        var lawsuit = lawsuits[i];
        if (hasCause(causes, lawsuit.cause) === false) {
            var cause = {};
            cause.title = lawsuit.cause;
            cause.lawsuits = [];
            causes.push(cause);
        }
        var cause = getCause(causes, lawsuit.cause);
        cause.lawsuits.push(lawsuit);
    }
    async.each(causes, function (cause, callback) {
        sortLawsuitsByProceeding(cause.lawsuits, function () {
            callback(null);
        });
    }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            callback(causes);
        }
    });
};

exports.url2json = function (url, callback) {
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
};

exports.union = function (array, arrayOut) {
    for (var itemOutIndex in arrayOut) {
        var itemOut = arrayOut[itemOutIndex];
        var isExist = false;
        for (var itemIndex in array) {
            var item = array[itemIndex];
            if (item.id === itemOut.id) {
                isExist = true;
            }
        } 
        if (isExist === false) {
            array.push(itemOut);
        }
    }
    return array;
};