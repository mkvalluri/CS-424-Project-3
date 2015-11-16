/**
 * Created by juan on 11/16/15.
 */

function ForceGraph(target, data, colorU1, colorU2, colorCoincidence){
    var self = this;

    self.data = data;

    /* container attributes */
    self.target = target;
    self.margin = {top: 50, right: 20, bottom: 40, left: 80};
    self.height = 0;
    self.width = 0;
    self.svg = null;

    /* graph attributes */
    self.radius = 8;                        // graph circle radius
    self.padding = 8;                       //
    self.force = null;                      // d3 force element
    self.toogle = 0;                        // stores whether the highlighting is on
    self.linkedByIndex = {};                // stores what node is connected to what

    /* color */
    self.color = d3.scale.category10();
    self.colorUser1 = colorU1;
    self.colorUser2 = colorU2;
    self.colorCoincidente = colorCoincidence;

    /* behavior */
    self.nodeDrag = d3.behavior.drag()
                        .on("dragstart", function(d,i) { self.dragStart(d,i); })
                        .on("drag", function(d,i) { self.dragMove(d,i); })
                        .on("dragend", function(d,i) { self.dragEnd(d,i); });
    self.links = null;
    self.nodes = null;
}

ForceGraph.prototype = {
    constructor: ForceGraph,

    collide: function(alpha){
        var quadtree = d3.geom.quadtree(data.nodes);
        return function(d) {
            var rb = 2*self.radius + self.padding,
                nx1 = d.x - rb,
                nx2 = d.x + rb,
                ny1 = d.y - rb,
                ny2 = d.y + rb;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y);
                    if (l < rb) {
                        l = (l - rb) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    },

    /* stops the force auto positioning before you start dragging */
    dragStart: function(d, i){
        this.force.stop()
    },

    dragMove: function(d, i){
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
    },

    dragEnd: function(d, i){
        d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        this.force.resume();
    },

    releaseNode: function(d){
        d.fixed = false; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        //force.resume();
    },

    areNeighbors: function(a, b){
        var self = this;
        return self.linkedByIndex[a.index + "," + b.index];
    },

    connectNodes: function(d){
        var self = this;

        if (self.toogle == 0){
            // Reduce the opacity of the nodes except of the node neighbors
            self.nodes.style("opacity", function (o) {
                return self.areNeighbors(d, o) | self.areNeighbors(o, d) ? 1 : 0.1;
            });

            self.links.style("opacity", function (o) {
                return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
            });
            self.toogle = 1;
        } else {
            // Restore the opacity
            self.nodes.style("opacity", 1);
            self.links.style("opacity", 1);
            self.toogle = 0;
        }
    },

    restart: function(data){
        var self = this;
        self.data = data;

        self.links = self.links.data(data.links);
        self.links.enter()
            .insert("line", ".node")
            .attr("class","link");
        self.links.exit().remove();

        self.nodes = self.nodes.data(data.nodes);

        var n = self.nodes.enter().insert("g")
            .attr("class", "node")
            .call(self.force.drag)
            .on('click', function(d){ self.connectNodes(d) })
            .on('dblclick', self.releaseNode)
            .call(self.nodeDrag);

        n.append("circle")
            .attr("r", 8)
            .style("fill", function (d) {
                if (d.user == 1)
                    return self.colorUser1;
                else if (d.user == 2)
                    return self.colorUser2;
                else if (d.user == 3)
                    return self.colorCoincidente;
                else
                    return self.color(d.group);
            });

        n.append("text")
            .attr("dx", 10)
            .attr("dy", ".35em")
            .text(function(d) { return d.name })
            .style("stroke", "gray");

        self.nodes.exit().remove();
        self.force.start();

        self.linkedByIndex = {};
        for (var i = 0; i < data.nodes.length; i++) self.linkedByIndex[i + "," + i] = 1;
        data.links.forEach(function (d) {
            self.linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });
    },

    create: function(){
        var self = this;

        self.force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .friction(0.9)
            .size([self.width, self.height]);

        /* Create the graph nodes and links based on the json data */
        self.force.nodes(data.nodes)
                  .links(data.links)
                  .start();

        /* Create all the line SVG elems without setting the locations yet */
        self.links = self.svg.selectAll(".link")
                .data(data.links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function(d){
                    return Math.sqrt(d.value);
                });

        /* Create all the g SVG elems without setting the locations yet.
         * Circles and Text are grouped in the g elements. */
        self.nodes = self.svg.selectAll(".node")
            .data(data.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(self.force.drag)
            .on('click', function(d){ self.connectNodes(d) })
            .on('dblclick', self.releaseNode)
            .call(self.nodeDrag);

        // append circles and text to groups
        self.nodes.append("circle")
                .attr("r", self.radius)
                .style("fill", function (d) {
                    if (d.user == 1)
                        return self.colorUser1;
                    else if (d.user == 2)
                        return self.colorUser2;
                    else if (d.user == 3)
                        return self.colorCoincidente;
                    else
                        return self.color(d.group);
                });
        self.nodes.append("text")
                .attr("dx", 10)
                .attr("dy", ".35em")
                .text(function(d){ return d.name })
                .style("stroke", "gray");

        /* Give the SVG coordinates based on the force layout coordinates (after applied
        *  graph 'physics' */
        self.force.on("tick", function(){
            self.links
                .attr("x1", function (d) {
                    return d.source.x; })
                .attr("y1", function (d) { return d.source.y  })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
            self.nodes.selectAll("circle")
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
            self.nodes.selectAll("text")
                .attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; });

            self.nodes.each(self.collide(0.5)); // prevent collision
        });

        /* update linked log */
        for (var i = 0; i < data.nodes.length; i++) self.linkedByIndex[i + "," + i] = 1;
        data.links.forEach(function (d) {
            self.linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });
    },

    init: function(){
        var self = this;

        var canvasWidth = d3.select(self.target).style("width"),
            canvasHeight = d3.select(self.target).style("height");

        /* Set the canvas size based on mbostock's best practices */
        self.width = parseInt(canvasWidth) - self.margin.left - self.margin.right;
        self.height = parseInt(canvasHeight) - self.margin.top - self.margin.bottom;

        /* Create SVG element inside the target HTML element */
        self.svg = d3.select(self.target).append("svg")
            .attr("width", self.width)
            .attr("height", self.height);

        self.create();
    }
}