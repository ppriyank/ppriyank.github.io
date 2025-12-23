// https://www.youtube.com/watch?v=XmVPHq4NhMA&ab_channel=CurranKelleher
import { plotting_all } from './dashboard.js';

var margin = {top: 5, right: 5, bottom: 40, left: 28}

var parentDiv = document.getElementsByClassName("Budget")[0];

var width = parentDiv.clientWidth - margin.left - margin.right;
var height = parentDiv.clientHeight - margin.top - margin.bottom;

// width = 1450 - margin.left - margin.right;
// height = 1000 - margin.top - margin.bottom;

var textFactor = 20
var grid_opacity = 0.1
var alpha = 0.5
var y_label = "Success"
var transition_time = 500
var x_axis_length = [margin.left, width - 3 * margin.right]
var y_axis_length = [height- margin.bottom / 2, 3 * margin.top]

var plot_width = x_axis_length[1] - x_axis_length[0]
var plot_margin_x_left = margin.left

var plot_margin_y_top = 3 * margin.top
var plot_height = y_axis_length[0] - y_axis_length[1]

var x_axis_pos = [0, plot_height + plot_margin_y_top]
var y_axis_pos = [plot_margin_x_left, 0]


var y_mid_point = plot_margin_y_top + plot_height /2;
var y_label_pos = [2 * plot_margin_x_left , y_mid_point + y_label.length * 10 / 2 ]

var ylimits = 0
var padding_chunk = 20;            
var n = 5;
var chunk = (plot_width - 40) / n
var chosen ;
var budget_names = ["Low Budget", "Low Mid Budget", "Mid Budget", "High Budget", "Very High Budget"]
var budget = ["0", "1", "2", "3", "4"]
var first_time = true 
var domain_budget = {}
domain_budget["0"] = [0, 0]
domain_budget["1"] = [0, 0]
domain_budget["2"] = [0, 0]
domain_budget["3"] = [0, 0]
domain_budget["4"] = [0, 0]

var data_to_be_plotted = {};
budget.forEach(function(key) {
  data_to_be_plotted[key] = [];
  });


var myColor = d3.scaleSequential()
  // .interpolator(d3.interpolateInferno)
  // .interpolator( d3.interpolateSpectral)
  .interpolator(d3.interpolate("blue", "red"))


var svg = d3.select(parentDiv)
// var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")            


var g =  svg.append("g");

var color = "green";
var triangleSize = 20;
var verticalTransform = 1000 + plot_height  + Math.sqrt(triangleSize);

var customSymbolSquare = { 
        draw: function(context, size){
            let s = Math.sqrt(size)/2;
            context.moveTo(0,0);
            context.lineTo(s,5*s);
            context.lineTo(2 * s,0);
            context.closePath();
        }
    }
var customSqr = d3.symbol().type(customSymbolSquare).size(500);
g.append("path")
    .attr("d", customSqr)
    .attr("transform", "translate(" + (plot_width +10) +",60)");


var legend_label1 = g.append("text")
    .attr("class", "labels")
    .attr("transform", "translate(" + (plot_width + 12) +",50)")
    .text("380")
    .attr("fill", "white");

var legend_label2 = g.append("text")
    .attr("class", "labels")
    .attr("transform", "translate(" + (plot_width + 18) +",135)")
    .text("0")
    .attr("fill", "white");


var nature_of_profit_legend = ['> 0 P.', '< 0 P.', "N/A"]

var ColorScale = d3.scaleOrdinal()
    .range(["#ccebc5", "#fbb4ae", "white"]);

ColorScale.domain(nature_of_profit_legend);
var legend = g.append("g")
  .selectAll("g")
  .data(nature_of_profit_legend)
  .enter()
  .append("g")
  .attr("transform", function(d, i) { 
    return "translate("+  (plot_width - 15) + "," + (200 + i * 20) + ")"; 
  });
    
legend.append("circle")
    .attr("cx", 10)
    .attr("cy", 10)
    .attr("r", 5)
    .attr("fill", ColorScale);

legend.append("text")
    .attr("class", "labels")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .text(function(d) { return d; });



// original
var imgs1 = g.append("image") // en vez de g es svg
  .attr("xlink:href", "award.png")
  .attr("opacity", "1")
  .attr("transform", "translate(" + (plot_width) +",-5)")
  .attr("width", 40)
  .attr("height", 40);


var xScale = d3.scaleLinear();
var yScale = d3.scaleLinear()
      .range([ y_axis_length[0], y_axis_length[1] ]);  


// var borderRect = svg.append("rect")
//           .attr("stroke","#000000")
//           .attr("fill-opacity",0.5)
//           .attr("stroke-width",1)
//           .attr("width", plot_width)
//           .attr("height",plot_height)
//           .attr("transform","translate(" + plot_margin_x_left + "," + plot_margin_y_top + ")");

  //////////////////////////////// Read Data only once ////////////////////////////////

var already_clicked = -1
var mouseover = function(d) {
    var cell = d3.select(this);
    
    cell.selectAll(".frame-border")
      .style("opacity", 1)
      .attr("stroke-width", "3px");      
}

