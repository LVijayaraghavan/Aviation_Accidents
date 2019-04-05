// Creating map object
var myMap = L.map("map", {
    center: [20.7, -25.95],
    zoom: 3
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    // attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    minZoom: 3,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoiamF5bWNkZXJtb3R0IiwiYSI6ImNqdGdoMXg4YjA0MDIzeXAyNnhpNTFjOTgifQ.YVunhc6IxTFI1SGAfeOTUQ"
  }).addTo(myMap);
  
  // url = base + 
  // // Grab the data with d3
  d3.json("/recent/accidents").then(function(response) {
    console.log(response)
    // Create a new marker cluster group
    var markers = L.markerClusterGroup();
  
    // Loop through data
    for (var i = 0; i < response.length; i++) {
      console.log(response[i]);
      var coords = [response[i].Lat, response[i].Lng];
      // Set the data location property to a variable
      var location = response[i].location;
  

      // Check for location property
    
  
        // Add a new marker to the cluster group and bind a pop-up
        markers.addLayer(L.marker(coords)
          .bindPopup(response[i].Location));

  
    }
  
    // Add our marker cluster layer to the map
    myMap.addLayer(markers);
  
  });
  