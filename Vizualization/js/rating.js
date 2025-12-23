import { plotting_all } from './dashboard.js';
// https://www.youtube.com/watch?v=XmVPHq4NhMA&ab_channel=CurranKelleher
var margin = {top: 0, right: 20, bottom: 32, left: 27}

var parentDiv = document.getElementsByClassName("Rating")[0];
var width = parentDiv.clientWidth - margin.left - margin.right;
var height = parentDiv.clientHeight - margin.top - margin.bottom;

// width = 1450 - margin.left - margin.right;
// height = 1000 - margin.top - margin.bottom;

var textFactor = 20
var grid_opacity = 0.1
var alpha = 0.5


var x_label = "Duration"
var y_label = "Success"
var transition_time = 500

var x_axis_length = [margin.left, width - margin.right]
var y_axis_length = [height- 2* margin.bottom, 3 * margin.top]

var plot_width = x_axis_length[1] - x_axis_length[0]
var plot_margin_x_left = margin.left

var plot_margin_y_top = 3 * margin.top
var plot_height = y_axis_length[0] - y_axis_length[1]

var x_axis_pos = [0, plot_height + plot_margin_y_top]
var y_axis_pos = [plot_margin_x_left, 0]

var x_mid_point = plot_margin_x_left + plot_width /2;
var y_mid_point = plot_margin_y_top + plot_height /2;
  
var x_label_pos = [x_mid_point - x_label.length/ 2, x_axis_pos[1] +  margin.bottom + 5  ]
var y_label_pos = [2 * plot_margin_x_left , y_mid_point + y_label.length * 10 / 2 ]

var svg = d3.select(parentDiv)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")   


var g =  svg.append("g");
// var borderRect = g.append("rect")
//           .attr("stroke","#000000")
//           .attr("fill-opacity",0.5)
//           .attr("stroke-width",1)
//           .attr("width", plot_width)
//           .attr("height",plot_height)
//           .attr("transform","translate(" + (plot_margin_x_left) + "," + plot_margin_y_top + ")");

var xAxisLabel = g.append("text")
  .attr("class", "labels")
  .attr("x", x_label_pos[0] - 40)
  .attr("y", x_label_pos[1])
  .text(x_label);

var yAxisLabel = g.append("text")
    .attr("class", "labels")
    .attr("transform", "translate(" + y_label_pos[0] + "," + y_label_pos[1] + ")rotate(-90)")
    .attr("dy", "-3em")
    .attr("dx", "-0.9em")
    .text(y_label);      

var xScale = d3.scaleLinear()
    .range([x_axis_length[0], x_axis_length[1]]);

var yScale = d3.scaleLinear()
        .range([ y_axis_length[0], y_axis_length[1] ]).nice();  

var x_axis = g.append("g")
      .attr("transform", "translate(" + x_axis_pos[0] +"," + x_axis_pos[1] + ")")
      .attr("class", "myXaxis")

var y_axis = g.append("g")
      .attr("transform", "translate("+ y_axis_pos[0] +"," +y_axis_pos[1]  +")")
      .attr("class", "myYaxis")
      


var mouseover = function(d) {
  d3.select(this)
    .attr("stroke-width",3)
    .attr("r",12)
}

var mouseout = function(d) {
  if (d != localStorage.rating )
  d3.select(this)
    .attr("r", 7)
    .attr("stroke-width",1);
}

var timeout = null;
var onclick = function(d) {
  g.selectAll("circle")
    .attr("stroke-width",1)
    .attr("r", 7);
  
  clearTimeout(timeout);
  d3.select(this)
        .attr("stroke-width",3)
        .attr("r",12)
  timeout = setTimeout(function() {
        var index = rating_legend.indexOf(d)
        localStorage.rating = rating[index];
        localStorage.update_genre = 'true';
        plotting_all()
    }, 300)
}

var OnDoubleClick = function(d) {
  clearTimeout(timeout);
  g.selectAll("circle")
    .attr("stroke-width",1)
    .attr("r", 7);
  
  localStorage.rating = -1
  localStorage.update_genre = 'true';
  plotting_all();
}




var first_time = true 
var bin_size = 2
var start_val = 60 
var end_val = 780 
var rating = ['pg', 'pg-13', 'g', 'r', 'not rated']
var rating_legend = ['pg', 'pg-13', 'g', 'r', 'nr']


function color_converter(specifier) {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors.reverse();
}

