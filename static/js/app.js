// from data.js
var stateselect =d3.select("#selDataset")
var table=d3.select("#YrlyAccidents")
var tbody=table.select("tbody")
var causeselect =d3.select("#selCause")


//Function to populate the drop downs with the values to filter
function populate_filter(selectobj,filt_data)
{

filt_data.forEach( s => {
    selectobj.append("option")
               .attr("value",s)
               .text(s)
});
}
console.log('Here')
d3.json('/Hist').then(function(histdata)
{
d3.json('/accident/cause').then(function(data)
{
    populate_filter(causeselect,data)
});
console.log(histdata)
populate_filter(stateselect,histdata)
});

//Function to load the table with data
function load_table(newSample) {
    d3.json(`/accidents/${newSample}`).then (function(data){
    console.log(data);
    data.forEach(function (item){
        // console.log(item);
        var row=tbody.append("tr");
        Object.values(item).forEach(val=>
        {
            console.log(val);
           row.append("td").text(val);            
        });
   
        
               
        
    });
});
}
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected

    console.log(`parameter is ${newSample}`)
   load_table(newSample);
    // buildMetadata(newSample);
    // buildGauge(newSample);
  }

