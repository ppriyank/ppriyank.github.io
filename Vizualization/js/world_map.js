import { plotting_all } from './dashboard.js';


// http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f
// http://bl.ocks.org/hollasch/12e6627b4a8d7c3ceaac5297fa1d3169

var margin = {top: 0, right: 0, bottom: 0, left: 0}

var parentDiv = document.getElementsByClassName("World")[0];
var width = parentDiv.clientWidth - margin.left - margin.right;
var height = parentDiv.clientHeight - margin.top - margin.bottom;
var x_axis_length = [margin.left, width - 3 * margin.right]
var y_axis_length = [height- margin.bottom - 50,  margin.top]

var plot_width = x_axis_length[1] - x_axis_length[0]
var plot_margin_x_left = margin.left

var plot_margin_y_top = margin.top
var plot_height = y_axis_length[0] - y_axis_length[1]

var svg = d3.select(parentDiv)
          .append("svg")
            .attr("width", plot_width)
            .attr("height", plot_height)
            .attr("transform","translate(" + (plot_margin_x_left) + "," + plot_margin_y_top + ")");

// var borderRect = svg.append("rect")
//           .attr("stroke","#000000")
//           .attr("fill-opacity",0.5)
//           .attr("stroke-width",1)
//           .attr("width", plot_width)
//           .attr("height",plot_height)
//           .attr("transform","translate(" + (0) + "," + 0 + ")");


const format_3_decimal_places = d3.format(".3f");
// create a tooltip
var Tooltip = d3.select(".World")
// var Tooltip = svg
	.append("div")
	.attr("class", "tooltip")
	.style("background-color", "rgba(255, 255, 255, 0.75)")
	.style("border", "solid")
	.style("border-width", "2px")
	.style("border-radius", "5px")
	.style("padding", "5px")
	.style('font-size', '20px')
	.style("position", "absolute")
	.style("display", "inline-block")
	.style("z-index", "10")
	.style("visibility", "hidden");

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  if ("sucess" in d){
  		Tooltip.style("visibility", "visible")
    	d3.select(this)
        .style("opacity", 1)
        .style("stroke-width",3)
        .style("stroke","white");
      Tooltip
    		.html(d.properties.name + "<br>" + format_3_decimal_places(d.sucess))
    		.style("left", (d3.mouse(this)[0] + 10 ) + "px")
    		.style("top", (d3.mouse(this)[1]) + "px")
  }
}

var mousemove = function(d) {
		Tooltip
		.style("left", (d3.mouse(this)[0] + 10 ) + "px")
		.style("top", (d3.mouse(this)[1]) + "px")
}

var mouseout = function(d) {
  Tooltip.style("visibility", "hidden")
  d3.select(this)
    .style("opacity", 0.8)
    .style("stroke-width",0.3)
    .style("stroke","black");
}

var timeout = null;
var onclick = function(d) {
	clearTimeout(timeout);
	timeout = setTimeout(function() {
      // console.log("node was single clicked");

      if ("sucess" in d){
					var selected_country = d.id
						
					svg.selectAll("path")
					.transition()
					.duration(750)
					.attr("fill", function(d,i){ 
						if (d.id ==  selected_country) return "yellow";
						else return d["color"];
			    });

				localStorage.current_country = selected_country
				localStorage.update_country = -1;
				localStorage.update_genre = 'true';
		    plotting_all()
			}
    }, 300)
}

var OnDoubleClick = function(d) {
	clearTimeout(timeout);

	localStorage.update_country = 1; 
	localStorage.current_country = -1;
	localStorage.update_genre = 'true';
	
	svg.selectAll("path").transition()
		.duration(750)
		.attr("fill", function(d,i){
			if ("sucess" in d){
				return d["color"];
			}
    });
  plotting_all()
}


// Map and projection
var path = d3.geoPath();
// var projection = d3.geoMercator()
// var projection = d3.geoEquirectangularRaw()
  // .scale(80)
  // .center([0,20])
  // .translate([width / 2, height / 2]);
var projection = d3.geoEquirectangular()
    .scale(120)
    .translate([width / 2 - 20, height / 2 + 10 ]);

// Data and color scale
var data = d3.map();

var g;


