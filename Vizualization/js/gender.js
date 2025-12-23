// http://bl.ocks.org/dbuezas/9572040
// http://bl.ocks.org/dbuezas/9306799

var margin = {top: 0, right: 0, bottom: 0, left: 0}

var parentDiv = document.getElementsByClassName("Gender")[0];
var width = parentDiv.clientWidth - margin.left - margin.right;
var height = parentDiv.clientHeight - margin.top - margin.bottom;
var textFactor = 20
var grid_opacity = 0.1
var alpha = 0.5
var y_label = "Success"
var transition_time = 500

var radius = Math.min(width, height) / 2;

var x_axis_length = [margin.left, width - 3 * margin.right]
var y_axis_length = [height- margin.bottom - 50,  margin.top]

var plot_width = x_axis_length[1] - x_axis_length[0]
var plot_margin_x_left = margin.left

var plot_margin_y_top = margin.top
var plot_height = y_axis_length[0] - y_axis_length[1]

var svg = d3.select(parentDiv)
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          
var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
// var borderRect = svg.append("rect")
//           .attr("stroke","#000000")
//           .attr("fill-opacity",0.5)
//           .attr("stroke-width",1)
//           .attr("width", plot_width)
//           .attr("height",plot_height)
//           .attr("transform","translate(" + plot_margin_x_left + "," + plot_margin_y_top + ")");


var possible_gender_category = [0,1,2,3]

var t = d3.transition()
          .duration(transition_time);

var pie = d3.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.arc()
	.outerRadius(radius * 0.7)
	.innerRadius(radius * 0.4);

var outerArc = d3.arc()
	.innerRadius(radius * 0.8)
	.outerRadius(radius * 0.8);


g.append("g")
	.attr("class", "slices");
g.append("g")
	.attr("class", "labels");
g.append("g")
	.attr("class", "lines");

// g.append("g").attr("class", "labels");

var start = 0 
var end = 5000
var interval = 50 
var color_width = 1
var x_offset = ((end - start) / interval) 
// var color_start = "#ffffcc"
// var color_end = "#800026"
var color_start = "purple"
var color_end = "orange"

var ColorScale = d3.scaleLinear()
    	.range([color_start , color_end])
    	.domain([start, end])
    	.interpolate(d3.interpolateRgb.gamma(1));


// var ColorScale = d3.scaleLinear()
//     	.domain([start, end]).nice()
//     	.range([color_start, color_end])
//     	.interpolate(d3.interpolateRgb.gamma(0.8));

svg.selectAll('rect')
	.data(d3.range(start,end,interval))
	.enter()
    .append('rect')
    .attr("width", color_width)
    .attr("height", 20)
    .attr("fill", function(d) {return ColorScale(d)})
    .attr("fill-opacity",1)
    .attr("transform", function(d,i) { return "translate(" + ((plot_width - x_offset) /2 + i + 30) + "," + plot_margin_y_top + ")";})


var left_label = svg.append("text")
    .attr("transform", function(d,i) { return "translate(" + ((plot_width - x_offset ) /2 + 30 ) + "," + plot_margin_y_top + ")";})
    .attr("dy", "1.00em")
    .attr("dx", "-2.9em")
    .text("0.000")
    .attr("fill", "white")
    .attr("text-align", "right");


var right_label = svg.append("text")
    .attr("transform", function(d,i) { return "translate(" + ((plot_width + x_offset ) /2 + 45 ) + "," + plot_margin_y_top + ")";})
    .attr("dy", "1.00em")
    .attr("dx", "-0.6em")
    .text("1.000")
    .attr("fill", "white");


var legend_label = svg.append("text")
    .attr("transform", function(d,i) { return "translate(" + ((plot_width - x_offset ) /2 - 100 ) + "," + (plot_margin_y_top ) + ")";})
    .attr("dy", "1.00em")
    .attr("dx", "-0.6em")
    .text("Success:")
    .attr("font-style", "italic")
    .attr("fill", "white");

function midAngle(d){
	    return d.startAngle + (d.endAngle - d.startAngle)/2;
}

var key = function(d){ return d.data.label; };

const format_3_decimal_places = d3.format(".3f");

