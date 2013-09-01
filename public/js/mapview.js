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

    var markers = new L.MarkerClusterGroup();

    for (var i in events) {
        var event_ = events[i];

        // create marker
        var pos = [randint(2190, 2540)/100.0, randint(12000, 12200)/100.0]
        var marker = L.marker(new L.LatLng(pos[0], pos[1]), {
            icon: new L.Icon.Label.Default({ labelText: event_.title }),
            title: event_.title
        });

        // create popup window
        var popupContent = '<a href="' + event_.url + '">' + event_.title + '</a>';
        marker.bindPopup(popupContent);

        // add to layer
        markers.addLayer(marker);
    }

    map.addLayer(markers);

    // add twgeojson layer
    var jsonLayer = L.geoJson(null, {
        style: { color: '#333', weight: 1 },
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                var popupContent = '<p>' + feature.properties.name + '</p>';
                layer.bindPopup(popupContent);
            }
        }
    }).addTo(map);

    
    d3.json('twCounty2010.topo.json', function(error, data) {
        var features = topojson.feature(data, data.objects['twCounty2010.geo']);
        jsonLayer.addData(features);
    })
}