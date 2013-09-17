/*jslint node: true */
'use strict';

function httpGet(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    var responseText = xmlHttp.responseText;
    var json = JSON.parse(responseText);
    return json;
}

function randint(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}

function initMap(eventId) {

    var host = 'http://localhost:5566';
    var event_ = httpGet(host + '/api/events/' + eventId);
    console.log(event_.lat, event_.lng);

    // init map
    var map = L.map('map')
        .setView([event_.lat, event_.lng])
        .setZoom(14);
    var googleLayer = new L.Google('ROADMAP');
    map.addLayer(googleLayer);

    L.marker([event_.lat, event_.lng]).addTo(map);
}
