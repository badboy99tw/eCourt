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

    var category = {
        title: '宇宙正義'
    };

    var cause = {
        title: '申請假執行'
    }

    var event_ = {
        title: '美麗灣事件',
        url: 'http://zh.wikipedia.org/zh-tw/美麗灣度假村爭議'
    }

    describe('About Create', function () {
        describe('Category', function () {
            it('should create a new category', function (done) {
                supertest(url)
                    .post('/api/categories')
                    .send(category)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.title.should.equal(category.title);
                        done();
                    });
            });

            it('should return error trying to create duplicate category', function (done) {
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
        });

        describe('Event', function () {
            it('should create a new event', function (done) {
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

            it('should return error trying to create duplicate event', function (done) {
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
        });

        describe('Cause', function () {
            it('should create a new cause for a event', function (done) {
                supertest(url)
                    .post('/api/events/' + event_.title + '/causes')
                    .send(cause)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.id.should.equal(1);
                        res.body.title.should.equal(cause.title);
                        done();
                    });
            });

            it('should return error trying to create duplicate cause for a event', function (done) {
                supertest(url)
                    .post('/api/events/' + event_.title + '/causes')
                    .send(cause)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(400);
                        done();
                    });
            });
        });
    });

    describe('About Query', function () {
        describe('Category', function () {
            it('should list all categories', function (done) {
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

        describe('Event', function () {
            it('should get a event', function (done) {
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

            it('should list events for a category.', function (done) {
                supertest(url)
                    .get('/api/categories/' + category.title + '/events')
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
    });

    describe('About Create Associations', function () {
        describe('Between Category and Event', function () {
            it('should add a event to a category', function (done) {
                supertest(url)
                    .post('/api/categories/' + category.title + '/events/' + event_.title)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(201);
                        done();
                    });
            });
        });
    });
});