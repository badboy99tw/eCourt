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

    var lawsuit = {
        title: '最高行政法院,行政,101,訴,2266',
        date: '1983-07-06',
        article: '我是判決'
    }

    var proceeding = {
        title: '發回更審',
        order: 5
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

        describe('Lawsuit', function () {
            it('should create a new lawsuit', function (done) {
                supertest(url)
                    .post('/api/lawsuits')
                    .send(lawsuit)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(201);
                        res.body.id.should.equal(1);
                        res.body.title.should.equal(lawsuit.title);
                        res.body.date.should.equal(lawsuit.date);
                        res.body.article.should.equal(lawsuit.article);
                        done();
                    });
            });

            it('should return error trying to create duplicate lawsuit', function (done) {
                supertest(url)
                    .post('/api/lawsuits')
                    .send(lawsuit)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(400);
                        done();
                    });
            });
        });

        describe('Proceeding', function () {
            it('should create a new proceeding', function (done) {
                supertest(url)
                    .post('/api/proceedings')
                    .send(proceeding)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(201);
                        res.body.id.should.equal(1);
                        res.body.title.should.equal(proceeding.title);
                        res.body.order.should.equal(proceeding.order);
                        done();
                    });
            });

            it('should return error trying to create duplicate proceeding', function (done) {
                supertest(url)
                    .post('/api/proceedings')
                    .send(proceeding)
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

        describe('Between Cause and Lawsuit', function () {
            it('should add a lawsuit to a cause', function (done) {
                supertest(url)
                    .post('/api/events/' + event_.title + '/causes/' + cause.title + '/lawsuits/' + lawsuit.title)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(201);
                        done();
                    });
            });
        });

        describe('Between Group and Cause', function () {
            it('should add a cause to a group', function (done) {
                supertest(url)
                    .post('/api/groups/' + group.title + '/causes/' + cause.title)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(201);
                        done();
                    });
            });
        });

        describe('Between Lawsuit and Law', function () {
            it('should add a law to a lawsuit', function (done) {
                supertest(url)
                    .post('/api/lawsuits/' + lawsuit.title + '/laws/' + law.title)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(201);
                        done();
                    });
            });
        });

        describe('Between Lawsuit and Proceeding', function () {
            it('should add a proceeding to a lawsuit', function (done) {
                supertest(url)
                    .post('/api/lawsuits/' + lawsuit.title + '/proceedings/' + proceeding.title)
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
            it('should list categories', function (done) {
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

            it('should list categories of a event', function (done) {
                supertest(url)
                    .get('/api/events/' + event_.title + '/categories')
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

            it('should get cause of a lawsuit.', function (done) {
                supertest(url)
                    .get('/api/lawsuits/' + lawsuit.title + '/causes')
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.title.should.equal(cause.title);
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

            it('should list events of a group.', function (done) {
                supertest(url)
                    .get('/api/groups/' + group.title + '/events')
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

            it('should list groups of a category.', function (done) {
                supertest(url)
                    .get('/api/categories/' + category.title + '/groups')
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.should.have.length(1);
                        done();
                    });
            });

            it('should list groups of a event.', function (done) {
                supertest(url)
                    .get('/api/events/' + event_.title + '/groups')
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.should.have.length(1);
                        res.body[0].title.should.equal(group.title);
                        res.body[0].intro.should.equal(group.intro);
                        res.body[0].url.should.equal(group.url);
                        done();
                    });
            });
        });

        describe('Law', function () {
            it('should get a law', function (done) {
                supertest(url)
                    .get('/api/laws/' + law.title)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.id.should.equal(1);
                        res.body.title.should.equal(law.title);
                        res.body.article.should.equal(law.article);
                        done();
                    });
            });

            it('should list laws of a category.', function (done) {
                supertest(url)
                    .get('/api/categories/' + category.title + '/laws')
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.should.have.length(1);
                        res.body[0].title.should.equal(law.title);
                        res.body[0].article.should.equal(law.article);
                        done();
                    });
            });
        });

        describe('Lawsuit', function () {
            it('should get a lawsuit', function (done) {
                supertest(url)
                    .get('/api/lawsuits/' + lawsuit.title)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.should.have.status(200);
                        res.body.id.should.equal(1);
                        res.body.title.should.equal(lawsuit.title);
                        //res.body.date.should.equal(lawsuit.date);
                        res.body.article.should.equal(lawsuit.article);
                        done();
                    });
            });
        });

        describe('Proceeding', function () {
            it('should list proceedings', function (done) {
                supertest(url)
                    .get('/api/proceedings')
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
});