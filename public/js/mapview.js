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

function init() {

    var map = L.mapbox.map('map', 'jinkuen.map-qddatgf9')
        .setView([23.72, 120.8])
        .setZoom(7);

    var host = 'http://localhost:5566';
    var cities = httpGet(host + '/api/cities');

    var cityLayers = [];
    for (var i in cities) {
        var city = cities[i];
        //var cityLayer = new L.MarkerClusterGroup();
        var cityLayer = new L.mapbox.markerLayer();
        cityLayer.on('click', function(e) {
            map.panTo(e.layer.getLatLng());
        });
        cityLayers.push({
            title: city.title,
            layer: cityLayer
        });

        var events = httpGet(host + '/api/cities/' + city.title + '/events');
        for (var j in events) {
            var event_ = events[j];
            var marker = L.marker(new L.LatLng(event_.lat, event_.lng), {
                icon: new L.Icon.Label.Default({ labelText: event_.title }),
                title: event_.title
            });
            var popupContent = '<a href="' + event_.url + '">' + event_.title + '</a><p>' + city.title + '</p>';
            marker.bindPopup(popupContent);

            cityLayer.addLayer(marker);
        }
    }

    for (var i in cityLayers){
        map.addLayer(cityLayers[i].layer);
    }

    var currentCity = null;
    var countLayer = L.mapbox.markerLayer().addTo(map);
    // add twgeojson layer
    var jsonLayer = L.geoJson(null, {
        style: { color: '#333', weight: 1 },
        onEachFeature: function (feature, layer) {
            // TODO: get events of city twice !! 
            var events = httpGet(host + '/api/cities/' + feature.properties.name + '/events');

            var center = d3.geo.centroid(feature);
            var icon = L.divIcon({ className: 'event_count', html: events.length });
            var marker = L.marker(new L.LatLng(center[1], center[0]), {
                icon: icon,
                title: feature.properties.name
            });
            countLayer.addLayer(marker);

            function highlightFeature(e) {
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: '#900'
                });

                var info = '<p><h3>' + feature.properties.name + '</h3></p>';
                for (var i in events) {
                    info += '<p>' + events[i].title + '</p>';
                }
                document.getElementById('info').innerHTML = info;
            }
            function resetHighlight(e) {
                jsonLayer.resetStyle(e.target);
            }
            function zoomToFeature(e) {
                map.fitBounds(e.target.getBounds());
                currentCity = e.target.feature.properties.name;
                console.log('zoomToFeature ' + currentCity);
            }
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }
    }).addTo(map);

    function showEventCount() {
        console.log('showEventCount');
        if (map.hasLayer(countLayer) === false) {
            countLayer.addTo(map);
        }
    }

    function hideEventCount() {
        console.log('hideEventCount');
        if (map.hasLayer(countLayer) === true) {
            map.removeLayer(countLayer);
        }
    }

    function hideAllMarkers() {
        console.log('hideAllMarkers');
        for (var i in cityLayers) {
            if (map.hasLayer(cityLayers[i].layer) === true) {
                map.removeLayer(cityLayers[i].layer);
            }
        } 
    }

    function showOneMarker(title) {
        console.log('showOneMarker');
        for (var i in cityLayers) {
            if (cityLayers[i].title === currentCity) {
                cityLayers[i].layer.addTo(map);
            }
            else {
                if (map.hasLayer(cityLayers[i].layer) === true) {
                    map.removeLayer(cityLayers[i].layer);
                }
            }
        }  
    }

    function setLayerVisibility(e) {
        console.log('------------setLayerVisibility');
        console.log(e);
        // TODO: should be optimized for better performance
        //       see https://github.com/Leaflet/Leaflet/issues/4
        var default_zoom = 7;
        console.log('current zoom = ' + map.getZoom());
        console.log('current city = ' + currentCity);
        // zoom out
        if (map.getZoom() <= default_zoom){
            showEventCount();
            hideAllMarkers();
        }
        // zoom in
        else {
            if (currentCity != null) {
                hideEventCount();
                showOneMarker(currentCity);
            }
        }
    }
    setLayerVisibility();
    map.on({
        'moveend': setLayerVisibility
    });

    
    d3.json('twCounty2010.topo.json', function(error, data) {
        var features = topojson.feature(data, data.objects['twCounty2010.geo']);
        jsonLayer.addData(features);
    })
}
