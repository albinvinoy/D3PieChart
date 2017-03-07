var sizeofLegend = 18;
var legendSpacing = 4;

var margin = {top: 20, right: 20, bottom:20, left:20},
    width = 600 - margin.right*2,
    height = 600 - 2*margin.top,
    radius = width/2;

var color = d3.scaleOrdinal( d3.schemeCategory20);
   
// arc and the pie
var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(150);

var arcOver = d3.arc()
    .outerRadius(radius +100)
    .innerRadius(100+100);

var label = d3.arc()
    .outerRadius(radius - 80)
    .innerRadius(radius - 80);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.spending;});

var svg = d3.select("body")
    .append("svg")
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

// data 
d3.csv("piedata.csv", function(error, data){
    if(error) throw error;

    data.forEach(function(d){
        d.department = d.department; // change this to the function
        d.spending = +d.spending;
    });

// enter data
var g = svg.selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class','arc');

// update data
var path = g.append('path')
    .attr('d', arc)
    .style('stroke', 'white')
    .style('stroke-width', '2')
    .style('fill', function(d) {
        return color(d.data.department)
    })
    .transition()
    .ease(d3.easeElastic )
    .duration(2000)
    .attrTween('d',animate);

    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = sizeofLegend + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var hori = -2 * sizeofLegend;
            var vert = i * height - offset;
            return 'translate(' + hori + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', sizeofLegend)
        .attr('height', sizeofLegend)
        .style('fill', color)
        .style('stroke', color)
        .transition()
        .ease(d3.easeElastic)
        .duration(5000);

    legend.append('text')
        .attr('x', sizeofLegend + legendSpacing)
        .attr('y', sizeofLegend - legendSpacing)
        .text(function(d) { return d; });



    g.append('text')
    .transition()
    .ease(d3.easeElastic)
    .duration(5000)
    .attr('transform', function(d) {
        return 'translate(' + label.centroid(d) + ')';
    } )
    .attr('dy', '.40em')
    .style('text-anchor', 'middle')
    .style('fill', 'white')
 //  .text(function(d) {return d.data.spending; })
    ;

g.on('mouseover', function(d, i){
  //  console.log(data[i].spending+ ',' +i);
    var re_count = data[i].spending;
    g.append('text')
    .attr('dy', '1em')
        .attr('x','70px')
        .attr('y','-30px')
    //.style('text-anchor', 'end')
    .style("font-size", 20)
    .attr('class' , 'label')
    .style('fill', function(d,i){
        return 'Black';
    })
    .text('$' +re_count + 'B')
})

.on('mouseout', function(){
    g.select('.label').remove();
});

});
function animate(b){
    b.innerRadius = 0;
    var i = d3.interpolate({startAngle:0, endAngle:0},b);
    return function(t){
        return arc(i(t));}
}

