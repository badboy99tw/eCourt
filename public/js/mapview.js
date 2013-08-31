/*jslint node: true */
'use strict';

function init() {
    var map = new GMaps({
        div: '#map',
	    lat: 23.973875,
	    lng: 120.982024,
        zoom: 7
	});

    map.addMarker({
        lat: 23.08,
        lng: 120.17,
        title: '台南Room335',
        infoWindow: {
            content: '<p>地址</p>'
        }
    });
}