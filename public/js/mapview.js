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
    var lawsuits = httpGet(host + '/api/lawsuits');
    lawsuits = JSON.parse(lawsuits);

    for (var i in lawsuits) {
        var lawsuit = lawsuits[i];
        var lat = randint(2200, 2400);
        map.addMarker({
            lat: randint(2190, 2540) / 100.0,
            lng: randint(12000, 12200) / 100.0,
            title: lawsuit.cause,
            infoWindow: {
                content: '<p>' + lawsuit.title + '</p>'
            }
        });
    }
}