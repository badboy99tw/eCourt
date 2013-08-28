/*jslint node: true */
'use strict';

var should = require('should');
var supertest = require('supertest');
var fs = require('fs');

var db = require('../db.js');

describe('Routing', function () {
    var url = 'http://localhost:5566';

    before(function (done) {
        db.syncAll({force: true}, function (){
            done();
        });
    });

    describe('Category', function () {
        var title = '宇宙正義'
        it('should create a category called ' + title, function (done) {
            var category = {
                title: title
            };

            supertest(url)
                .post('/api/categories')
                .send(category)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.status(200);
                    res.body.title.should.equal(title);
                    done();
                });
        });

        it('should return error while trying to create duplicate category', function (done) {
            var category = {
                title: title
            };

            supertest(url)
                .post('/api/categories')
                .send(category)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.status(400);
                    done();
                });
        });

        it('should get category list', function (done) {
            supertest(url)
                .get('/api/categories')
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    //console.log(res);
                    res.should.have.status(200);
                    res.body.should.have.length(1);
                    done();
                });
        });
    });
});