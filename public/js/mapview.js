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

    var markerLayer = new L.MarkerClusterGroup();
    //markerLayer = new L.LayerGroup();

    for (var i in events) {
        var event_ = events[i];

        // create marker
        var marker = L.marker(new L.LatLng(event_.lat, event_.lng), {
            icon: new L.Icon.Label.Default({ labelText: event_.title }),
            title: event_.title
        });

        // create popup window
        var city = httpGet(host + '/api/events/' + event_.title + '/cities');
        city = JSON.parse(city);
        var popupContent = '<a href="' + event_.url + '">' + event_.title + '</a><p>' + city.title + '</p>';
        marker.bindPopup(popupContent);

        // add to layer
        markerLayer.addLayer(marker);
    }

    map.addLayer(markerLayer);

    // add twgeojson layer
    var jsonLayer = L.geoJson(null, {
        style: { color: '#333', weight: 1 },
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                var popupContent = '<p>' + feature.properties.name + '</p>';
                layer.bindPopup(popupContent);
            }

            var center = d3.geo.centroid(feature);
            var icon = L.divIcon({ className: 'event_count', html: '30' });
            var marker = L.marker(new L.LatLng(center[1], center[0]), {
                icon: icon,
                title: feature.properties.name
            });
            jsonLayer.addLayer(marker);

            function highlightFeature(e) {
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: '#900'
                });
            }
            function resetHighlight(e) {
                jsonLayer.resetStyle(e.target);
            }
            function zoomToFeature(e) {
                map.fitBounds(e.target.getBounds());
            }
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }
    }).addTo(map);

    function setLayerVisibility(e) {
        // TODO: should be optimized for better performance
        //       see https://github.com/Leaflet/Leaflet/issues/4
        var default_zoom = 7;
        // zoom in
        if (map.getZoom() > default_zoom){
            // hide jsonLayer
            if (map.hasLayer(jsonLayer) === true) {
                map.removeLayer(jsonLayer);
            }
            // show markerLayer
            if (map.hasLayer(markerLayer) === false) {
                markerLayer.addTo(map);
            }
        }
        // zoom out
        else {
            // show jsonLayer
            if (map.hasLayer(jsonLayer) === false) {
                jsonLayer.addTo(map);
            }
            // hide markerLayer
            if (map.hasLayer(markerLayer) === true) {
                map.removeLayer(markerLayer);
            }
        }
    }
    setLayerVisibility();
    map.on({
        'viewreset': setLayerVisibility
    });

    
    d3.json('twCounty2010.topo.json', function(error, data) {
        var features = topojson.feature(data, data.objects['twCounty2010.geo']);
        jsonLayer.addData(features);
    })
}
