var db = require("../db.js");

module.exports = function(req, res){
    db.Category.findAll().success(function(categories) {
        //console.log('home.js is called');
        //console.log(categories);
        res.render('index', { title: 'eCourt', categories: categories });
    });
};