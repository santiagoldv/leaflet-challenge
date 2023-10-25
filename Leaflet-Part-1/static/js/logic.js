
// Usage of geoJson
let geoURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


function createMap(earthquakeLocations){
//- Map layers
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
    let baseMap = {"Street Map": streetmap};
    let earthquakeMap = {"Earthquake Locations": earthquakeLocations};

//- Map creation
    var map = L.map("map", {
      center: [40, -100],
      zoom: 4,
      layers: [streetmap, earthquakeLocations]
    });

//- Legend creation
    var legend = L.control({position: "bottomright"});

//- Legend with magnitudes. Source: "https://codepen.io/haakseth/pen/KQbjdO"
    var legend = L.control({position : "bottomright"});
    legend.onAdd = function(){
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Depth (kms)</h4>";
    div.innerHTML += '<i style="background: #29ff74"></i><span>|-10 - 10 |</span><br>';
    div.innerHTML += '<i style="background: #94ff29"></i><span>| 10 - 30 |</span><br>';
    div.innerHTML += '<i style="background: #d1ff29"></i><span>| 30 - 50 |</span><br>';
    div.innerHTML += '<i style="background: #ffd129"></i><span>| 50 - 70 |</span><br>';
    div.innerHTML += '<i style="background: #ff7b29"></i><span>| 70 - 90 |</span><br>';
    div.innerHTML += '<i style="background: #ff2929"></i><span>|   90+   |</span><br>';
    return div};
    legend.addTo(map)
  };

// Color depending on magnitude
  function earthquakeColor(depth) {
    if (depth < 10 & depth > -10) return "#13B601";
    else if (depth >= 10 & depth < 30) return "#CBC100";
    else if (depth >= 30 & depth < 50) return "#DCC600";
    else if (depth >= 50 & depth < 70) return "#EEA700";
    else if (depth >= 70 & depth < 90) return "#FF7B29";
    else if (depth >= 90) return "#FF2929";
    else return "white";
  };

// Function to create features
  function createMarkers(data){
    let features = data.features;
    let locations = [];    
    for (let index = 0; index < features.length; index++){
      let location = features[index];
      let earthquakeMarker = L.circleMarker([location.geometry.coordinates[1],location.geometry.coordinates[0]], {
        radius : location.properties.mag*3,
        fillColor : earthquakeColor(location.geometry.coordinates[2]),
        color: "black",
        weight: 1,
        opacity: .35
      }) //Hover information
        .bindPopup("<h3>Location: " + location.properties.place + "</h3><h3>Magnitude: " + location.properties.mag + " </h3><h3>Depth: " + location.geometry.coordinates[2] + " km </h3>");
      locations.push(earthquakeMarker);
    }
    createMap(L.layerGroup(locations));
  };

d3.json(geoURL).then(createMarkers);