// ["","#002153","#002255","#002356","#002358","#002459","#00255a","#00255c","#00265d","#00275e","#00275f","#002860","#002961","#002962","#002a63","#002b64","#012b65","#022c65","#032d66","#042d67","#052e67","#052f68","#063069","#073069","#08316a","#09326a","#0b326a","#0c336b","#0d346b","#0e346b","#0f356c","#10366c","#12376c","#13376d","#14386d","#15396d","#17396d","#183a6d","#193b6d","#1a3b6d","#1c3c6e","#1d3d6e","#1e3e6e","#203e6e","#213f6e","#23406e","#24406e","#25416e","#27426e","#28436e","#29436e","#2b446e","#2c456e","#2e456e","#2f466e","#30476e","#32486e","#33486e","#34496e","#364a6e","#374a6e","#394b6e","#3a4c6e","#3b4d6e","#3d4d6e","#3e4e6e","#3f4f6e","#414f6e","#42506e","#43516d","#44526d","#46526d","#47536d","#48546d","#4a546d","#4b556d","#4c566d","#4d576d","#4e576e","#50586e","#51596e","#52596e","#535a6e","#545b6e","#565c6e","#575c6e","#585d6e","#595e6e","#5a5e6e","#5b5f6e","#5c606e","#5d616e","#5e616e","#60626e","#61636f","#62646f","#63646f","#64656f","#65666f","#66666f","#67676f","#686870","#696970","#6a6970","#6b6a70","#6c6b70","#6d6c70","#6d6c71","#6e6d71","#6f6e71","#706f71","#716f71","#727071","#737172","#747172","#757272","#767372","#767472","#777473","#787573","#797673","#7a7773","#7b7774","#7b7874","#7c7974","#7d7a74","#7e7a74","#7f7b75","#807c75","#807d75","#817d75","#827e75","#837f76","#848076","#858076","#858176","#868276","#878376","#888477","#898477","#898577","#8a8677","#8b8777","#8c8777","#8d8877","#8e8978","#8e8a78","#8f8a78","#908b78","#918c78","#928d78","#938e78","#938e78","#948f78","#959078","#969178","#979278","#989278","#999378","#9a9478","#9b9578","#9b9678","#9c9678","#9d9778","#9e9878","#9f9978","#a09a78","#a19a78","#a29b78","#a39c78","#a49d78","#a59e77","#a69e77","#a79f77","#a8a077","#a9a177","#aaa276","#aba376","#aca376","#ada476","#aea575","#afa675","#b0a775","#b2a874","#b3a874","#b4a974","#b5aa73","#b6ab73","#b7ac72","#b8ad72","#baae72","#bbae71","#bcaf71","#bdb070","#beb170","#bfb26f","#c1b36f","#c2b46e","#c3b56d","#c4b56d","#c5b66c","#c7b76c","#c8b86b","#c9b96a","#caba6a","#ccbb69","#cdbc68","#cebc68","#cfbd67","#d1be66","#d2bf66","#d3c065","#d4c164","#d6c263","#d7c363","#d8c462","#d9c561","#dbc660","#dcc660","#ddc75f","#dec85e","#e0c95d","#e1ca5c","#e2cb5c","#e3cc5b","#e4cd5a","#e6ce59","#e7cf58","#e8d058","#e9d157","#ead256","#ebd355","#ecd454","#edd453","#eed553","#f0d652","#f1d751","#f1d850","#f2d950","#f3da4f","#f4db4e","#f5dc4d","#f6dd4d","#f7de4c","#f8df4b","#f8e04b","#f9e14a","#fae249","#fae349","#fbe448","#fbe548","#fce647","#fce746","#fde846","#fde946",""]
var start = 0 
var end = 5000
var interval = 50 
var color_width = 1
var x_offset = ((end - start) / interval) 
var country_boundary = "black"

var color_start = "purple"
var color_end = "orange"

var ColorScale = d3.scaleLinear()
    	.range([color_start , color_end])
    	.domain([start, end])
    	.interpolate(d3.interpolateRgb.gamma(2));



svg.selectAll('rect')
	.data(d3.range(start,end,interval))
	.enter()
    .append('rect')
    .attr("width", 1)
    .attr("height", 10)
    .attr("fill", function(d) {return ColorScale(d)})
    .attr("fill-opacity",1)
    .attr("transform", function(d,i) { return "translate(" + ((plot_width - x_offset) /2 + i) + "," + (plot_margin_y_top + 10 )+ ")";})
    .attr("stroke-width", "0px")
    .attr("stroke", "none");


var left_label = svg.append("text")
    .attr("transform", function(d,i) { return "translate(" + ((plot_width - x_offset ) /2 ) + "," + (plot_margin_y_top + 10 ) + ")";})
    .attr("dy", "0.74em")
    .attr("dx", "-2.9em")
    .text("0.000")
    .attr("fill", "white")
    .attr("text-align", "right");


var right_label = svg.append("text")
    .attr("transform", function(d,i) { return "translate(" + ((plot_width + x_offset ) /2 + 15 ) + "," + (plot_margin_y_top + 10 ) + ")";})
    .attr("dy", "0.74em")
    .attr("dx", "-0.9em")
    .text("1.000")
    .attr("fill", "white");

var legend_label = svg.append("text")
    .attr("transform", function(d,i) { return "translate(" + ((plot_width - x_offset ) /2 - 80 ) + "," + (plot_margin_y_top + 10 ) + ")";})
    .attr("dy", "0.74em")
    .attr("dx", "-3.5em")
    .text("Success:")
    .attr("font-style", "italic")
    .attr("fill", "white");
    // .attr("text-align", "right");


d3.queue()
.defer(d3.json, "data/world.geojson")
.await(ready);

function ready(error, topo) {
  g = svg.append("g")
    	.selectAll("path")
    	.data(topo.features)
    	.enter()
    	.append("path")
      	// draw each country
      	.attr("d", d3.geoPath().projection(projection))
      	.attr("fill", "black")
      	.attr("stroke", country_boundary)
      	.style("opacity",0.8)
      	// tooltips
        .style('stroke-width', 0.3)
        .on('mouseover',mouseover) 
        .on('mousemove',mousemove)
        .on('mouseout',mouseout)
        .on('click',onclick)
        .on('dblclick',OnDoubleClick);
}
	 
function update_map(country_data){

		var max_avg = 0;
		var min_avg = 2;
      Object.entries(country_data).forEach(([k,v]) => {
     	if (country_data[k][1] != 0) {
     		country_data[k][0] = country_data[k][0] / country_data[k][1]
     		max_avg = Math.max(country_data[k][0], max_avg)
     		min_avg = Math.min(country_data[k][0], min_avg)
     	}
   	});

      right_label.transition().duration(750).text(format_3_decimal_places(max_avg));
      left_label.transition().duration(750).text(format_3_decimal_places(min_avg));

    svg.selectAll("path").transition()
		.duration(750)
		.attr("fill", function(d,i){
			if (d.id in country_data){
				d["sucess"] = country_data[d.id][0];
				// d["color"] = d3.hsl(ColorScale(country_data[d.id][0])).darker(2);
				d["color"] = ColorScale( (d["sucess"] - min_avg) / (max_avg - min_avg) * end );
				return d["color"];
			}
			else{
				return "white"; 
			}
    });
}

export { update_map };   