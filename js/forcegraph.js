/**
 * Created by juan on 11/16/15.
 */

function ForceGraph(target, startYear, endYear, colorU1, colorU2, colorCoincidence, URI, data){
    var self = this;

    self.URI = URI;

    self.worldArtists = data;
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

    //self.getTopArtistsperDecade();
}

ForceGraph.prototype = {
    constructor: ForceGraph,

    addNodeControls: function(){
        var self = this;

        var nav = d3.select(self.target).append("nav")
            .attr("class", "menu-ui")
            .style("position", "absolute")
            .attr("id", "menu-ui-forcegraph");

        var btn1 = nav.append("a")
            .attr("id", "btn-force-topten")
            .attr("class", "selected")
            .html("Top Ten Artists");
        btn1.on("click", function() {
            self.mode = "global";
            if (!$(this).hasClass("selected")){
                $(this).addClass("selected");
                $("#btn-force-user").removeClass("selected");
            }
            self.update();
        });


        btn2 = nav.append("a")
            .attr("id", "btn-force-user")
            .html("User Information");
        btn2.on("click", function(){
            self.mode = "user";
            if (!$(this).hasClass("selected")){
                $(this).addClass("selected");
                $("#btn-force-topten").removeClass("selected");
            }
            self.update();
        });

    },

    addZoomControls: function(){
        var self = this;

        var zoomContainer = d3.select(self.target).append("nav")
            .attr("class", "menu-ui-zoom")
            .style("position", "absolute")
            .attr("id", "menu-ui-zoomContainer");

        var btnZoomIn = zoomContainer.append("a")
            .attr("id", "btn-zoomin")
            .html("+")
            .on("click", zoomClick);

        var btnZoomIn = zoomContainer.append("a")
            .attr("id", "btn-zoomout")
            .html("-")
            .on("click", zoomClick)

        function interpolateZoom (translate, scale) {
            return d3.transition().duration(350).tween("zoom", function () {
                var iTranslate = d3.interpolate(self.zoom.translate(), translate),
                    iScale = d3.interpolate(self.zoom.scale(), scale);
                return function (t) {
                    self.zoom
                        .scale(iScale(t))
                        .translate(iTranslate(t));
                    self.zoomed();
                };
            });
        }

        function zoomClick() {
            var clicked = d3.event.target,
                direction = 1,
                factor = 0.2,
                target_zoom = 1,
                center = [self.width / 2, self.height / 2],
                extent = self.zoom.scaleExtent(),
                translate = self.zoom.translate(),
                translate0 = [],
                l = [],
                view = {x: translate[0], y: translate[1], k: self.zoom.scale()};

            d3.event.preventDefault();
            direction = (this.id === 'btn-zoomin') ? 1 : -1;
            target_zoom = self.zoom.scale() * (1 + factor * direction);

            if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

            translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
            view.k = target_zoom;
            l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

            view.x += center[0] - l[0];
            view.y += center[1] - l[1];

            interpolateZoom([view.x, view.y], view.k);
        }

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

        self.links = [];
        self.nodes = [];
        self.force
            .links(self.links)
            .nodes(self.nodes);

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

            var windowWidth = $(window).width();
            var circlePathRadius, mainGenreRadius;
            if (windowWidth > 7000){
                circlePathRadius = 45;
                mainGenreRadius = 30;
            } else {
                circlePathRadius = 20;
                mainGenreRadius = 12;
            }

            if (d.type == 'artist') radius = circlePathRadius + 10;
            else radius = mainGenreRadius + 10;

            rb = 2 * radius+ self.padding;
            nx1 = d.x - rb;
            nx2 = d.x + rb;
            ny1 = d.y - rb;
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
            self.zoom.translate() + ")scale(" + self.zoom.scale() + ")");
    },

    update: function(){
        var self = this;

        /* get the size params depending on the window width  */
        var windowWidth = $(window).width();
        var imageSize, circlePathRadius, genreRadius, mainGenreRadius,
            charge, linkDistance, imageOffset, textDx, textDy;
        if (windowWidth > 7000){
            imageSize = 100;
            circlePathRadius = 45;
            textDx = 45;
            textDy = 5;
            genreRadius = 20;
            mainGenreRadius = 30;
            imageOffset = 50;
            charge = -200;
            linkDistance = 400;
        } else {
            imageSize = 50;
            circlePathRadius = 20;
            textDx = 15;
            textDy = 5;
            genreRadius = 8;
            mainGenreRadius = 12;
            imageOffset = 25;
            charge = -120;
            linkDistance = 180;
        }

        /* remove any existing content */
        self.svg.selectAll("line").remove();
        self.svg.selectAll("g.node").remove();

        /* populate the nodes and links based on the graph mode */
        self.fetchNodesLinks();

        /* append all the links that represent the relationships
         * between nodes and stored in self.links (force.links) */
        var link = self.svg.selectAll("line")
            .data(self.links);

        link.enter().append("line")
            .attr("class", "link")
            .classed("resizable", true)
            .style("stroke-width", function(d){
                return Math.sqrt(d.value);
            });

        link.exit().remove();

        /* append each node as a SVG group that will contain an
         * image, circle border and clip path for artists, and a
         * circle for genre */
        var node = self.svg.selectAll(".node")
            .data(self.nodes);

        var nodeEnter =  node
            .enter().append("g")
            .attr("class", "node")
            .classed("resizable", true)
            //.call(self.force.drag)
            .on('dblclick', self.releaseNode)
            .on("mousedown", function(){
                self.svg.on("zoom", null);
            })
            .call(self.nodeDrag);

        nodeEnter.append("text")
            .attr("dx", function(d){
                /*
                if (d.type == "artist") return "17";
                else return "10";*/
                return textDx;
            })
            .attr("dy", function(d){
                /*
                if (d.type == "artist") return ".45em";
                else return ".35em";*/
                return textDy;
            })
            .text(function(d){
                if (d.type == "artist")
                    return d.ArtistName;
                else
                    return d.Name;
            })
            .style("stroke", "black")
            .style("opacity", 0);

        var defs = nodeEnter.append("defs")
            .append("clipPath")
             .attr("id", function(d){
                 var clip_id;
                 if (d.type == "artist") clip_id = d.ArtistId;
                 else clip_id = d.Name;
                 return self.mode + "_" + clip_id;
             })
            .append("use")
             .attr("xlink:href", function(d){
                 var clip_id;
                 if (d.type == "artist") clip_id = d.ArtistId;
                 else clip_id = d.Name;
                 return "#" + self.mode + "_circle" + "_" + clip_id;
             });

        nodeEnter
            .append("circle")
             .attr("id", function(d){
                 var clip_id;
                 if (d.type == "artist") clip_id = d.ArtistId;
                 else clip_id = d.Name;
                 return self.mode + "_circle" + "_" + clip_id;
             })
              .attr("class", function(d){
                return "clippath-" + d.type;
              })
              .attr("r", circlePathRadius)
              .attr("fill", "none")
              .attr("stroke", function (d) {
                  if (d.type == 'artist'){
                      if (d.ArtistSelected == 1)
                          return self.colorUser1;
                      else if (d.ArtistSelected == 2)
                          return self.colorUser2;
                      else if (d.ArtistSelected == 3)
                          return self.colorCoincidente;
                  } else return self.color(d.group);
              })
              .attr("stroke-width", 3);

        d3.selectAll(".clippath-genre").remove();

        nodeEnter.append("circle")
            .attr("r", function(d){
                if (d.type == "genre"){
                    if (d.priority == 1)
                        return mainGenreRadius;
                    else
                        return genreRadius;
                } else
                    return genreRadius;
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
            })
            .on('click', function(d){ self.connectNodes(d) });

        self.svg.selectAll(".circleartist").remove();
        self.svg.selectAll(".rectgenre").remove();

        nodeEnter.append("image")
            .attr("xlink:href",  function(d) {
                if (d.type == 'artist')
                    return d.ArtistImageLink;
            })
            .attr("x", function(d) { return (0);})
            .attr("y", function(d) { return (0);})
            .attr("height", imageSize)
            .attr("width", imageSize)
            .attr("clip-path", function(d){
                var clip_id;
                if (d.type == "artist") clip_id = d.ArtistId;
                else clip_id = d.Name;

                clip_id = self.mode + "_" + clip_id;

                return "url(#" + clip_id + ")";
            })
            .on('click', function(d){ self.connectNodes(d) });

        node.exit().remove();

        self.force.on("tick", function(){
            d3.selectAll(".circlegenre")
                .attr("cx", function (d) { return Math.max(30, Math.min(self.width - 30, d.x)); })
                .attr("cy", function (d) { return Math.max(30, Math.min(self.width - 30, d.y)); });

            d3.selectAll(".clippath-artist")
                .attr("cx", function (d) { return Math.max(30, Math.min(self.width - 30, d.x)); })
                .attr("cy", function (d) { return Math.max(30, Math.min(self.width - 30, d.y)); });

            node.selectAll("text")
                .attr("x", function (d) { return d.x + 10; })
                .attr("y", function (d) { return d.y; });

            node.selectAll("image")
                .attr("x", function (d) { return d.x - imageOffset; })
                .attr("y", function (d) { return d.y - imageOffset; });

            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y  })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node.each(self.collide(0.1)); // prevent collision
        });

        self.force
            .charge(charge)
            .linkDistance(linkDistance)
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

        self.addNodeControls();
        self.addZoomControls();
        self.update();
    }
}

function getTopArtistsperDecade(startYear, endYear, URI){
    var startYear = startYear;
    var endYear = endYear;
    var artists = [];

    while (startYear + 10 <= endYear){
        var url = URI + 'TopArtists?startYear=' +
            + startYear  + '&endYear=' + (startYear + 9);

        $.ajax({
            dataType: "json",
            url: url,
            async: false,
            success: success
        });

        startYear += 10;
    }

    return artists;

    /* fetch the data from the JSON call into an artist array */
    function success(data){
        for(var i=0; i < data.length; i++){
            if (!artistAlreadyAdded(data[i]))
                artists.push(data[i]);
        }
    }

    /* check if the artist was already added to the array to avoid duplicates */
    function artistAlreadyAdded(artist){
        for(var i=0; i < artists.length; i++)
            if (artists[i].ArtistName === artist.ArtistName)
                return true;
        return false;
    }
}