import { plotting_all } from './dashboard.js';

// https://www.youtube.com/watch?v=XmVPHq4NhMA&ab_channel=CurranKelleher
// https://bl.ocks.org/maybelinot/5552606564ef37b5de7e47ed2b7dc099
var margin = {top: 0, right: 0, bottom: 40, left: 30}

var parentDiv = document.getElementsByClassName("Timeline")[0];
var width = parentDiv.clientWidth - margin.left - margin.right;
var height = parentDiv.clientHeight - margin.top - margin.bottom;



var innerRadius = 70;
var outerRadius = 71;
var svg = d3.select(parentDiv)
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          

var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var xScale = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0);

var yScale = d3.scaleRadial()
    .range([innerRadius, outerRadius]);

function color_converter(specifier) {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors.reverse();
}

var ColorScale = d3.scaleOrdinal()
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    // .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);
    .range(color_converter("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928"));
    


var columns = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
'Sep', 'Oct', 'Nov', 'Dec']
// var decades = ["1970", "1980", "1990", "2000", "2010", "2020"]
var decades = ["1970", "1980", "1990", "2000", "2010"]
// var decades = ["1980", "1990", "2000", "2010", "2020"]
// decades = ["1980", "1990", "2000", "2010"]

xScale.domain(columns);
ColorScale.domain(decades);

var g_legend = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

var month_label = g_legend
  .selectAll("g")
  .data(columns)
  .enter()
  .append("g")
  .attr("text-anchor", "middle")
  .attr("transform", function(d) { 
      return "rotate(" +  ((xScale(d) + xScale.bandwidth() / 2) * 180 / Math.PI - 90) 
          + ")translate(" + innerRadius + ",0)"; 
  });
    
month_label.append("line")
          .attr("class", "label_indicator")
          .attr("x2", -5);

month_label.append("text")
          .attr("class", "label")
          .attr("transform", function(d) { return (xScale(d) + xScale.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
          .text(function(d) { return d; });



var OnDoubleClick = function(d) {
  clearTimeout(timeout);
  localStorage.update_genre = 'true';
  localStorage.decade = -1;
  plotting_all();
}

var timeout = null; 
var onclick = function(d) {
  clearTimeout(timeout);
  timeout = setTimeout(function() {
      // console.log("node was single clicked");
      var decade = d[3];
      localStorage.update_genre = 'true';
      localStorage.decade = decade;
      plotting_all();
    }, 300)
}


var legend = g_legend.append("g")
  .selectAll("g")
  .data(decades)
  .enter()
  .append("g")
  .attr("transform", function(d, i) { 
    return "translate(150," + ((i - (decades.length - 1) -5 ) * 20 - 1) + ")"; 
  });

    
legend.append("circle")
    .attr("cx", 10)
    .attr("cy", 10)
    .attr("r", 7)
    .attr("fill", ColorScale);

legend.append("text")
    .attr("class", "label")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .text(function(d) { return d; });



function plotting_timeline(timeline_data ){
  var y_min = 2 
  var y_max = 0
  var data_to_plot = []
  
  var ylimits = {}
  columns.forEach((month) => {
    ylimits[month] = 0 ; 
  });

  var ymax = 0 
  decades.forEach((decade,i) => {
      var month_data = [] 
      var prev_decade = decades[i-1]
      columns.forEach((month,j) => {
        var prev = 0 
        if (i > 0) prev = data_to_plot[i-1][j][1]
        var factor = 0.00001
        if (timeline_data[decade][month][0] != 0 )
          factor = timeline_data[decade][month][0] / timeline_data[decade][month][1]
        
        ylimits[month] += factor
        ymax = Math.max(ymax, ylimits[month])
        month_data.push([prev, prev + factor, month, decade])
      });
      data_to_plot.push(month_data)
    });
    
    
    yScale.domain([0, y_max + 0.01]);

    var pie_plot = g.selectAll("g")
      .data(data_to_plot)

    var u = pie_plot
      .enter()
      .append("g")
      .merge(pie_plot)
        .attr("fill", function(d,i) { return ColorScale(decades[i]); })
        .selectAll("path")
        .data(function(d,i) { 
          return d; 
        })

    u.enter()
      .append("path")
      .on('click',onclick)
      .on('dblclick',OnDoubleClick)
      .merge(u)
      .transition()
      .duration(500)
      // .attr("stroke-width", 2.5)
      // .attr("stroke", "black")
      .attr("d", d3.arc()
        .innerRadius(function(d) {return yScale(d[0]); })
        .outerRadius(function(d) {return yScale(d[1]); })
        .startAngle(function(d) { return xScale(d[2]); })
        .endAngle(function(d) { return xScale(d[2]) + xScale.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius)
      );
}


export { plotting_timeline , decades, columns};