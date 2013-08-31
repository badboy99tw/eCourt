/*jslint node: true */
'use strict';

function httpGet(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function randint(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}

function init() {
    var map = new GMaps({
        div: '#map',
	    lat: 23.973875,
	    lng: 120.982024,
        zoom: 7,
        markerClusterer: function(map) {
            return new MarkerClusterer(map);
        }
	});

    var host = 'http://localhost:5566';
    var events = httpGet(host + '/api/events');
    events = JSON.parse(events);
    for (var i in events) {
        var event_ = events[i];
        var lat = randint(2200, 2400);
        map.addMarker({
            lat: randint(2190, 2540) / 100.0,
            lng: randint(12000, 12200) / 100.0,
            title: event_.title,
            icon: 'http://chart.apis.google.com/chart?chst=d_bubble_text_small&chld=bbT|' + event_.title + '|C6EF8C|000000',
            //icon: 'http://chart.apis.google.com/chart?chst=d_text_outline&chld=999999|16|h|000000|_|' + event_.title,
            infoWindow: {
                content: '<a href="' + event_.url + '">' + event_.title + '</a>'
            }
        });
    }
}