var db = require("../db.js");

module.exports = function(req, res){
    db.Category.findAll().success(function(categories) {
        db.Lawsuit.find(1).success(function(lawsuit){
            res.render('lawsuit', { 
                title: 'eCourt', 
                categories: categories,
                lawsuit: lawsuit });
        });
    });
};