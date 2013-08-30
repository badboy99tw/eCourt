#!/usr/bin/env python
# -*- coding: utf-8 -*-

import urllib
import httplib
import random

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
    categoryData = [u'食品安全', u'自然災害', u'環境污染', u'生態公害', u'司法改革', u'再生能源', u'基本人權', u'文化保護', u'勞資爭議', u'土地正義']
    causeData = [u'申請假執行', u'申請假扣押', u'申請假處分', u'侵權行為損害賠償', u'請求所有權移轉登記', u'返還不當得利', u'給付工程款', u'禁治產宣告', u'損害賠償', u'不動產所有權移轉登記']
    eventData = [u'大埔事件', u'廢除死刑', u'核四公投', u'美麗灣度假村爭議', u'洪仲丘事件', u'美麗島事件', u'旺旺中時併購中嘉案', u'胖達人', u'統一布丁', u'2011年台灣塑化劑事件']
    groupData = [(u'綠色公民行動聯盟', 'http://www.gcaa.org.tw/'),
                   (u'傳播學生鬥陣', 'https://www.facebook.com/scstw1994'),
                   (u'地球公民基金會', 'http://www.cet-taiwan.org/'),
                   (u'苦勞網', 'http://www.coolloud.org.tw/'),
                   (u'台灣綠黨', 'http://www.greenparty.org.tw/'),
                   (u'公民監督國會聯盟', 'http://www.ccw.org.tw/'),
                   (u'蠻野心足', 'http://zh.wildatheart.org.tw/'),
                   (u'台灣公益團體自律聯盟', 'http://www.twnpos.org.tw/'),
                   (u'香港地球之友', 'http://www.foe.org.hk/welcome/gettc.asp'),
                   (u'荒野保護協會', 'https://www.sow.org.tw/')]
    lawData = [u'一', u'二', u'三', u'四', u'五', u'六', u'七', u'八', u'九', u'十']

    def __init__(self, url):
        self.url = url
        self.robot = UrlRobot(self.url)
        self.robot.connect()

    def createCategories(self):
        for title in self.categoryData:
            category = {'title': title.encode('utf-8')}
            print self.robot.post('/api/categories', category)

    def createCauses(self):
        for title in self.causeData:
            cause = {'title': title.encode('utf-8')}
            eventName = self.eventData[random.randint(0, 9)]
            print self.robot.post((u'/api/events/' + eventName + u'/causes').encode('utf-8'), cause)

    def createEvents(self):
        wikiBase = 'http://zh.wikipedia.org/zh-tw/'
        for title in self.eventData:
            event = {'title': title.encode('utf-8'), 'url': (wikiBase + title).encode('utf-8')}
            print self.robot.post('/api/events', event)

    def createGroups(self):
        for title, url in self.groupData:
            group = {'title': title.encode('utf-8'), 'intro':(u'大家好我是' + title).encode('utf-8'), 'url': url}
            print self.robot.post('/api/groups', group)

    def createLaws(self):
        for num in self.lawData:
            law = {'title': (u'環保法第' + num + u'條').encode('utf-8'), 'article':u'依法辦理，謝謝指教，我照法律執行難道臭了嗎？'.encode('utf-8')}
            print self.robot.post('/api/laws', law) 

    def run(self):
        self.createCategories()
        self.createEvents()
        self.createCauses()
        self.createGroups()
        self.createLaws()

    def close(self):
        self.robot.close()

if __name__ == '__main__':
    url = 'localhost:5566'
    creator = TestDbCreator(url)
    creator.run()
    creator.close()
