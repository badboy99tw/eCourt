#!/usr/bin/env python
# -*- coding: utf-8 -*-

import urllib
import httplib

class UrlRobot(object):
    def __init__(self, url):
        self.url = url
        self.headers = {'Content-type': 'application/x-www-form-urlencoded', 'Accept': 'text/plain'}

    def connect(self):
        self.conn = httplib.HTTPConnection(self.url)

    def post(self, api, data):
        dataEncode = urllib.urlencode(data)
        self.conn.request('POST', api, dataEncode, self.headers)
        return self.conn.getresponse().read()

    def close(self):
        self.conn.close()

class TestDbCreator(object):
    def __init__(self, url):
        self.url = url
        self.robot = UrlRobot(self.url)
        self.robot.connect()

    def createCategories(self):
        for title in [u'食品安全', u'自然災害', u'環境污染', u'生態公害', u'司法改革', u'再生能源', u'基本人權', u'文化保護', u'勞資爭議', u'土地正義']:
            category = {'title': title.encode('utf-8')}
            print self.robot.post('/api/categories', category)

    def createCauses(self):
        for title in [u'申請假執行', u'申請假扣押', u'申請假處分', u'侵權行為損害賠償', u'請求所有權移轉登記', u'返還不當得利', u'給付工程款', u'禁治產宣告', u'損害賠償', u'不動產所有權移轉登記']:
            category = {'title': title.encode('utf-8')}
            print self.robot.post('/api/categories', category)

    def run(self):
        self.createCategories()
        self.createCauses()

    def close(self):
        self.robot.close()

if __name__ == '__main__':
    url = 'localhost:5566'
    creator = TestDbCreator(url)
    creator.run()
    creator.close()
