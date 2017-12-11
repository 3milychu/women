// data = [];

// function preload() {
//     // load the CSV data into our `table` variable and clip out the header row
//     table = loadTable("assets/gender_stats.csv", "csv", "header");
//     data = loadJSON("assets/gender_stats.json");
// }

// function setup() {

//     // var w_mgrMax = getColumnMax("w_mgr");
//     // console.log(w_mgrMax);

//     var regions = _.groupBy(data, 'region');
//     console.log(regions);
// }

// function draw (){
//     fill(0);
//     background(innerWidth, innerHeight);
//     chart(data);
// }

d3.csv('assets/gender_stats.csv', function(error, data) {
    chart(data);
});


function chart(data) {

data = []; 

var diffFormat = d3.format(".0%");
var diffs = [],
    w_mgr = [];

data.forEach(function(d) {

    // add diff to diffs array
    diffs.push(d.diff);

    // Add w_mgr to w_mgr array
    w_mgr.push(+d.w_mgr);

    });

var width = 1200, height = 200;

 // Calculate the range of the diffsdata
    var xExtent = d3.extent(diffs);
    var xRange = xExtent[1] - xExtent[0];

    // Adjust the lower and upper bounds to force the data
    // to fit into the x limits nicely
    xExtent[0] = xExtent[0] - xRange * 0.1;
    xExtent[1] = xExtent[1] + xRange * 0.1;

var x = d3.scaleLinear()
    .range([0, width])
    .domain(xExtent);

var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 10]);

var xAxis = d3.axisBottom()
    .scale(x)

var yAxis = d3.axisLeft()
    .scale(y)

var line = d3.area()
    .x(function(d, i) { return x(i); })
    .y1(function(d) { return y(d); })
    .y0(height)
    // .interpolate('cardinal');

var svg = d3.select("body").append("svg")
    .attr("width", width + 60)
    .attr("height", height + 50)
    .append("g")
    .attr("transform", "translate(50, 10)")

svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);


// // data formats

//     // format for diff
//     var diffFormat = d3.format(".0%");

//     var diffs = [],
//         w_mgr = [];

//     data.forEach(function(d) {

//     // add diff to diffs array
//     diffs.push(d.diff);

//     // Add w_mgr to w_mgr array
//     w_mgr.push(+d.w_mgr);

//     });

//     var chartWidth = 800,
//         chartHeight = 250,
//         margin = {
//             top: 5,
//             right: 25,
//             bottom: 20,
//             left: 25
//         };

//     var container = d3.select('#chartDiv');

//     var svg = container.append('svg')
//         .attr('width', chartWidth)
//         .attr('height', chartHeight);

//     var defs = svg.append('defs');

//     // clipping area
//     defs.append('clipPath') 
//         .attr('id', 'plot-area-clip-path')
//         .append('rect')
//             .attr({
//                 x: margin.left,
//                 y: margin.top,
//                 width: chartWidth - margin.right - margin.left,
//                 height: chartHeight - margin.top - margin.bottom
//             });

//     // Invisible background rect to capture all zoom events
//     var backRect = svg.append('rect')
//         .style('stroke', 'none')
//         .style('fill', '#FFF')
//         .style('fill-opacity', 0)
//         .attr({
//             x: margin.left,
//             y: margin.top,
//             width: chartWidth - margin.right - margin.left,
//             height: chartHeight - margin.top - margin.bottom,
//             'pointer-events': 'all'
//         });

//     var axes = svg.append('g')
//         .attr('pointer-events', 'none')
//         .style('font-size', '11px');

//     var chart = svg.append('g')
//         .attr('class', 'plot-area')
//         .attr('pointer-events', 'none')
//         .attr('clip-path', 'url(#plot-area-clip-path)');


//     // Calculate the range of the diffsdata
//     var xExtent = d3.extent(diffs);
//     var xRange = xExtent[1] - xExtent[0];

//     // Adjust the lower and upper bounds to force the data
//     // to fit into the x limits nicely
//     xExtent[0] = xExtent[0] - xRange * 0.1;
//     xExtent[1] = xExtent[1] + xRange * 0.1;

//     // the x scale
//     var xScale = d3.scaleLinear()
//         .range([margin.left, chartWidth - margin.right])
//         .domain(xExtent);

//     // Calculate the range of the w_mgr data
//     var yExtent = d3.extent(w_mgr);
//     var yRange = yExtent[1] - yExtent[0];

//     // Adjust the lower and upper bounds to force the data
//     // to fit into the y limits nicely
//     yExtent[0] = yExtent[0] - yRange * 0.1;
//     yExtent[1] = yExtent[1] + yRange * 0.1;

//     // the y scale
//     var yScale = d3.scaleLinear()
//         .range([chartHeight - margin.bottom, margin.top])
//         .domain(yExtent);

//     // x axis
//     var xAxis = d3.axisBottom()
//         // .outerTickSize(0)
//         // .innerTickSize(0)
//         .scale(xScale);

//     // y axis
//     var yAxis = d3.axisLeft()
//         // .orient('left')
//         // .outerTickSize(0)
//         // .innerTickSize(- (chartWidth - margin.left - margin.right))  // trick for creating quick gridlines
//         .scale(yScale);

//     var yAxis2 = d3.axisRight()
//         // .orient('right')
//         // .outerTickSize(0)
//         // .innerTickSize(0)
//         .scale(yScale);

//     // Add the x axis to the chart
//     var xAxisEl = axes.append('g')
//         .attr('class', 'x-axis')
//         .attr('transform', 'translate(' + 0 + ',' + (chartHeight - margin.bottom) + ')')
//         .call(xAxis);

//     // Add the y axis to the chart
//     var yAxisEl = axes.append('g')
//         .attr('class', 'y-axis')
//         .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
//         .call(yAxis);

