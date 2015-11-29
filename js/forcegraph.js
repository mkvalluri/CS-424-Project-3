/**
 * Created by juan on 11/16/15.
 */

function ForceGraph(target, startYear, endYear, colorU1, colorU2, colorCoincidence, URI){
    var self = this;

    self.URI = URI;

    self.worldArtists = [];
    self.usersArtists = [];

    self.startYear = startYear;
    self.endYear = endYear;

    /* container attributes */
    self.target = target;
    self.margin = {top: 0, right: 0, bottom: 0, left: 0};
    self.height = 0;
    self.width = 0;
    self.svg = null;
    self.zoom = null;
    self.zoomNull = null;

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

    /* Mode: Defines if the graph is showing information about the top ten artists
     *  per decade (global) or if the graph shows the artists added by users (user).
     *  By default start showing the global data */
    self.mode = 'global';

    self.links = [];
    self.nodes = [];

    self.getTopArtistsperDecade();
}

ForceGraph.prototype = {
    constructor: ForceGraph,

    addButtons: function(){
        var self = this;

        var nav = d3.select(self.target).append("nav")
            .attr("class", "menu-ui")
            .attr("id", "menu-ui-forcegraph");

        nav.append("a")
            .attr("id", "btn-force-topten")
            .html("Top Ten Artists");

        nav.append("a")
            .attr("id", "btn-force-user")
            .html("User Information");
    },

    getTopArtistsperDecade: function(){
        var self = this;

        var startYear = self.startYear;
        var endYear = self.endYear;

        while (startYear + 10 <= endYear){
            var url = self.URI + 'TopArtists?startYear=' +
                + startYear  + '&endYear=' + (startYear + 10);

            $.ajax({
                dataType: "json",
                url: url,
                async: false,
                success: success
            });

            startYear += 10;
        }

        /* fetch the data from the JSON call into an artist array */
        function success(data){
            for(var i=0; i < data.length; i++){
                if (!artistAlreadyAdded(data[i]))
                    self.worldArtists.push(data[i]);
            }
        }

        /* check if the artist was already added to the array to avoid duplicates */
        function artistAlreadyAdded(artist){
            for(var i=0; i < self.worldArtists.length; i++)
                if (self.worldArtists[i].ArtistName === artist.ArtistName)
                    return true;
            return false;
        }
    },

    fetchNodesLinks: function(){
        var self = this,
            artists = null;

        if (self.mode == "global")
            artists = self.worldArtists;
        else
            artists = self.usersArtists;

        /* start adding the elements to the nodes and links. artist should be
        * mapped to their genres and connecting artists by similar genres */
        // First add all the artists
        var genres = [];
        for(var i=0; i < artists.length; i++){
            artists[i].type = 'artist';
            self.nodes.push(artists[i]);

            for(var j=0; j < artists[i].ArtistGenres.length; j++){
                var genre = artists[i].ArtistGenres[j];
                var index = genreAlreadyAdded(genre);
                genre.priority = 0;

                if (artists[i].ArtistMainGenre == genre.Name)
                    genre.priority = 1;

                if (index == -1){
                    genres[genres.length] = genre;
                    self.links.push({ source: i,
                                      target: (genres.length + artists.length - 1),
                                      priority: genre.priority
                    });
                } else {
                    if (genre.priority == 1)
                        genres[index].priority = 1;
                    self.links.push({source: i,
                                     target: (index + artists.length),
                                     priority: genre.priority
                    });
                }
            }
        }

        for(var i=0; i < genres.length; i++){
            genres[i].type = 'genre';
            self.nodes.push(genres[i]);
        }

        /* check if the genre was already added to the array to avoid duplicates */
        function genreAlreadyAdded(genre){
            if (genres.length == 0) return -1;

            for(var i=0; i < genres.length; i++)
                if (genres[i].Name === genre.Name)
                    return i;
            return -1;
        }
    },

    collide: function(alpha){
        var self = this;

        var quadtree = d3.geom.quadtree(self.nodes);
        return function(d) {
            var rb, nx1, nx2, ny1, ny2, radius;

            if (d.type == 'artist') radius = 20;
            else radius = 8;

            rb = 2 * radius+ self.padding;
            nx1 = d.x - rb;
            nx2 = d.x + rb;
            ny1 = d.y - rb;
            ny2 = d.y + rb;
            /*
            if (d.type == "genre") {
                rb = 2 * self.radius + self.padding;
                nx1 = d.x - rb;
                nx2 = d.x + rb;
                ny1 = d.y - rb;
                ny2 = d.y + rb;
            } else {
                rb = 10 + self.padding;
                nx1 = d.x - rb;
                nx2 = d.x + rb;
                ny1 = d.y - rb;
                ny2 = d.y + rb;
            }*/

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
        //this.svg.on(".zoom", null);
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
        //this.svg.call(self.zoom);
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
            /*
            self.svg.selectAll(".node").style("opacity", function (o) {
                return self.areNeighbors(d, o) | self.areNeighbors(o, d) ? 1 : 0.1;
            });*/
            self.svg.selectAll(".node").classed("neighbour", function (o) {
                return self.areNeighbors(d, o) | self.areNeighbors(o, d) ? true : false;
            });
            self.svg.selectAll(".node").classed("not-neighbour", function (o) {
                return self.areNeighbors(d, o) | self.areNeighbors(o, d) ? false : true;
            });

            self.svg.selectAll(".link").classed("neighbour", function (o) {
                return d.index==o.source.index | d.index==o.target.index ? true : false;
            });
            self.svg.selectAll(".link").classed("not-neighbour", function (o) {
                return d.index==o.source.index | d.index==o.target.index ? false : true;
            });

            /* if an artist is selected, mark the main priority in a different color */
            if (d.type == "artist"){
                var links = self.svg.selectAll(".link.neighbour");
                for(var i = 0; i < links[0].length; i++){
                    var dat = links[0][i].__data__;
                    if (dat.priority == 1){
                        var genreName = dat.target.Name;
                        /* search for it in the neighbour nodes*/
                        var nodes = self.svg.selectAll(".node.neighbour");
                        for(var i = 0; i < nodes[0].length; i++){
                            if (nodes[0][i].__data__.type == "genre" && nodes[0][i].__data__.Name == genreName) {
                                d3.select(nodes[0][i]).select("circle").classed("main-genre", true);
                                break;
                            }
                        }
                        break;
                    }
                }
            }

            self.svg.selectAll(".node.neighbour").select("text").style("opacity", 1);

            self.toogle = 1;
        } else {
            // Restore the opacity
            self.svg.selectAll(".node.neighbour").select("text").style("opacity", 0);
            self.svg.selectAll(".node.neighbour").classed("main-genre", false);
            self.svg.selectAll(".node.neighbour").classed("neighbour", false);
            self.svg.selectAll(".node.not-neighbour").classed("not-neighbour", false);
            self.svg.selectAll(".link.neighbour").classed("neighbour", false);
            self.svg.selectAll(".link.not-neighbour").classed("not-neighbour", false);
            self.toogle = 0;
        }
    },

    updateUserArtists: function(artists){
        var self = this;
        self.mode = "user";

        self.usersArtists = artists;
        self.update();
    },

    addNode: function(artist){
        var self = this;
        self.mode = "user";

        self.usersArtists.push(artist);
        self.update();
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

    findNode: function (node) {
        for (var i in nodes) {
            if (this.nodes[i]["name"] === node.name) return nodes[i];
        }
    },

    zoomed: function() {
        var self = this;

        self.svg.attr("transform", "translate(" +
            d3.event.translate + ")scale(" + d3.event.scale + ")");
        /*
        console.log(d3.event.scale);
        d3.selectAll(".resizable").attr("transform", "translate(" +
            d3.event.translate + ")scale(" + d3.event.scale + ")");*/
    },

    update: function(){
        var self = this;

        self.svg.selectAll("line").remove();
        self.svg.selectAll("g.node").remove();

        self.fetchNodesLinks();

        var link = self.svg.selectAll("line")
            .data(self.links);

        link.enter().append("line")
            .attr("class", "link")
            .classed("resizable", true)
            .style("stroke-width", function(d){
                return Math.sqrt(d.value);
            });

        link.exit().remove();

        var node = self.svg.selectAll(".node")
            .data(self.nodes);

        var nodeEnter =  node
            .enter().append("g")
            .attr("class", "node")
            .classed("resizable", true)
            //.call(self.force.drag)
            .on('click', function(d){ self.connectNodes(d) })
            .on('dblclick', self.releaseNode)
            .on("mousedown", function(){
                self.svg.on("zoom", null);
            })
            .call(self.nodeDrag);

        nodeEnter.append("circle")
            //.attr("width", 26)
            //.attr("height", 26)
            .attr("r", 20)
            .attr("class", function(d){ return "rect" + d.type; })
            .style("fill", function (d) {
                if (d.type == 'artist'){
                    if (d.ArtistSelected == 1)
                        return self.colorUser1;
                    else if (d.ArtistSelected == 2)
                        return self.colorUser2;
                    else if (d.ArtistSelected == 3)
                        return self.colorCoincidente;
                } else return self.color(d.group);
            });

        nodeEnter.append("circle")
            .attr("r", function(d){
                if (d.type == "genre"){
                    if (d.priority == 1)
                        return 8;
                    else
                        return 4;
                } else
                    return 1;
            })
            .attr("class", function(d){ return "circle" +  d.type; })
            .classed("node", true)
            .style("fill", function (d) {
                if (d.type == 'artist'){
                    if (d.ArtistSelected == 1)
                        return self.colorUser1;
                    else if (d.ArtistSelected == 2)
                        return self.colorUser2;
                    else if (d.ArtistSelected == 3)
                        return self.colorCoincidente;
                } else return self.color(d.group);
            });

        self.svg.selectAll(".circleartist").remove();
        self.svg.selectAll(".rectgenre").remove();

        nodeEnter.append("image")
            .attr("xlink:href",  function(d) {
                if (d.type == 'artist')
                    return d.ArtistImageLink;
            })
            .attr("x", function(d) { return (0);})
            .attr("y", function(d) { return (0);})
            .attr("height", 25)
            .attr("width", 25);

        nodeEnter.append("text")
            .attr("dx", function(d){
                if (d.type == "artist") return "17";
                else return "10";})
            .attr("dy", function(d){
                if (d.type == "artist") return ".45em";
                else return ".35em";
            })
            .text(function(d){
                if (d.type == "artist")
                    return d.ArtistName;
                else
                    return d.Name;
            })
            .style("stroke", "black")
            .style("opacity", 0);

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

            node.selectAll("circle")
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });

            node.selectAll("text")
                .attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; });

            node.selectAll("image")
                .attr("x", function (d) { return d.x - 10; })
                .attr("y", function (d) { return d.y - 10; });

            node.each(self.collide(0.5)); // prevent collision
        });

        self.force
            .charge(-120)
            .linkDistance(120)
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

        self.zoom = d3.behavior.zoom()
            .scaleExtent([1, 10])
            .on("zoom", function() { self.zoomed(); });

        self.zoomNull = d3.behavior.zoom()
            .on("zoom", function() { return; });

        /* Create SVG element inside the target HTML element */
        self.svg = d3.select(self.target).append("svg")
            .attr("width", self.width)
            .attr("height", self.height)
            .append("g")
                .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")")
            .call(self.zoom);

        self.force = d3.layout.force()
             .links(self.links)
             .nodes(self.nodes);
        //self.nodes = self.force.nodes();
        //self.links = self.force.links();

        self.addButtons();
        self.update();
    }
}