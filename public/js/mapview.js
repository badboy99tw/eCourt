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

    var map = L.mapbox.map('map', 'jinkuen.map-qddatgf9');

    var host = 'http://localhost:5566';
    var events = httpGet(host + '/api/events');
    events = JSON.parse(events);

    var features = [];
    for (var i in events) {
        var event_ = events[i];

        var feature = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [randint(12000, 12200)/100.0, randint(2190, 2540)/100.0]
            },
            properties: {
                title: event_.title,
                description: event_.url,
                'marker-size': 'large',
                'marker-color': '#f0a'
            }
        }

        features.push(feature);
    }

    L.mapbox.markerLayer({
        type: 'FeatureCollection',
        features: features
    }).addTo(map);
}