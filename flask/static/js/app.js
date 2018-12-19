var symbol = "$";

var margin = {top: 20, right: 20, bottom: 20, left: 20},
	width = 1150 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),	 // zero decimal places
	format = function(d) { return symbol + " " + formatNumber(d); },
	color = d3.scaleOrdinal(d3.schemeCategory10)

// append the svg canvas to the page
var svg = d3.select("#chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", 
		"translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
	.nodeWidth(15)
	.nodePadding(10)
	.size([width, height])

var path = sankey.link();

var graph
// load the data (using the timelyportfolio csv method)
d3.json("/top18").then(function(graph) {
	sankey
	.nodes(graph.nodes)
	.links(graph.links)
	.layout(32);

// add in the links
var link = svg.append("g").selectAll(".link")
	.data(graph.links)
	.enter().append("path")
	.attr("class", "link")
	.attr("d", path)
	.style("stroke-width", function(d) { return Math.max(1, d.dy); })
	.sort(function(a, b) { return b.dy - a.dy; });

// add the link titles
link.append("title")
		.text(function(d) {
			return d.source.name + " → " + 
				d.target.name + "\n" + format(d.value); });

// add in the nodes
var node = svg.append("g").selectAll(".node")
	.data(graph.nodes)
	.enter().append("g")
	.attr("class", "node")
	.attr("transform", function(d) { 
	return "translate(" + d.x + "," + d.y + ")"; })
	.call(d3.drag()
	.subject(function(d) { return d; })
	.on("start", function() { 
		this.parentNode.appendChild(this); })
	.on("drag", dragmove));

// add the rectangles for the nodes
node.append("rect")
	.attr("height", function(d) { return d.dy; })
	.attr("width", sankey.nodeWidth())
	.style("fill", function(d) { 
		return d.color = color(d.name.replace(/ .*/, "")); })
	.style("stroke", function(d) { 
		return d3.rgb(d.color).darker(2); })
	.append("title")
	.text(function(d) { 
		return d.name + "\n" + format(d.value); });

// add in the title for the nodes
node.append("text")
	.attr("x", -6)
	.attr("y", function(d) { return d.dy / 2; })
	.attr("dy", ".35em")
	.attr("text-anchor", "end")
	.attr("transform", null)
	.text(function(d) { return d.name; })
	.filter(function(d) { return d.x < width/4; })
	.attr("x", 6 + sankey.nodeWidth())
	.attr("text-anchor", "start");

svg.selectAll(".link")
	.style('stroke', function(d){
		return d.source.color;
	})

// the function for moving the nodes
function dragmove(d) {
	d3.select(this).attr("transform", 
		"translate(" + d.x + "," + (
				d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
			) + ")");
	sankey.relayout();
	link.attr("d", path);
}
});

function buildCharts(genres) {

	// @TODO: Use `d3.json` to fetch the sample data for the plots
	var url = `/bechdel/${genres}`;

	d3.json(url).then(function(response) {
	
		//console.log(response);
		var titles = [];
		var years = [];
		var grosses = [];
		var ratings = [];
		var size = [];
		var c = [];
		
		for (var i = 0; i < response.length; i++) {
			var title = response[i]["title"];
			var year = response[i]["year"];
			var gross = response[i]["gross"];
			var rating = response[i]["rating"];
		
			titles.push(title);
			years.push(year);
			grosses.push(gross);
			ratings.push(rating);
			size.push(gross/10000000);
			
			if (rating == 0) {
				c.push("#d96459");
			} else if (rating == "") {
				c.push("#d96459");
			} else if (rating == 1) {
				c.push("#f2ae72");
			} else if (rating == 2) {
				c.push("#f2e394");
			} else {
				c.push("#588c7e");
			}
			
			//console.log(c);
			//console.log(title);
			//console.log(year);
			//console.log(gross);
			//console.log(rating);
		}
		//console.log(ratings);
		//console.log(c);

		
		// @TODO: Build a Bubble Chart using the sample data
		var trace1 = {
			x: years,
			y: grosses,
			mode: "markers",
			marker: {
				size: size,
				color: c
			},
			text: titles,
			textinfo: "none",
			hoverinfo: "y+text+ratings",
			type: "scatter"
		};
	
		var data = [trace1];
		
		//console.log(trace1);
		
		var layout = {
			showlegend: false,
			hovermode: "closest",
			margin: {t:0},
			xaxis: {title: "Release Year"},
			yaxis: {title: "Gross"}
		};

		Plotly.newPlot("bubble", data, layout);
	});
}

function init() {
	// Grab a reference to the dropdown select element
	var selector = d3.select("#selDataset");

	// Use the list of sample names to populate the select options
	d3.json("/genres").then((sampleNames) => {
		sampleNames.forEach((sample) => {
			selector
				.append("option")
				.text(sample)
				.property("value", sample);
		});

		// Use the first sample from the list to build the initial plots
		const firstSample = sampleNames[0];
		buildCharts(firstSample);
		//buildMetadata(firstSample);
	});
}

function optionChanged(newSample) {
	// Fetch new data each time a new sample is selected
	buildCharts(newSample);
	//buildMetadata(newSample);
}

// Initialize the dashboard
init();
