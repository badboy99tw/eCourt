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

    var group = {
        title: '宇宙艦隊',
        intro: '星聯的主力軍隊',
        url: 'http://ja.wikipedia.org/wiki/宇宙艦隊'
    }

    var law = {
        title: '環境基本法第四條',
        article: '基於國家長期利益，經濟、科技及社會發展均應兼顧環境保護。但經濟、科技及社會發展對環境有嚴重不良影響或有危害之虞者，應環境保護優先。'
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

        describe('Group', function () {
            it('should create a new group', function (done) {
                supertest(url)
                    .post('/api/groups/')
                    .send(group)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.id.should.equal(1);
                        res.body.title.should.equal(group.title);
                        res.body.intro.should.equal(group.intro);
                        res.body.url.should.equal(group.url);
                        done();
                    });
            });

            it('should return error trying to create duplicate group', function (done) {
                supertest(url)
                    .post('/api/groups/')
                    .send(group)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(400);
                        done();
                    });
            });
        });

        describe('Law', function () {
            it('should create a new law', function (done) {
                supertest(url)
                    .post('/api/laws')
                    .send(law)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(201);
                        res.body.id.should.equal(1);
                        res.body.title.should.equal(law.title);
                        res.body.article.should.equal(law.article);
                        done();
                    });
            });

            it('should return error trying to create duplicate law', function (done) {
                supertest(url)
                    .post('/api/laws')
                    .send(law)
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

        describe('Between Event and Group', function () {
            it('should add a group to a event', function (done) {
                supertest(url)
                    .post('/api/events/' + event_.title + '/groups/' + group.title)
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

            it('should list events of a category.', function (done) {
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

        describe('Cause', function () {
            it('should get a cause of a event', function (done) {
                supertest(url)
                    .get('/api/events/' + event_.title + '/causes/' + cause.title)
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

            it('should list causes of a event.', function (done) {
                supertest(url)
                    .get('/api/events/' + event_.title + '/causes')
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

        describe('Group', function () {
            it('should get a group', function (done) {
                supertest(url)
                    .get('/api/groups/' + group.title)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.id.should.equal(1);
                        res.body.title.should.equal(group.title);
                        res.body.intro.should.equal(group.intro);
                        res.body.url.should.equal(group.url);
                        done();
                    });
            });
        });
    });
});