
//inspired by binkat's swimlane demo 


var lanes;
var laneLength;
var margin = {"top":20,"right":15,"bottom":15,"left":120};
var width = 8000 -margin.right - margin.left;
var height = 500 - margin.top - margin.bottom;
var miniHeight,mainHeight;
var x,x1,y1,y2;
var chart;
var main,mini;
var itemRects;
var brush;


function sharedTimeline(startYear,endYear){
	this.startYear=startYear;
	this.endYear=endYear;
}

sharedTimeline.prototype = {
	init: function(){
		lanes = ["rock","pop","jazz","hip-hop","others"];
		laneLength = lanes.length;
		items=shared_timeline_data;
		miniHeight = laneLength * 12 +50;
		mainHeight = height - miniHeight - 50;
console.log(width);
		x = d3.scale.linear()
				  .domain([0,getEndYear(0)])
				  .range([0,width]);
	    x1 = d3.scale.linear()
				 	.domain([0,width]);
		y1 = d3.scale.linear()
					.domain([0,laneLength])
					.range([0,mainHeight]);
		y2 = d3.scale.linear()
					.domain([0,laneLength])
					.range([0,miniHeight]);

		chart = d3.select("#shared_timeline")
					   .append("svg")
					   .attr("width",width+margin.right+margin.left)
					   .attr("height",height+margin.top+margin.bottom)
					   .attr("class","chart");

		chart.append("defs").append("clipPath")
			 .attr("id","clip")
			 .append("rect")
			 .attr("width",width)
			 .attr("height",mainHeight);

		var main = chart.append("g")
				.attr("transform","translate("+margin.bottom+","+margin.top+")")
				.attr("width",width)
				.attr("height",mainHeight)
				.attr("class","main");

		var mini = chart.append("g")
			.attr("transform","translate("+margin.bottom+","+(mainHeight+margin.top)+")")
			.attr("width",width)
			.attr("height",miniHeight)
			.attr("class","mini");


		main.append("g").selectAll(".laneLines")
			.data(shared_timeline_data)
			.enter()
			.append("line")
			.attr("x1",margin.right)
			.attr("y1",function(d){
				return getLane(d.ArtistMainGenre);
			})
			.attr("x2",width)
			.attr("y2",function(d){
				return getLane(d.ArtistMainGenre);
			})
			.attr("stroke","lightgray");

		main.append("g").selectAll(".laneText")
			.data(lanes)
			.enter()
			.append("text")
			.attr("x",-margin.right)
			.attr("y","0.5ex")
			.attr("text-anchor","end")
			.attr("class","laneText");

		mini.append("g").selectAll(".laneLines")
			.data(shared_timeline_data)
			.enter()
			.append("line")
			.attr("x1",margin.right)
			.attr("y1",function(d){
				return getLane(d.ArtistMainGenre);
			})
			.attr("x2",width)
			.attr("y2",function(d){
				return getLane(d.ArtistMainGenre);
			})
			.attr("stroke","lightgray");

			mini.append("g").selectAll(".laneText")
			.data(lanes)
			.enter()
			.append("text")
			.text(function(d){return d})
			.attr("x",-margin.right)
			.attr("y",function(d,i){return y2(i+.5);})
			.attr("dy",".5ex")
			.attr("text-anchor","end")
			.attr("class","laneText");


			itemRects = main.append("g")
					.attr("clip-path","url(#clip");

			mini.append("g").selectAll("miniItems")
				.data(items)
				.enter()
				.append("rect")
				.attr("class",function(d){
					return "miniItem" + getLane(d.ArtistMainGenre)
				})
				.attr("x",function(d){
					return x(d.start);
				})
				.attr("y",function(d){
					return y2(getLane(d.ArtistMainGenre)+.5) - .5;
				})
				.attr("width",function(d){

					console.log(x(getEndYear(d.end) - d.start));
					return x(getEndYear(d.end) - d.start);
				})
				.attr("height",10);

			mini.append("g").selectAll(".minilabels")
				.data(shared_timeline_data)
				.enter()
				.append("text")
				.text(function(d){return d.ArtistName})
				.attr("x",function(d){return x(d.start);})
				.attr("y",function(d){
					return y2(getLane(d.ArtistMainGenre)+.5);
				})
				.attr("dy",".5ex");

			brush = d3.svg.brush()
						.x(x)
						.on("brush",display);

			mini.append("g")
			.attr("class","x brush")
			.call(brush)
			.selectAll("rect")
			.attr("y",1)
			.attr("height",miniHeight -1);

			display();


			function display(){
	var rects,labels;
	var minExtent = brush.extent()[0];
	var maxExtent = brush.extent()[1];
	var visItems = shared_timeline_data.filter(function(d){return d.start < maxExtent && getEndYear(d.end) > minExtent;});

	mini.select(".brush")
		.call(brush.extent([minExtent,maxExtent]));

	x1.domain([minExtent,maxExtent]);

	rects = itemRects.selectAll("rects")
			.data(visItems, function(d){
				return d.ArtistName;
			})
			.attr("x",function(d){return x1(d.start);})
			.attr("width",function(d){return x1(d.end) - x1(d.start);});

	rects.enter().append("rect")
		.attr("class",function(d){
			return "miniItem" + getLane(d.ArtistMainGenre);
		})
		.attr("x",function(d){
			return x1(d.start);
		})
		.attr("y",function(d){
			return y1(getLane(d.ArtistMainGenre))+10;
		})
		.attr("width",function(d){
			return x1(getEndYear(d.end)) - x1(d.start);
		})
		.attr("height",function(d){
			return .8*y1(1);
		});

		rects.exit().remove();


		labels = itemRects.selectAll("text")
		.data(visItems, function(d){
			return d.ArtistName;
		})
		.attr("x",function(d){
			return x1(Math.max(d.start,minExtent) + 2)
		});

		labels.enter().append("text")
		.text(function(d){
			return d.ArtistName;
		})
		.attr("x",function(d){
			return x1(Math.max(d.start,minExtent));
		})
		.attr("y",function(d){
			return y1(getLane(d.ArtistMainGenre)+.5);
		})
		.attr("text-anchor","start");

		labels.exit().remove();





}



	}
}

function getLane(artistMainGenre){

	switch(artistMainGenre){
					case "rock":
						return 0;
					break;

					case "pop":
						return 1;
					break;

					case "jazz":
						return 2;
					break;

					case "hip-hop":
						return 3;
					break;

					case "others":
						return 4;
					break;
	}
}

function getEndYear(end){
	if(end==0)
		return new Date().getFullYear();
	else
		return end;
}