var mouseout = function(d) {
  if (already_clicked != d){
    var cell = d3.select(this);
      
      cell.selectAll(".frame-border")
        .attr("stroke-width", "1px")
        .style("opacity", 0.2);
  }
}
var timeout = null;

var onclick = function(d) {
  
  var cells = g.selectAll(".cell")
        cells.selectAll(".frame-border")
        .attr("stroke-width", "1px")
        .style("opacity", 0.2);
  
  cells = d3.select(this)

  cells.selectAll(".frame-border")
          .attr("stroke-width", "3px")
          .style("opacity", 1);    

  clearTimeout(timeout);
  timeout = setTimeout(function() {
      // console.log("node was single clicked");
      already_clicked  =d  


      localStorage.budget_range = already_clicked;
      localStorage.update_genre = 'true';
      plotting_all();
    }, 300)
}

var OnDoubleClick = function(d) {
  clearTimeout(timeout);
  already_clicked = -1; 
  localStorage.budget_range = -1;
  localStorage.update_genre = 'true';
  
  g.selectAll(".cell")
  .selectAll(".frame-border")
  .attr("stroke-width", "1px")
  .style("opacity", 0.2);

  plotting_all()
}

function plotting_basic(data_by_budget){

  var y_axis = g.append("g")
        .attr("transform", "translate("+ (y_axis_pos[0] ) +"," +y_axis_pos[1]  +")")
        .attr("class", "myYaxis")
        .call(d3.axisLeft(yScale))
        // remove axis line
        .call(g => g.select(".domain").remove());

  var yAxisLabel = g.append("text")
          .attr("transform", "translate(" + (y_label_pos[0]) + "," + y_label_pos[1] + ")rotate(-90)")
          .attr("dy", "-3.85em")
          .attr("dx", "0.9em")
          .text(y_label);      

  var xAxis = d3.axisBottom();

  xScale.range([padding_chunk / 2, chunk - padding_chunk/ 2])
  xAxis.scale(xScale).ticks(2);  
  var x_axis = g.append("g")
          .selectAll("myXaxis");

  x_axis.data(budget)
    .enter()
    .append("g")
    .attr("class", "myXaxis")
    .attr("opacity", 0)
    .attr("transform", 
      function(d, i) { return "translate(" + (y_axis_pos[0] + (i) * chunk)  +"," + x_axis_pos[1] + ")"; }
    )
    .each(function(d) { 
      xScale.domain(domain_budget); 
      d3.select(this).call(xAxis); 
    });

  var cell = g.selectAll(".cell")
          .data(budget)        
  
  cell.enter()
    .append("g")
    .attr("class", "cell")
    .merge(cell)
    .attr("transform", function(d,i) { 
      return "translate(" + (y_axis_pos[0] + i * chunk) + "," + y_axis_length[1] + ")"; 
    })
    .each(plot)
    .on('mouseover',mouseover)
    .on('mouseout',mouseout)
    .on('click',onclick)
    .on('dblclick',OnDoubleClick);

  if (first_time) first_time= false;  
}



function update_plot_budget(data_by_budget){
  
  var ymin = 2 
  var ymax = 0 

  var amin = 2 
  var amax = 0 
  budget.forEach(function(key) {
    
    data_to_be_plotted[key] = []
    if (data_by_budget[key].length > 0){
      var ylimits = d3.extent(data_by_budget[key], function(d) {return +d.sucess}); 
      var alimits = d3.extent(data_by_budget[key], function(d) {return +d.accolades}); 
      data_to_be_plotted[key] = data_by_budget[key]      
      ymin = Math.min(ymin, ylimits[0])
      ymax = Math.max(ymax, ylimits[1])

      amax = Math.max(amax, alimits[1])
    }
  
    if (first_time){
      var xlimits = d3.extent(data_by_budget[key], function(d) {return +d.budget}); 
      domain_budget[key]=  xlimits
    }

  });      

  // gradient colors
  // myColor.domain([ylimits[0]+1, ylimits[1]-1]);
  yScale.domain([ymin, ymax])
  
  legend_label1.transition()
      .duration(1000)
      .text(amax)
      

  if (first_time){
      plotting_basic(data_by_budget);
  }      
  else{
      svg.select(".myYaxis")
        .transition()
        .duration(transition_time)
        .call(d3.axisLeft(yScale))
        // .call(g => g.select(".domain").remove())

      var cell = g.selectAll(".cell").each(re_draw);

    }
}

