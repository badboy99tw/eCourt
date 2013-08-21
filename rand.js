var fs = require('fs');

var dictword = ['哇', '哈', '哈'];
fs.readFile('dict.txt', function(err, data){
    dictword = data.toString().split('');
    //console.log(dictword.toString().split(''));
});

var randint = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var randstr = function(length){
    var words = fs.readFileSync('dict.txt').toString().split('');
    var result = '';
    for (var i = 0; i < length; i++){
        var randIndex = randint(0, words.length);
        result += words[randIndex];
    }
    //console.log(result);
    return result;
};

exports.randint = randint;
exports.randstr = randstr;