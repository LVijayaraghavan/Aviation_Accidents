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

//Here we populate the drop down for Years in the report
d3.json('/Hist').then(function(histdata)
{
console.log(histdata)
 populate_filter(stateselect,histdata)
});

//plot for bar chart
var defaultURL = "/Cause";
d3.json(defaultURL).then(function(data) {
console.log(data);
  var data = [data];
  var layout ={
    title: 'Causes Analysed for Period(1960-2019)',
    autosize: false,
    width: 500,
    height: 500,
    margin: {
        l:150,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      },
    yaxis:{automargin: true,
           title:"Causes"},
    // paper_bgcolor: '#7f7f7f'
    // plot_bgcolor: '#c7c7c7'
    xaxis:{title:"Number of Accidents"}
  };
  Plotly.plot("bar", data, layout);
});

//plot for pie chart

var causeurl= "/pie";
d3.json(causeurl).then(function(data) {
    console.log(data);
// var data = [data];
    var layout = {
        title: 'Distribution of Accident Causes',
        annotations: [
        {
        font: {
        size: 20
        },
       showarrow: false,
       text: 'Causes',
      //  x: 0.17,
      //  y: 0.5
       },
      

      ],
      margin: {
        l:50,
        r: 50,
        b: 100,
        t: 100, 
        pad: 4
      },
     height: 500,
     width: 500,
     showlegend: true,
    };
        Plotly.plot("pie", [data.data],layout);
        });
//load the history table initially
var defaultyear="2019";
load_table(defaultyear);

d3.json("/accident_summ").then(function(data) {
console.log(data); 

var layout = {
  title: 'Acccidents and Fatalities',
  xaxis:{
    title:"Year",
    rangeslider: {
      range: [1908, 2020] // this is the range the *entire* slider spans
    }
  },
  yaxis: {title: 'Accidents'},
         
  yaxis2: {
    title: 'Fatalities',
    titlefont: {color: 'rgb(148, 103, 189)'},
    tickfont: {color: 'rgb(148, 103, 189)'},
    overlaying: 'y',
    side: 'right',
    // showline:true
  },
  
  autosize:true,
  width:600,
  height:700,
  margin: {
    l:50,
    r: 50,
    b: 100,
    t: 100, 
    pad: 4
  },
};
Plotly.newPlot("#line1", data, layout)
});


d3.json("/depart_summ").then(function(data) {
  console.log(data); 
  
  var layout = {
    title: 'Number of Departures',
    xaxis:{
      title:"Year",
      boundmode: 'hard',
      bounds: ["1970", "2020"],
      autorange:true,
      // rangeslider: {
      //   range: ["1970", "2020"] // this is the range the *entire* slider spans
      // }
    },
    yaxis: {title: 'Total Departures'},
     
    
    autosize:true,
    
    width:600,
  height:700,
  margin: {
    l:50,
    r: 50,
    b: 100,
    t: 100, 
    pad: 4
  },
  };
  Plotly.newPlot("#line2", data, layout,{ autoscaleYAxis: true })
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

function clear_table() {
  tr=tbody.selectAll("tr").remove()
 
};




function updatebarPlotly(newdata) {
    Plotly.restyle("bar", "x", [newdata.x]);
    Plotly.restyle("bar", "y", [newdata.y]);
  }






function optionChanged(newSample) {
    //clear data and load new table 
   clear_table();
   load_table(newSample);
    
  }


  function getData(category)
  {
    if (category==='Cause')
    {
      d3.json('/Cause').then(function(data) {
          var data = [data];
          var layout ={
            title: 'Causes Analysed for Period(1960-2019)',
            autosize: false,
            width: 500,
            height: 500,
            margin: {
                l:50,
                r: 50,
                b: 100,
                t: 100,
                pad: 4
              },
            yaxis:{automargin: true,
                   title:"Number of Accidents"
                          
            },
            xaxis:{title: "Causes"}
            // paper_bgcolor: '#7f7f7f'
            // plot_bgcolor: '#c7c7c7'
          };
          Plotly.newPlot("bar", data, layout);
        });

        d3.json('/pie').then(function(data) {
          console.log(data);
      // var data = [data];
          var layout = {
              title: 'Distribution of Accident Causes',
              annotations: [
              {
              font: {
              size: 20
              },
             showarrow: false,
             text: 'Causes',
            //  x: 0.17,
            //  y: 0.5
             },
            
      
            ],
            margin: {
              l:50,
              r: 50,
              b: 100,
              t: 100, 
              pad: 4
            },
           height: 500,
           width: 500,
           showlegend: true,
          };
              Plotly.newPlot("pie", [data.data],layout);
              });


    }

    else if (category==='CType') {
      d3.json('/CType').then(function(data) {
        var data = [data];
        var layout ={
          title:"Accidents by Aircraft Type",
          xaxis: {
            title:"Aircraft Type (Military/Passenger)",
            tickfont: {
            size: 14,
            color: 'rgb(107, 107, 107)',
          }},
        yaxis: {
          title: 'Count of Accidents',
          titlefont: {
            size: 12,
            color: 'rgb(107, 107, 107)'
          },
          tickfont: {
            size: 14,
            color: 'rgb(107, 107, 107)'
          },
        },
          autosize: false,
          width: 600,
          height: 600,
          margin: {
              l:50,
              r: 50,
              b: 100,
              t: 100,
              pad: 4
            },
          yaxis:{automargin: true},
          // paper_bgcolor: '#7f7f7f'
          // plot_bgcolor: '#c7c7c7'
        };
        Plotly.newPlot("bar", data, layout);
      });

      d3.json('/CTypeFatal').then(function(data) {
        console.log(data);
    // var data = [data];
        var layout = {
            title: 'Fatalities by Type of Flight',
            annotations: [
            {
            font: {
            size: 20
            },
            font: {
              size: 10
            },
           showarrow: false,
          // text: 'Fatals By Type',
         
          //  x: 0.17,
          //  y: 0.5
           },
          
    
          ],
          margin: {
            l:50,
            r: 50,
            b: 100,
            t: 100, 
            pad: 4
          },
         height: 500,
         width: 500,
         showlegend: true,
        };
            Plotly.newPlot("pie", [data.data],layout);
            });

     

    }


  }