//     // Add the y axis to the chart
//     var yAxisEl2 = axes.append('g')
//         .attr('class', 'y-axis right')
//         .attr('transform', 'translate(' + (chartWidth - margin.right) + ',' + 0 + ')')
//         .call(yAxis2);

//     // Format y-axis gridlines
//     yAxisEl.selectAll('line')
//         .style('stroke', '#BBB')
//         .style('stroke-width', '1px')
//         .style('shape-rendering', 'crispEdges');


//     // Start data as a flat line at the average
//     var avgw_mgr = yScale(d3.mean(w_mgr));

//     // Path generator function for our data
//     var pathGenerator = d3.line()
//         .x(function(d, i) { return xScale(diffs[i]); })
//         .y(function(d, i) { return yScale(w_mgr[i]); });

//     // Series container element
//     var series = chart.append('g');

//     // Add the temperature series path to the chart
//     series.append('path')
//         .attr('vector-effect', 'non-scaling-stroke')
//         .style('fill', 'none')
//         .style('stroke', 'red')
//         .style('stroke-width', '1px')
//         .attr('d', pathGenerator(diffs));


//     // Add zooming and panning functionality, only along the x axis
//     var zoom = d3.zoom()
//         .on('zoom', function zoomHandler() {

//             axes.select('.x-axis')
//                 .call(xAxis);

//             series.attr('transform', 'translate(' + d3.event.translate[0] + ',0) scale(' + d3.event.scale + ',1)');

//         }
//         // .scaleExtent([1, 12])
//         // .x(xScale)
//         );

//     // The backRect captures zoom/pan events
//     // backRect.call(zoom);


//     // Function for resetting any scaling and translation applied
//     // during zooming and panning. Returns chart to original state.
//     function resetZoom() {

//         zoom.scale(1);
//         zoom.translate([0, 0]);
        
//         // Set x scale domain to the full data range
//         xScale.domain(d3.extent(diffs));

//         // Update the x axis elements to match
//         axes.select('.x-axis')
//             .transition()
//             .call(xAxis);

//         // Remove any transformations applied to series elements
//         series.transition()
//             .attr('transform', "translate(0,0) scale(1,1)");

//     };

//     // Call resetZoom function when the button is clicked
//     d3.select("#reset-zoom").on("click", resetZoom);




//     // Active point element
//     var activePoint = svg.append('circle')
//         .attr({
//             cx: 0,
//             cy: 0,
//             r: 5,
//             'pointer-events': 'none'
//         })
//         .style({
//             stroke: 'none',
//             fill: 'red',
//             'fill-opacity': 0
//         });


//     // Set container to have relative positioning. This allows us to easily
//     // position the tooltip element with absolute positioning.
//     container.style('position', 'relative');

//     // Create the tooltip element. Hidden initially.
//     var tt = container.append('div')
//         .style({padding: '5px',
//             border: '1px solid #AAA',
//             color: 'black',
//             position: 'absolute',
//             visibility: 'hidden',
//             'background-color': '#F5F5F5'
//         });



//     // Function for hiding the tooltip
//     function hideTooltip() {

//         tt.style('visibility', 'hidden');
//         activePoint.style('fill-opacity', 0);

//     }


//     // Function for showing the tooltip
//     function showTooltip() {

//         tt.style('visibility', 'visible');
//         activePoint.style('fill-opacity', 1);

//     }


//     // Tooltip content formatting function
//     function tooltipFormatter(diff, w_mgr) {

//         var diffsFormat = d3.format(".0%");
//         return diffsFormat(diff) + '<br><b>' + w_mgr.toFixed(1) + '%';

//     }



//     backRect.on('mousemove', function() {

//         // Coords of mousemove event relative to the container div
//         var coords = d3.mouse(container.node());

//         // Value on the x scale corresponding to this location
//         var xVal = xScale.invert(coords[0]);

//         // Date object corresponding the this x value. Add 12 hours to
//         // the value, so that each point occurs at midday on the given date.
//         // This means date changes occur exactly halfway between points.
//         // This is what we want - we want our tooltip to display data for the
//         // closest point to the mouse cursor.
//         var d = new String(xVal + .01 / 2);

//         // Find the index of this date in the array of original date strings
//         var i = diffs.indexOf(d);

//         // Does this date exist in the original data?
//         var diffExists = i > -1;

//         // If not, hide the tooltip and return from this function
//         if (!diffExists) {
//             hideTooltip();
//             return;
//         }

//         // If we are here, the date was found in the original data.
//         // Proceed with displaying tooltip for of the i-th data point.

//         // Get the i-th date value and temperature value.
//         var _diff = diffs[i],
//             _w_mgr = w_mgr[i];

//         // Update the position of the activePoint element
//         activePoint.attr({
//             cx: xScale(_diff),
//             cy: yScale(_w_mgr)
//         });

//         // Update tooltip content
//         tt.html(tooltipFormatter(_diffs, _w_mgr));

//         // Get dimensions of tooltip element
//         var dim = tt.node().getBoundingClientRect();

//         // Update the position of the tooltip. By default, above and to the right
//         // of the mouse cursor.
//         var tt_top = coords[1] - dim.height - 10,
//             tt_left = coords[0] + 10;

//         // If right edge of tooltip goes beyond chart container, force it to move
//         // to the left of the mouse cursor.
//         if (tt_left + dim.width > chartWidth)
//             tt_left = coords[0] - dim.width - 10;

//         tt.style({
//             top: tt_top + 'px',
//             left: tt_left + 'px'
//         });
        
//         // Show tooltip if it is not already visible
//         if (tt.style('visibility') != 'visible')
//             showTooltip();

//     });


//     // Add mouseout event handler
//     backRect.on('mouseout', hideTooltip);

}