function plotting_gender(gender_data){

  	var data_to_plot = []
  	var max_avg = 0;
	var min_avg = 2;
    var no_unique = 0;
    possible_gender_category.forEach((no_females,i) => {
  	
	  	if (gender_data[no_females][0] != 0 ){
	  		no_unique += 1
	  		var factor = gender_data[no_females][0] / gender_data[no_females][1]
	  		
	  		max_avg = Math.max(factor, max_avg)
     		min_avg = Math.min(factor, min_avg)

	  		data_to_plot.push({
	    		"label": no_females, 
	    		"sucess": factor ,
	    		"value": gender_data[no_females][1]
				});
	  	}
    });
		
	right_label.transition().duration(750).text(format_3_decimal_places(max_avg));
    left_label.transition().duration(750).text(format_3_decimal_places(min_avg));


		change(data_to_plot, max_avg, min_avg, no_unique )

	 //  data_to_plot = pie(data_to_plot)
	
 	// 	var slice = g.selectAll(".slices").data(data_to_plot);
	   
	 //  slice.exit().remove();
	 //  slice.enter()
		//     .insert("path")
		//     .style("fill", function(d) {return ColorScale(d.data.sucess); })
		//     .attr("class", "slices")
		//     .attr("stroke", "black");
		
		// slice
		// 		.transition()
	 //      .duration(300)
	 //      .attrTween("d", function(d) {
	 //        this._current = this._current || d;
	 //        var interpolate = d3.interpolate(this._current, d);
	 //        this._current = interpolate(0);
	 //        return function(t) { return arc(interpolate(t)); };
	 //      })
   	
   	
	  /* ------- TEXT LABELS -------*/

  //  	var text = g.select(".labels").selectAll("text").data(data_to_plot);
  //  	text.exit().transition().duration(500).attr("opacity", 0).remove();

		// text.enter()
		//     .append("text")
		//     .attr("dy", ".35em")
		//     .text(function(d) {
		//       return d.data.label;
		// 		});

	  // text
	  // 	.transition()
	  // 	.duration(1000)
		 //  .attrTween("transform", function(d) {
	  //     this._current = this._current || d;
	  //     var interpolate = d3.interpolate(this._current, d);
	  //     this._current = interpolate(0);
	  //     return function(t) {
	  //       var d2 = interpolate(t);
	  //       var pos = outerArc.centroid(d2);
	  //       pos[0] = radius / 1.2 * (midAngle(d2) < Math.PI ? 1 : -1);
	  //       return "translate("+ pos +")";
	  //     };
		 //  })
		 //  .styleTween("text-anchor", function(d){
	  //     this._current = this._current || d;
	  //     var interpolate = d3.interpolate(this._current, d);
	  //     this._current = interpolate(0);
	  //     return function(t) {
	  //       var d2 = interpolate(t);
	  //       return midAngle(d2) < Math.PI ? "start":"end";
	  //     };
			// });


	 //  var polyline = g.selectAll("polyline").data(pie(data_to_plot));
		// polyline.enter().append("polyline");
		// polyline
	 //  	.transition()
	 //  	.duration(1000)
	 //    .attrTween("points", function(d){
  //     	this._current = this._current || d;
  //     	var interpolate = d3.interpolate(this._current, d);
  //     	this._current = interpolate(0);
		//     return function(t) {
	 //        var d2 = interpolate(t);
	 //        var pos = outerArc.centroid(d2);
	 //        pos[0] = radius * 0.8 * (midAngle(d2) < Math.PI ? 1 : -1);
	 //        return [arc.centroid(d2), outerArc.centroid(d2), pos];
		// 	  };      
		//   });
		// polyline.exit().remove();

}

function change(data, max_avg, min_avg, no_unique) {
	
	var data0 = svg.select(".slices").selectAll("path.slice")
		.data().map(function(d) { return d.data });
	
	if (data0.length == 0) data0 = data;
	
	var was = mergeWithFirstEqualZero(data, data0);
	var is = mergeWithFirstEqualZero(data0, data);

	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(was), key);

	slice.enter()
		.insert("path")
		.attr("class", "slice")
		.style("fill", function(d) {
		 return ColorScale( (d.data.sucess - min_avg) / (max_avg - min_avg) * end ); })
		.each(function(d) {
			this._current = d;
		})
		.attr("stroke", "black");

	slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(is), key);

	slice		
		.transition().duration(1000)
		.attrTween("d", function(d) {
			var interpolate = d3.interpolate(this._current, d);
			var _this = this;
			return function(t) {
				_this._current = interpolate(t);
				return arc(_this._current);
			};
		})
		.style("fill", function(d) { 
			var color = end / 2 ; 
			if (no_unique != 1){
				color = (d.data.sucess - min_avg) / (max_avg - min_avg) * end 
			}
			return ColorScale( color ) });

	slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice
		.exit().transition().delay(500).duration(0)
		.remove();


	var text = svg.select(".labels").selectAll("text")
		.data(pie(was), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.style("opacity", 0)
		.text(function(d) {
			return d.data.label;
		})
		.each(function(d) {
			this._current = d;
		});

	text = svg.select(".labels").selectAll("text")
		.data(pie(is), key);

	text.transition().duration(500)
		.style("opacity", function(d) {
			return d.data.value == 0 ? 0 : 1;
		})
		.attrTween("transform", function(d) {
			var interpolate = d3.interpolate(this._current, d);
			var _this = this;
			return function(t) {
				var d2 = interpolate(t);
				_this._current = d2;
				var pos = outerArc.centroid(d2);
				pos[0] = radius / 1.1 * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			var interpolate = d3.interpolate(this._current, d);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.exit().transition().delay(500)
			.remove();

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(was), key);
	
	polyline.enter()
		.append("polyline")
		.style("opacity", 0)
		.each(function(d) {
			this._current = d;
		});

	polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(is), key);
	
	polyline.transition().duration(500)
		.style("opacity", function(d) {
			return d.data.value == 0 ? 0 : .8;
		})
		.attrTween("points", function(d){
			this._current = this._current;
			var interpolate = d3.interpolate(this._current, d);
			var _this = this;
			return function(t) {
				var d2 = interpolate(t);
				_this._current = d2;
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.8 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};			
		});
	
	polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);
	
	polyline
		.exit().transition().delay(500)
		.remove();

}

function mergeWithFirstEqualZero(first, second){
	var secondSet = d3.set(); second.forEach(function(d) { secondSet.add(d.label); });

	var onlyFirst = first
		.filter(function(d){ return !secondSet.has(d.label) })
		.map(function(d) { return {label: d.label, value: 0, sucess:0 }; });
	return d3.merge([ second, onlyFirst ])
		.sort(function(a,b) {
			return d3.ascending(a.label, b.label);
		});
}

export { plotting_gender };


