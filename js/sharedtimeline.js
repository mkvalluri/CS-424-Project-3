
//inspired by binkat's swimlane demo 

var lanes;
var laneLength;
var margin = {"top":20,"right":15,"bottom":15,"left":120};
var width = 8000-margin.right - margin.left;
var height = 600 - margin.top - margin.bottom;
var miniHeight,mainHeight;
var x,x1,y1,y2;
var chart;
var mini;
var itemRects;

function sharedTimeline(startYear,endYear){
	this.startYear=startYear;
	this.endYear=endYear;
}

sharedTimeline.prototype = {
	init: function(){
		lanes = ["rock","pop","jazz","hip-hop","others"];
		laneLength = lanes.length;
		items=shared_timeline_data;
		miniHeight = laneLength * 12 +500;
	

		x = d3.scale.linear()
				  .domain([1930,getEndYear(0)])
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

		

		var mini = chart.append("g")
			.attr("transform","translate("+margin.bottom+","+(margin.top)+")")
			.attr("width",width)
			.attr("height",miniHeight)
			.attr("class","mini");


	

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
			.attr("x","150px")
			.attr("y",function(d,i){return y2(i+.5);})
			.attr("dy",".5ex")
			.attr("text-anchor","end")
			.attr("class","laneText");




			mini.append("g").selectAll("miniItems")
				.data(items)
				.enter()
				.append("rect")
				.attr("class",function(d){
					return d.user;
				})
				.attr("x",function(d){
					return x(d.start);
				})
				.attr("y",function(d){
					return y2(getLane(d.ArtistMainGenre)+.5) - .5;
				})
				.attr("width",function(d){
					return x((getEndYear(d.end) - d.start)+1930);
				})
				.attr("height",30);

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

			xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom")
						.tickFormat(d3.format("d"));

			mini.append("g")
				.attr("class","x axis")
				.attr("transform","translate(5,550)")
				.call(xAxis);


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