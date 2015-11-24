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
        var c = self.linkedByIndex[a.index + "," + b.index];
        return c;
    },

    connectNodes: function(d){
        var self = this;

        if (self.toogle == 0){
            // Reduce the opacity of the nodes except of the node neighbors
            self.svg.selectAll(".node").style("opacity", function (o) {
                return self.areNeighbors(d, o) | self.areNeighbors(o, d) ? 1 : 0.1;
            });

            self.svg.selectAll(".link").style("opacity", function (o) {
                return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
            });
            self.toogle = 1;
        } else {
            // Restore the opacity
            self.svg.selectAll(".node").style("opacity", 1);
            self.svg.selectAll(".link").style("opacity", 1);
            self.toogle = 0;
        }
    },

    addNode: function(artist){
        this.nodes.push(artist);
        this.update();
    },

    removeNode: function(node){
        var i = 0;
        var n = this.findNode(node);

        while (i < links.length) {
            if ((links[i]['source'] == n) || (links[i]['target'] == n)) {
                links.splice(i, 1);
            }
            else i++;
        }

        this.nodes.splice(node.index, 1);
        this.update();
    },

    removeLink: function (source, target) {
        for (var i = 0; i < links.length; i++) {
            if (links[i].source.id == source && links[i].target.id == target) {
                links.splice(i, 1);
                break;
            }
        }
        //update();
    },

    removeallLinks: function () {
        links.splice(0, links.length);
        //update();
    },

    removeAllNodes: function () {
        nodes.splice(0, links.length);
        //update();
    },

    addLink: function (source, target, value) {
        links.push({"source": self.findNode(source), "target": findNode(target), "value": value});
        update();
    },

    findNode: function (node) {
        for (var i in nodes) {
            if (this.nodes[i]["name"] === node.name) return nodes[i];
        }
    },

    findNodeIndex: function (node) {
        for (var i = 0; i < nodes.length; i++) {
            if (this.nodes[i].name == node.name) {
                return i;
            }
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

    update: function(){
        var self = this;

        self.svg.selectAll("line").remove();
        self.svg.selectAll("g.node").remove();

        var link = self.svg.selectAll("line")
            .data(self.links);

        link.enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d){
                return Math.sqrt(d.value);
            });

        link.exit().remove();

        var node = self.svg.selectAll(".node")
            .data(data.nodes);

        var nodeEnter =  node
            .enter().append("g")
            .attr("class", "node")
            .call(self.force.drag)
            .on('click', function(d){ self.connectNodes(d) })
            .on('dblclick', self.releaseNode)
            .call(self.nodeDrag);

        nodeEnter.append("rect")
            .attr("width", 26)
            .attr("height", 26)
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


        var images = nodeEnter.append("image")
            .attr("xlink:href",  function(d) { return d.img;})
            .attr("x", function(d) { return (0);})
            .attr("y", function(d) { return (0);})
            .attr("height", 20)
            .attr("width", 20);

        /*
        nodeEnter.append("text")
            .attr("dx", 10)
            .attr("dy", ".35em")
            .text(function(d){ return d.name })
            .style("stroke", "gray");*/

        node.exit().remove();

        self.force.on("tick", function(){
            link
                .attr("x1", function (d) {
                    return d.source.x; })
                .attr("y1", function (d) { return d.source.y  })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node.selectAll("rect")
                .attr("x", function (d) { return d.x - 11; })
                .attr("y", function (d) { return d.y - 11; });
            /*
            node.selectAll("circle")
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });*/
            /*
            node.selectAll("text")
                .attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; });*/

            node.selectAll("image")
                .attr("x", function (d) { return d.x - 8; })
                .attr("y", function (d) { return d.y - 8; });

            node.each(self.collide(0.5)); // prevent collision
        });

        self.force
            .charge(-120)
            .linkDistance(30)
            .friction(0.9)
            .size([self.width, self.height])
            .start();

        /* update linked log */
        for (var i = 0; i < self.nodes.length; i++) self.linkedByIndex[i + "," + i] = 1;
        self.links.forEach(function (d) {
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
        self.force = d3.layout.force()
            .links(self.data.links)
            .nodes(self.data.nodes);
        self.nodes = self.force.nodes();
        self.links = self.force.links();

        self.update();
    }
}