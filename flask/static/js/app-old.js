function buildMetadata(sample) {

	// @TODO: Complete the following function that builds the metadata panel
	
	var url = `/metadata/${sample}`;
	
	// Use `d3.json` to fetch the metadata for a sample
	d3.json(url).then(function(response) {
		// Use d3 to select the panel with id of `#sample-metadata`
		var sampleMetadata = d3.select("#sample-metadata");
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

function buildCharts(sample) {

	// @TODO: Use `d3.json` to fetch the sample data for the plots
	var url = `/samples/${sample}`;

	d3.json(url).then(function(response) {
	
		var otu_ids = response["otu_ids"];
		var sample_values = response["sample_values"];
		var otu_labels = response["otu_labels"];
		
		// @TODO: Build a Bubble Chart using the sample data
		var trace1 = {
			x: otu_ids,
			y: sample_values,
			mode: "markers",
			marker: {
				size: sample_values,
				color: otu_ids
			},
			//text: otu_labels,
			textinfo: "none",
			hoverinfo: "x+y",
			type: "scatter"
		};
		
		var data = [trace1];	
		
		var layout = {
			showlegend: false,
			hovermode: "closest",
			margin: {t:0},
			xaxis: {title: "OTU ID"},
			yaxis: {title: "Value"}
		};
		
		Plotly.newPlot("bubble", data, layout);
		
		// @TODO: Build a Pie Chart
		// HINT: You will need to use slice() to grab the top 10 sample_values,
		// otu_ids, and labels (10 each).
		var trace2 = {
			values: sample_values_top10,
			//labels: otu_ids_top10,
			text: otu_labels_top10,
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
	d3.json("/names").then((sampleNames) => {
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
