/**
 * Created by juan on 11/23/15.
 */

function StreamGraph(target, stream_data, startYear, endYear,user){
    var self = this;

    self.data = stream_data;

    self.user=user;

    self.stack = d3.layout.stack()
        .offset("silhouette");

    self.data = self.formatData();
    self.stack(self.data);
    self.max = d3.max(self.data, function(d){
        return d3.max(d, function(d){
            return d.y0 + d.y;
        });
    });

    self.tooltip = null;

    /* container attributes */
    self.target = target;
    self.margin = {top: 50, right: 20, bottom: 40, left: 80};
    self.height = 0;
    self.width = 0;
    self.svg = null;

    /* axis attributes */
    self.x = null;
    self.y = null;
    self.brush = null;
    self.startYear = startYear;
    self.endYear = endYear;
    self.yearsSelected = [self.startYear, self.endYear];
    self.extentTracker = [self.startYear, self.endYear];

    self.leftOpaqueSection = null;
    self.rightOpaqueSection = null;
}

StreamGraph.prototype = {
    constructor: StreamGraph,

    formatData: function(){
        var self = this;
        /* get all unique genres */
        genres = [];
        self.data.forEach(function(elemX){
            elemX.Genres.forEach(function(genre){
                if (genres.indexOf(genre.Name) == -1)
                    genres.push(genre.Name);
            });
        });

        /* convert data to percentages */
        for (var i = 0; i < self.data.length; i++){
            total = 0;
            for (var j = 0; j < self.data[i].Genres.length; j++) total += self.data[i].Genres[j].Relevance;
            for (var j = 0; j < self.data[i].Genres.length; j++)
                self.data[i].Genres[j].Relevance = 100 * (self.data[i].Genres[j].Relevance/total);
        }

        var results = [];
        var startYear = self.data[0].Year;
        var endYear = self.data[self.data.length - 1].Year;

        for (var i = startYear; i < endYear + 1; i++){
            elem = {};
            elem.year = i;
            elem.genres = [];

            for (var j = 0; j < genres.length; j++){
                genre = {};
                genre.name = genres[j];
                genre.x = j;
                genre.y = 0;
                elem.genres.push(genre);
            }

            results.push(elem);
        }

        var index;
        for (var i = 0; i < self.data.length; i++){
            for (var j = 0; j < self.data[i].Genres.length; j++){
                index = genres.indexOf(self.data[i].Genres[j].Name);
                results[i].genres[index].y = self.data[i].Genres[j].Relevance;
            }
        }

        /* if element not in top 10, set relevance == 0 */
        /*
        var top = 0;
        var sortF = function(a, b) {
            return parseInt(b.y) - parseInt(a.y);
        }

        for (var i = 0; i < results.length; i++){
            var copy = results[i].genres.sort(sortF).slice(0, 11);
            for (var j = 0; j < results[i].genres.length; j++){
                var exist = false;
                for (var k = 0; k < copy.length; k++){
                    if (results[i].genres[j].name == copy[k].name){
                        exist = true;
                    }
                }
                if (exist == false)
                    results[i].genres[j].y = 0;
            }
        }*/


        /* convert into a stacked way */
        var results2 = [];
        for(var i = 0; i < genres.length; i++){
            var gens = [];
            for(var j = 0; j < results.length; j++){
                gens[j] = results[j].genres[i];
                gens[j].year = results[j].year;
            }
            results2[i] = gens;
        }

        for(var i = 0; i < results2.length; i++) {
            for(var j = 0; j < results2[i].length; j++){
                results2[i][j].x = j;
            }
        }

        return results2;
    },

    /* moves the left slider by updating its width in x pixels. The left value remains
     * constant so the square always increases to the right.*/
    moveLeftSlider: function(x){
        d3.select(".left-opaque").style("width", x + "px");
    },

    /* moves the right slider by updating its width and left. The left value moves
     * x pixels to the left while the widths increases by the same value. This makes
     * the square to be moving to the left.*/
    moveRightSlider: function(x){
        var self = this;
        d3.select(".right-opaque")
            .style("width", x + "px")
            .style("left", self.width + self.margin.left - x + "px");
    },

    /* sets the brush behavior when dragging the right and left corners or moving
     * (which is disabled for the purposes of this graph). It also sets the ondemand
     * call of the brush when click on the years at the axis.
     * Params: event: 'manual' and years only send when clicking on the years at the axis.*/
    brushed: function(event, yearSelected){
        var self = this,
            extent0 = self.brush.extent(),   // stores brush actual state
            extent1;                    // stores brush rounded state

        // if clicking on a year
        if (event == 'manual'){
            if (self.yearsSelected[0] != yearSelected[0])
                self.moveLeftSlider(self.x(yearSelected[0]));
            if (self.yearsSelected[1] != yearSelected[1])
                self.moveRightSlider(self.x(self.endYear) - self.x(yearSelected[1]));

            extent1 = [yearSelected[0], yearSelected[1]];
            self.yearsSelected = extent1;
            self.extentTracker = extent1;
        }
        // if resizing
        else {
            extent1 = extent0.map(Math.round);

            // if empty when rounded, use floor & ceil instead
            if (extent1[0] >= extent1[1]) {
                extent1[0] = Math.floor(extent0[0]);
                extent1[1] = Math.ceil(extent0[1]);
            }

            /* make jumps of 10 years so only years finishing in 0 are selected */
            if (extent1[0]%10 < 5) extent1[0] = extent1[0] - (extent1[0]%10);
            else extent1[0] = extent1[0] - (extent1[0]%10) + 10;

            if (extent1[1]%10 < 5) extent1[1] = extent1[1] - (extent1[1]%10);
            else extent1[1] = extent1[1] - (extent1[1]%10) + 10;

            /* only move opaque section that has been updated */
            if (self.extentTracker[0] != extent1[0])
                self.moveLeftSlider(self.x(extent1[0]));
            if (self.extentTracker[1] != extent1[1])
                self.moveRightSlider(self.x(2000) - self.x(extent1[1]));

            self.extentTracker = [extent1[0], extent1[1]];


        }

        /* updates the brush position */
        d3.select(".brush").call(self.brush.extent(extent1));
    },

    init: function(){
        var self = this;

        var canvasWidth = d3.select(self.target).style("width"),
            canvasHeight = d3.select(self.target).style("height");

        /* Set the canvas size based on mbostock's best practices */
        self.width = parseInt(canvasWidth) - self.margin.left - self.margin.right;
        self.height = parseInt(canvasHeight) - self.margin.top - self.margin.bottom;

        /* create the axis functions for mapping elements to axis position */
        self.x = d3.scale.linear()
            .domain([self.startYear, self.endYear])
            .range([0, self.width]);

        self.y = d3.scale.linear()
            .domain([0, self.max])
            .range([self.height, 0]);

        /* create d3 brush element referencing the X axis */
        self.brush = d3.svg.brush()
            .x(self.x)
            .extent([self.startYear, self.endYear])
            .on("brush", function(){ self.brushed() });

        /* the X axis is located at the bottom to show the years */
        var xAxis = d3.svg.axis()
            .scale(self.x)
            .orient("bottom")
            .tickFormat(d3.format("d"));

        var color = d3.scale.category20();
        /*
        var color = d3.scale.ordinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
*/

        /* The area function get the path positions along the graph*/
        var area = d3.svg.area()
            .x(function(d) {
                return self.x(d.x + self.startYear);
            })
            .y0(function(d) {
                return self.y(d.y0); })
            .y1(function(d) { return self.y(d.y0 + d.y); });

        /* create the streamgraph SVG container and X axis */
        self.svg = d3.select(self.target).append("svg")
            .attr("width", self.width + self.margin.left + self.margin.right)
            .attr("height", self.height + self.margin.top + self.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

        self.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + self.height + ")")
            .call(xAxis);

        /* create the brush before the path elements so brush does not blocks the hover over
         * each element. http://wrobstory.github.io/2013/11/D3-brush-and-tooltip.html */
        var gBrush = self.svg.append("g")
            .attr("class", "brush")
            .call(self.brush);

        gBrush.selectAll("rect")
            .attr("height", self.height);

        /* create the path elements for each genre */
        for(var i = 0; i < self.data[0].length; i++)
            self.data[0][i].y0 = 0;

        var paths = self.svg.selectAll(".layer")
            .data(self.data)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", function(d){
                var x = area(d);
                return area(d); })
            .style("fill", function() { return color(Math.random()); });

        /* add the hover over events. Reduce the opacity of all the path not selected
         * while mouseover. Restore opacity when mouseout */
        self.svg.selectAll(".layer")
            .attr("opacity", 1)
            .on("mouseover", function(d, i) {
                self.svg.selectAll(".layer").transition()
                    .duration(250)
                    .attr("opacity", function(d, j) {
                        return j != i ? 0.3 : 1;
                    });
                mousex = d3.mouse(this);
                var invertedx = self.x.invert(mousex[0]);

                self.tooltip.html( "<p>" + d[0].name + "</p>" )
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px")
                    .style("visibility", "visible");
                console.log(d[0].name);
            })
            .on("mouseout", function(d, i) {
                self.svg.selectAll(".layer")
                    .transition()
                    .duration(250)
                    .attr("opacity", "1");

                self.tooltip.style("visibility", "hidden");
            });

        self.leftOpaqueSelection = d3.select(self.target)
            .append("div")
            .attr("class", "left-opaque")
            .style("position", "absolute")
            .style("z-index", "50")
            .style("width", "1px")
            .style("height", self.height + "px")
            .style("top", self.margin.top + "px")
            .style("bottom", "30px")
            .style("left", self.margin.left + "px");

        self.rightOpaqueSelection = d3.select(self.target)
            .append("div")
            .attr("class", "right-opaque")
            .style("position", "absolute")
            .style("z-index", "50")
            .style("width", "1px")
            .style("height", self.height+ "px")
            .style("top", self.margin.top + "px")
            .style("bottom", "30px")
            .style("left", self.width + self.margin.left + "px");

        gBrush.selectAll(".extent,.resize,.background")
            .remove();

        self.tooltip = d3.select(self.target)
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("z-index", "20")
            .style("visibility", "hidden")
            .style("top", "30px")
            .style("left", "55px");

        function dragmove() {
            mousex = d3.mouse(this);
            d3.select(this).attr("cx", mousex[0]);
        }

        function dragend(side) {
            var year = self.x.invert(mousex[0]);

            if (side == 'right')
                year = Math.round(year) + (self.endYear - self.startYear);
            else
                year = Math.round(year);

            if (year%10 < 5) year = year - (year%10);
            else year = year - (year%10) + 10;

            if (side == 'left') {
                self.brushed('manual', [year, self.yearsSelected[1]]);
                d3.select(".handle." + side).attr("cx", self.x(year));
            } else {
                d3.select(".handle." + side).attr("cx", self.x(year) - self.width);
                self.brushed('manual', [self.yearsSelected[0], year]);
            }

            if(self.user =="user1")
            {

                
                   
                    $.getJSON(
                                'http://cs424.azurewebsites.net/api/TopArtists?startYear='+self.startYear+'&endYear='+self.endYear, 
                                function(data) {
                                    console.log(data);
                                    $$("user1_top_ten_artists").clearAll();
                                    $$("user1_top_ten_artists").load('http://cs424.azurewebsites.net/api/TopArtists?startYear='+self.extentTracker[0]+'&endYear='+self.extentTracker[1]);

                                    $$("user1_top_ten_genres").clearAll();
                                    $$("user1_top_ten_genres").load('http://cs424.azurewebsites.net/api/TopGenresByDecade?startYear='+self.extentTracker[0]+'&endYear='+self.extentTracker[1]);
                                    }
                            );
                

            }
            else if(self.user=="user2")
            {
                 $.getJSON(
                                'http://cs424.azurewebsites.net/api/TopArtists?startYear='+self.startYear+'&endYear='+self.endYear, 
                                function(data) {
                                    console.log(data);
                                    $$("user2_top_ten_artists").clearAll();
                                    $$("user2_top_ten_artists").load('http://cs424.azurewebsites.net/api/TopArtists?startYear='+self.extentTracker[0]+'&endYear='+self.extentTracker[1]);

                                    $$("user2_top_ten_genres").clearAll();
                                    $$("user2_top_ten_genres").load('http://cs424.azurewebsites.net/api/TopGenresByDecade?startYear='+self.extentTracker[0]+'&endYear='+self.extentTracker[1]);
                                    }
                            );
            }


        }

        var dragRight = d3.behavior.drag()
            .on("drag", dragmove)
            .on("dragend", function() { dragend('right'); });

        var dragLeft = d3.behavior.drag()
            .on("drag", dragmove)
            .on("dragend", function() { dragend('left'); });

        var handleLeft = self.svg.append("circle")
            .attr("class", "handle left")
            .attr("transform", "translate(0," + self.height + ")")
            .attr("r", 12)
            .call(dragLeft);

        var handleRight = self.svg.append("circle")
            .attr("class", "handle right")
            .attr("transform", "translate(" + self.width + "," + self.height + ")")
            .attr("r", 12)
            .call(dragRight);
    }
}


function getTop10GenresPerYear(startYear, endYear){
    var jsonData;
    
    var url = "http://cs424.azurewebsites.net/api/TopGenres?startYear=" +
                startYear + "&endYear="+ endYear;

    $.ajax({
        dataType: "json",
        url: url,
        async: false,
        success: success
    });

    return jsonData;

    function success(data){
        jsonData = data;
    }
}