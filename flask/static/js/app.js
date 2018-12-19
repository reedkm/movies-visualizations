/*function buildMetadata(genres) {

	// @TODO: Complete the following function that builds the metadata panel
	
	var url = `/bechdel/${genres}`;
	
	// Use `d3.json` to fetch the metadata for a sample
	d3.json(url).then(function(response) {
		// Use d3 to select the panel with id of `#sample-metadata`
		var sampleMetadata = d3.select("#movie-metadata");
		// Use `.html("") to clear any existing metadata
		sampleMetadata.html("");
		// Use `Object.entries` to add each key and value pair to the panel
		// Hint: Inside the loop, you will need to use d3 to append new
		// tags for each key-value in the metadata.
		Object.entries(response).forEach(([key, value]) => {
		// Log the key and value
		// console.log(`Key: ${key} and Value ${value}`);
			var p = sampleMetadata.append("p");
			p.text(`${key}: ${value}`);
		});

});
}*/

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
				c.push("red");
			} else if (rating == "") {
				c.push("red");
			} else if (rating == 1) {
				c.push("orange");
			} else if (rating == 2) {
				c.push("yellow");
			} else {
				c.push("green");
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
