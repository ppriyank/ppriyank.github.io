// Oppenheimer biography mid budget, accolades director ===> oscar :) 

// https://www.youtube.com/watch?v=gda35eYXBJc
// https://www.youtube.com/watch?v=XmVPHq4NhMA&ab_channel=CurranKelleher
var margin = {top: 0, right: 0, bottom: 0, left: 0}

var parentDiv = document.getElementsByClassName("Genre")[0];
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
var y_axis_length = [height- margin.bottom - 50,  margin.top]

var plot_width = x_axis_length[1] - x_axis_length[0]
var plot_margin_x_left = margin.left

var plot_margin_y_top = margin.top
var plot_height = y_axis_length[0] - y_axis_length[1]

var x_axis_pos = [0, plot_height + plot_margin_y_top]
var y_axis_pos = [plot_margin_x_left, 0]


var y_mid_point = plot_margin_y_top + plot_height /2;
var y_label_pos = [2 * plot_margin_x_left , y_mid_point + y_label.length * 10 / 2 ]

var svg = d3.select(parentDiv)
  .append("svg")
    .attr("width", plot_width + margin.left + margin.right)
    .attr("height", plot_height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")            

var g =  svg.append("g");
// var borderRect = svg.append("rect")
//           .attr("stroke","#000000")
//           .attr("fill-opacity",0.5)
//           .attr("stroke-width",1)
//           .attr("width", plot_width)
//           .attr("height",plot_height)
//           .attr("transform","translate(" + plot_margin_x_left + "," + plot_margin_y_top + ")");



var start = 0 
var end = 5000
var interval = 50 
var color_width = 1
var x_offset = ((end - start) / interval) 
g.selectAll('rect')
  .data(d3.range(start,end,interval))
  .enter()
    .append('rect')
    .attr("width", color_width)
    .attr("height", 5)
    .attr("fill", "yellow")
    .attr("fill-opacity", function(d,i) { return d / end;})
    .attr("stroke-width", "0px")
    .attr("transform", function(d,i) { return "translate(" + ((plot_width - x_offset) /2 + i ) + "," + (plot_margin_y_top+ 20 ) + ")";})

g.append("text")
    .attr("class", "legend")
    .attr("transform", function(d,i) { return "translate(" + ((plot_width - x_offset - 40) /2  ) + "," + (plot_margin_y_top + 10 ) + ")";})
    .attr("dy", "0.1em")
    .text("Co-occurrence:")


g.append("text")
    .attr("class", "legend")
    .attr("transform", function(d,i) { return "translate(" + ((plot_width - x_offset ) /2 ) + "," + (plot_height - 30 ) + ")";})
    .attr("dy", "0.1em")
    .text("Success:")

var customSymbolSquare = { 
        draw: function(context, size){
            let s = Math.sqrt(size)/2;
            context.moveTo(0,0);
            context.lineTo(s,10*s);
            context.lineTo(2 * s,0);
            context.closePath();
        }
    }
var customSqr = d3.symbol().type(customSymbolSquare).size(200);
g.append("path")
    .attr("d", customSqr)
    .attr("transform", "translate(" + ((plot_width + 40) /2 ) +"," + (plot_height - 20) + ")rotate(-270)");
    // .attr("transform", "translate(" + (plot_width +10) +",60)");




var xScale = d3.scaleLinear();
var yScale = d3.scaleLinear()
      .range([ y_axis_length[0], y_axis_length[1] ]);  

var genre = ['action', 'adventure', 'biography', 'comedy', 'crime', 
'drama', 'fantasy', 'horror',  'mystery', 'sci-fi', 'romance', 'thriller', 'history', 'animation']

var link = svg.append("g").selectAll(".link");
var node = svg.append("g").selectAll(".node");
var label = svg.append("g").selectAll(".label");

//  simulation initialization
var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(plot_width / 2 -30 , plot_height / 2 - 20))    
  .alphaTarget(1)
  .on("tick", ticked)
  
var t = d3.transition()
          .duration(transition_time);


function plotting_genre(genre_count, genre_sucess, link_count){
  
  var min_sucess = 2
  var max_sucess = 0
  var max_link = 0
  var min_link = 2000
  var nodes = [];
  var links = [];
  
  genre.forEach(function(key,i ) {
      var nodeelement = {}
      nodeelement['id']=key
      nodeelement['group']=i
      var sucess = (genre_sucess[key] / Math.max(genre_count[key], 1) )

      min_sucess = Math.min(min_sucess, sucess)
      max_sucess = Math.max(max_sucess, sucess)

      nodeelement['success_rating']=sucess
      nodes.push(nodeelement)
      genre.forEach(function(key2) {
        var linkelement = {}
        linkelement['source'] = key
        linkelement['target'] = key2
        linkelement['value']= link_count[key][key2]?link_count[key][key2]:0

        max_link = Math.max(linkelement['value'], max_link)
        min_link = Math.min(linkelement['value'] ,min_link) 
        links.push(linkelement)
      });
    });

  link = link.data( links );  
  link.exit().transition(t)
    .attr("stroke-opacity", 0)
    .attr("opacity", 0)
    .attrTween("x1", function(d) { return function() { return d.source.x; }; })
    .attrTween("x2", function(d) { return function() { return d.target.x; }; })
    .attrTween("y1", function(d) { return function() { return d.source.y; }; })
    .attrTween("y2", function(d) { return function() { return d.target.y; }; })
    .remove();

  link = link.enter().append("line")
    .attr("class", "link")
    .merge(link);

  link.transition(t)
    .attr("stroke-width", function(d) {
      var dinominator = (max_link - min_link)
      var value = 0
      if (dinominator != 0)
        value= (d.value - min_link) / dinominator;
      return value * 5;
    })
    .attr("opacity", function(d) {
      var dinominator = (max_link - min_link)
      var value = 0
      if (dinominator != 0)
        value= (d.value - min_link) / dinominator;
      return value / 2;
    })
    
  label = label.data( nodes );  
  label.exit().remove();
  label = label.enter().append("text")
  .attr("class", "label")
  .merge(label)
  .text(function(d) { return d.id; });

  node = node.data(nodes);
  node.exit().transition(t).attr("opacity", 0).remove();
  node = node.enter()
      .append("circle")
      .attr("class", "node")
      .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
      .merge(node);

  node.transition(t)
    .attr("r",function(d) {  
      var radius = 0;
      var dinominator = max_sucess - min_sucess;
      if (dinominator != 0 )
        radius = 10 * (d.success_rating - min_sucess) / dinominator + 1;  
      return  radius})

  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(1).restart();

}

    
//  drag event handlers
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}


function ticked() {

      node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      label
        .attr("x", function(d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .attr("dx", 12)
        .attr("dy", ".35em")

    }



export { plotting_genre , genre};
