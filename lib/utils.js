var http = require('http');

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