// JOSH BODE
// SEP 2018

// THE CODE CREATES 4 FUNCTIONS

// 1. UPDATES THE META-DATA - THE TABLE IN THE INTERACTIVE CHART. IT ALSO CALLS A FUNCTION TO PRODUCE THE GAUGE CHART.
// 2. BUILDS A BUBBLE PLOT - Using the user selection 
// 3. BUILDS A PIE CHART - It sorts and slices to identify the top 10 backteria before producing the chat
// 4. INITIALIZE THE PAGE - SO ITS NOT BLANK. The fuction is called at the bottom
// 5. UPON CHANGE - UPDATE DATA AND PLOTS WITH USER SELECTION

// 1. UPDATE THE META-DATA (FUNCTION)

function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(metadata) {
    console.log(metadata); 
  
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.select('#sample-metadata')
      .html(""); // Use `.html("") to clear any existing metadata 

    // Use `Object.entries` to add each key and value pair to the panel  
    Object.entries(metadata).forEach( d => {
      d3.select('#sample-metadata')
        .append('div')
        .text(`${d[0]}: ${d[1]}`); 
    });  


    // BONUS: Build the Gauge Chart
    buildGauge(metadata.WFREQ);
  }); 
}; 


// 2. BUILD A BUBBLE PLOT (FUNCTION)

function buildBubble(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  
  d3.json(`/samples/${sample}`).then(function(sampledata) {
    console.log(sampledata); 

  // Set trace  
    var trace1 = {
      type: "scatter",
      mode: 'markers',
      name: "Bubble Plot", 
      x: sampledata.otu_ids,
      y: sampledata.sample_values,
      marker: {
        size: sampledata.sample_values,
        color: sampledata.otu_ids, 
        opacity: '0.5'
      },
    };
    
    // Place in data
    var data = [trace1];

    // Specify layout
    var layout = {
        title: 'BubblePlot',
    };

    // Plot it
    var BUBBLE = document.getElementById("bubble");
    Plotly.newPlot(BUBBLE, data, layout);
    
  }); 
}; 

// 3. BUILDS A PIE PLOT
    //BUILD A PIE CHART
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each)

function buildPie(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/piesample/${sample}`).then(function(sampledata) {  
    console.log(sampledata);

  // Set trace  
    var trace1 = {
      type: "pie",
      name: "Pie Chart", 
      labels: sampledata.otu_ids,
      values: sampledata.sample_values,
      text: sampledata.otu_labels
    };
    
    // Place in data
    var data = [trace1];

    // Specify layout
    var layout = {
        title: 'Top 10 Bacteria',
        hoverinfo: 'text', 
        showlegend: true
    };  

    // Plot it
    var PIE = document.getElementById("pie");
    Plotly.newPlot(PIE, data, layout);
    
  }); 
}; 
    

// 4. INITIALIZE THE PAGE - SO ITS NOT BLANK

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
    // buildCharts(firstSample);
    buildMetadata(firstSample);
    buildBubble(firstSample);
    buildPie(firstSample);
  
  });
}

// 5. UPON CHANGE - UPDATE DATA AND PLOTS WITH USER SELECTION
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected

  buildMetadata(newSample);
  buildBubble(newSample);
  buildPie(newSample);

}

// Initialize the dashboard
init();
