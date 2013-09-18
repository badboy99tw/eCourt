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

function draw(words, w, h) {
    var w = 1300;
    var h = 500;

    var fill = d3.scale.category20();

    d3.select('body')
        .append('svg')
            .attr('width', w)
            .attr('height', h)
        .append('g')
            .attr('transform', 'translate(' + w/2 + ',' + h/2 + ')')
        .selectAll('text')
            .data(words)
        .enter().append('text')
            .style('font-size', function(d) { return d.size + 'px'; })
            .style('font-family', 'Impact')
            .style('fill', function(d, i) { return fill(i); })
            .attr('text-anchor', 'middle')
            .attr('transform', function(d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
                })
            .text(function(d) { return d.text; });
}

function initMap() {
    var host = 'http://localhost:5566';
    var categories = httpGet(host + '/api/categories');
    var groups = httpGet(host + '/api/groups');
    var events = httpGet(host + '/api/events');

    var w = 1300;
    var h = 500;
    
    d3.layout.cloud().size([w, h])
        .words(categories.concat(groups, events).map(function(d) {
                return {text: d.title, size: 10 + Math.random() * 90};
            }))
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font('Impact')
        .fontSize(function(d) { return d.size; })
        .on('end', draw)
        .start();
}