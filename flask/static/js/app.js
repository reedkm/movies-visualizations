function buildMetadata(genres) {

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

		// BONUS: Build the Gauge Chart
		// buildGauge(data.WFREQ);	
});
}

function buildCharts(genres) {

	// @TODO: Use `d3.json` to fetch the sample data for the plots
	var url = `/samples/${genres}`;

	d3.json(url).then(function(response) {
	
		var title = response[2];
		var year = response[3];
		var gross = response[4];
		var rating = response[5];
		
		console.log(title);
		console.log(year);
		console.log(gross);
		console.log(rating);
		
		
		// @TODO: Build a Bubble Chart using the sample data
		var trace1 = {
			x: year,
			y: gross,
			mode: "markers",
			marker: {
				size: 10,
				color: rating
			},
			text: title,
			textinfo: "none",
			hoverinfo: "x+y",
			type: "scatter"
		};
		
		var data = [trace1];	
		
		var layout = {
			showlegend: false,
			hovermode: "closest",
			margin: {t:0},
			xaxis: {title: "Release Year"},
			yaxis: {title: "Gross"}
		};
		
		Plotly.newPlot("bubble", data, layout);
		
		// @TODO: Build a Pie Chart
		// HINT: You will need to use slice() to grab the top 10 sample_values,
		// otu_ids, and labels (10 each).
		var trace2 = {
			values: rating,
			labels: title,
			text: gross,
			textinfo: "percent",
			hoverinfo: "label+text+value+percent",
			type: "pie"
		};
		
		var topTen = [trace2];

		Plotly.newPlot("pie", topTen);
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
		buildMetadata(firstSample);
	});
}

function optionChanged(newSample) {
	// Fetch new data each time a new sample is selected
	buildCharts(newSample);
	buildMetadata(newSample);
}

// Initialize the dashboard
init();
