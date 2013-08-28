/*jslint node: true */
'use strict';

var should = require('should');
var supertest = require('supertest');
var fs = require('fs');

var db = require('../db.js');

describe('APIs', function () {
    var url = 'http://localhost:5566';

    before(function (done) {
        db.syncAll({force: true}, function (){
            done();
        });
    });

    describe('About Categories', function () {
        var title = '宇宙正義'
        it('should create a new category successfully', function (done) {
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
                    res.should.have.status(200);
                    res.body.should.have.length(1);
                    done();
                });
        });
    });

    describe('About Events', function () {

        var event_ = {
            title: '美麗灣事件',
            url: 'http://zh.wikipedia.org/zh-tw/美麗灣度假村爭議'
        }

        it('should create event successfully if title is unique', function (done) {
            supertest(url)
                .post('/api/events')
                .send(event_)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.status(200);
                    res.body.id.should.equal(1);
                    res.body.title.should.equal(event_.title);
                    res.body.url.should.equal(event_.url);
                    done();
                });
        });

        it('should return error while trying to create duplicate event', function (done) {
            supertest(url)
                .post('/api/events')
                .send(event_)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.status(400);
                    done();
                });
        });

        it('should get event information by event title', function (done) {
            supertest(url)
                .get('/api/events/' + event_.title)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.status(200);
                    res.body.id.should.equal(1);
                    res.body.title.should.equal(event_.title);
                    res.body.url.should.equal(event_.url);
                    done();
                });
        });
    });
    describe('About Groups', function () {});
    describe('About Causes', function () {});
    describe('About Lawsuits', function () {});
    describe('About Proceedings', function () {});
    describe('About Laws', function () {});
});