function plot(p, i) {

    xScale.domain(domain_budget[p]);
    var cell = d3.select(this);
    // rectangle is clipping
    cell.append("clipPath")
        .attr("id", "frame-clip")   
        .append("rect")
        .attr("transform",  "translate(0," + (y_axis_length[1]) + ")")
        .attr("x", padding_chunk / 2)
        .attr("width", chunk - padding_chunk)
        .attr("height", plot_height);

    cell.append("rect")
      .attr("class", "frame")
      .attr("x", padding_chunk / 2)
      .attr("width", chunk - padding_chunk)
      .attr("height", plot_height)
      .attr("fill", "white")
      .attr("opacity", 0);

    cell.append("rect")
      .attr("class", "frame-border")
      .attr("x", padding_chunk / 2)
      .attr("width", chunk - padding_chunk)
      .attr("height", plot_height)
      .attr("fill", "none")
      .attr("stroke-width", "1px")
      .attr("opacity", 0.2);

    var circle = cell.selectAll("circle")
      .data(data_to_be_plotted[p])
      .enter()
      .append("circle")
      .attr("transform",  "translate(0," + (-y_axis_length[1]) + ")")
      .attr("class", "scatter-points")
      .attr("clip-path", "url(#frame-clip)")
      .attr("cx", function(d) { 
        var new_pos = Math.min(+d.budget + (2 *Math.random() -1 ) /8, domain_budget[p][1]);
        new_pos = Math.max(new_pos, domain_budget[p][0]);
        return xScale(new_pos);
      })
      .attr("cy", function(d) { return yScale(d.sucess); })
      .attr("r", function(d) {  return +d.accolades / 4 + 1 ;})
      .style("fill", function(d){ if (+d.nature > 0) return "#ccebc5"; 
        if (+d.nature < 0) return "#fbb4ae";
        if (+d.nature == 0) return "white";
      })
      .style("stroke-width" , "0.5px")
      .style("stroke", function(d){ if (+d.nature > 0) return "black"; 
        if (+d.nature < 0) return "black";
        if (+d.nature == 0) return "white";
      })
      // .attr("stroke", "black")
      // .attr("opacity", 0.5);


      cell.append("text")
        .attr("class", "labels")
        .attr("x", (-padding_chunk / 2 + chunk /2 - 3.5 * budget_names[i].length ))
        .attr("y", -padding_chunk / 2)
        .text(budget_names[i]);
      
      var mean_score = d3.mean(data_to_be_plotted[p], function(d) { return d.sucess;})
      
      cell.append("line")
        .attr("class", "mean")
        .attr("transform",  "translate(0," + (-y_axis_length[1]) + ")")
        .attr("x1", xScale(domain_budget[p][0]))
        .attr("y1", yScale(mean_score))
        .attr("x2", xScale(domain_budget[p][1]))
        .attr("y2", yScale(mean_score))
        .attr("stroke-width", "3px")
        .style("stroke-dasharray", ("10, 5"));

      // console.log(domain_budget[p])
      // cell.append("line")
      //   .attr("class", "mean")
      //   .attr("transform",  "translate(0," + (-y_axis_length[1]) + ")")
      //   .attr("x1", xScale(domain_budget[p][0]))
      //   .attr("y1", yScale(0.012651385667240795))
      //   .attr("x2", xScale(domain_budget[p][1]))
      //   .attr("y2", yScale(0.924181900))
      //   .attr("stroke-width", "3px")
      //   .style("stroke-dasharray", ("10, 5"));
}


function re_draw(p, i) {

    xScale.domain(domain_budget[p]);
    var cell = d3.select(this);
    
    var circle = cell.selectAll("circle")
      .data(data_to_be_plotted[p])

    circle.exit().transition().duration(500).attr("r", 0).remove();
    
    circle.enter()
      .append("circle")
      .attr("class", "scatter-points")
      .merge(circle)
      .attr("cx", function(d) { 
        var new_pos = Math.min(+d.budget + (2 *Math.random() -1 ) /8, domain_budget[p][1]);
        new_pos = Math.max(new_pos, domain_budget[p][0]);
        return xScale(new_pos); 
      })
      .attr("cy", function(d) { return yScale(d.sucess); })
      .attr("transform",  "translate(0," + (-y_axis_length[1]) + ")")
      .attr("clip-path", "url(#frame-clip)")
      // .attr("stroke", "black")
      .attr("r", 0 )
      .transition()
      .duration(1000)
      .attr("r", function(d) { return +d.accolades / 4 + 1 ;})
      .style("fill", function(d){ if (+d.nature > 0) return "#ccebc5"; 
        if (+d.nature < 0) return "#fbb4ae";
        if (+d.nature == 0) return "white";
      })
      .style("stroke-width" , "0.5px")
      .style("stroke", function(d){ if (+d.nature > 0) return "black"; 
        if (+d.nature < 0) return "black";
        if (+d.nature == 0) return "white";
      });

      circle.lower();

      var mean_score = d3.mean(data_to_be_plotted[p], function(d) { return d.sucess })
      

      var lines = cell.selectAll("line")
      if (data_to_be_plotted[p].length > 0) {
        lines.transition()
          .duration(500)
          .attr("x1", xScale(domain_budget[p][0]))
          .attr("y1", yScale(mean_score))
          .attr("x2", xScale(domain_budget[p][1]))
          .attr("y2", yScale(mean_score))
          .attr("opacity", 1);

      }
      else{
        lines.transition()
          .duration(500)
          .attr("x1", xScale(domain_budget[p][0]))
          .attr("y1", yScale(-1))
          .attr("x2", xScale(domain_budget[p][1]))
          .attr("y2", yScale(-1))
          .attr("opacity", 0)
          ;
      }

      lines.raise();
}


export { update_plot_budget , budget };