var ColorScale = d3.scaleOrdinal()
    // .range(["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]);
    // .range(color_converter("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928"));
    .range(["#b15928", "#ffff99" , "#6a3d9a", "#cab2d6", "#ff7f00"]);

ColorScale.domain(rating_legend);
var legend = g.append("g")
  .selectAll("g")
  .data(rating_legend)
  .enter()
  .append("g")
  .attr("transform", function(d, i) { 
    return "translate("+  (x_axis_length[1] - 20) + "," + (10 + i * 20) + ")"; 
  });
    
legend.append("circle")
    .attr("cx", 10)
    .attr("cy", 10)
    .attr("r", 7)
    .style("stroke-width",1)
    .attr("fill", ColorScale)
    .on('mouseover',mouseover)
    .on('mouseout',mouseout)
    .on('click',onclick)
    .on('dblclick',OnDoubleClick);;


legend.append("text")
    .attr("class", "label")
    .attr("x", 26)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .text(function(d) { return d; });

var curve = g.append("path").selectAll(".mypath");
var curr_smoothing = 1
var curr_rating_dict = {};


function plotting_lines(rating_dict, min_bin, max_bin){
  
  var min_y = 2
  var max_y = 0 
  var new_data = {}


  rating.forEach(key =>{
    rating_dict[key] = rating_dict[key].slice(min_bin,max_bin );
    for (let i = 0 ; i < rating_dict[key].length ; i++){
      var avg_sucess = rating_dict[key][i][0] / Math.max( rating_dict[key][i][1] ,1)
      min_y = Math.min(min_y , avg_sucess)
      max_y = Math.max(max_y , avg_sucess)
    }
  });

  yScale.domain([min_y, max_y])
  xScale.domain([0, max_bin - min_bin ])

  var start_time = start_val + min_bin * bin_size
  var temp_x_axis = d3.axisBottom(xScale).tickFormat(function(d){ return start_time + d * bin_size; }).ticks(5) ;

  svg.select(".myYaxis")
    .transition()
    .duration(transition_time)
    .call(d3.axisLeft(yScale))

  svg.select(".myXaxis")
    .transition()
    .duration(transition_time)
    .call(temp_x_axis)
      
  curr_rating_dict = rating_dict;
  update_smoothing();
}    


function update_smoothing(smoothing=curr_smoothing){
  curr_smoothing = smoothing;
  var density_agg = {}  

  rating.forEach((key,i) =>{
      var kde = kernelDensityEstimator(curr_smoothing, curr_rating_dict[key] )
      var density =  kde( curr_rating_dict[key] )
      density_agg[key] = density
      draw_curve(density, i)
    });
}


function draw_curve(density, i){
  
  var u = g.selectAll(".lineTest" + i)
      .data([density]) 
      // .data([rating_dict[key]], function(d){ 
      // var avg_sucess = rating_dict[key][i][0] / Math.max( rating_dict[key][i][1] ,1)        //   return avg_sucess});
  
  u.exit().transition().duration(500)
    .attr("opacity", 0)
    .attr("stroke-width", 0).remove();

  u.enter()
    .append("path")
    .attr("class","lineTest"  + i)
    .merge(u)
    .attr("fill", "none")
    .transition()
    .duration(2000)
    .attr("d", d3.line()
      .curve(d3.curveBasis)
        .x(function(d,i) { return xScale(d[0]); })
        .y(function(d) { return yScale(d[1]); })
    )
    .attr("opacity", 1)
    .attr("stroke", ColorScale(i))
    .attr("stroke-width", 2.5);

  // u.enter()
  // .append("path")
  // .attr("class","lineTest"  + i)
  // .merge(u)
  // .transition()
  // .duration(3000)
  // .attr("d", d3.line()
  //   .curve(d3.curveBasis)
  //   .x(function(d,i) { return xScale(i); })
  //   .y(function(d) { 
  //     var avg_sucess = d[0] / Math.max( d[1] ,1);
  //     return yScale(avg_sucess); })
  // )
  // .attr("fill", "none")
  // .attr("stroke", color(i))
  // .attr("stroke-width", 2.5);
}

    
// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x,i ) {
      return [i, d3.mean(V, function(v,j) { 
        var avg_sucess1 = v[0] / Math.max( v[1] ,1)
        if (Math.abs(i - j) < kernel ){
          return avg_sucess1
        }
      })];
    });
  };
}

export { plotting_lines, bin_size, start_val, end_val, rating, update_smoothing};
