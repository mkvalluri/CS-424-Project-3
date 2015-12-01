
var Dark,Streets;
var map,mapLayers;
var Layer1,Layer2,layerControl; 


function sharedMap(){

// ===========================MapLayers============================ //

L.mapbox.accessToken = 'pk.eyJ1IjoicmV2cmVkZHkiLCJhIjoiY2lmdHlqdmNvMWZ3enVla3Fnc2xrZG93ciJ9.cy6JtcSeMkTM3AsMDtmYOg';

     Dark = L.mapbox.tileLayer('revreddy.c054f98b');
    Streets = L.mapbox.tileLayer('mapbox.streets');

    map = L.mapbox.map('map', null, {
    // center: [10, -20],
    center: [35,-20],
    zoom: 3,
    maxZoom: 18,
    doubleClickZoom: false,
});

    mapLayers = {
    'Color': Streets,
    'Dark': Dark
}

// Set map layer to dark 
mapLayers.Dark.addTo(map);
L.control.layers(mapLayers).addTo(map);

    Layer1 = L.layerGroup().addTo(map);
    Layer2 = L.layerGroup().addTo(map);

    layerControl = document.getElementById('menu-ui');

// Map controls to change the layer
this.addLayer(Layer1, 'Top 10 Artists', 1, true);
this.addLayer(Layer2, 'User Information', 2, false);
this.addButton(Layer1, 'Reset Zoom', 3, false);


}


// Adds a button for the layer controls on map 
sharedMap.prototype = {

    // adds 
    addLayer: function(layer,name,zIndex,layerOn){
        layer.setZIndex(zIndex).addTo(map);

    // creates the html code for button
    var link = document.createElement('a');
        link.href = '#';
        link.innerHTML = name;

    // sets button initial state to on or off
    if (layerOn)
        link.className = 'active';
    else {
        link.className = '';
        map.removeLayer(layer);
    }

    // defines onclick action to turn on/off layer
    link.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            this.className = '';
        } else {
            map.addLayer(layer);
            this.className = 'active';
        }
    };

    // adds html code to full site html
    layerControl.appendChild(link);
    },

    // adds button for the reset zoom
    addButton: function(layer,name){
         var link = document.createElement('a');
        link.href = '#';
        link.innerHTML = name;

    link.className = '';

    // onclick action to execute the reset action
    link.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        map.setView([35,-20], 3);
    };

    layerControl.appendChild(link);
    },

// URL-ify the artist location
// var query = data.response.artist.artist_location.location;
 Layer1Data:function(data) { // send an array of artists
     var self = this;

     /*
    for (var i = 0; i < data.length; i++) {
        /*
         var query = data[i].ArtistLocation;
         var query_url = query.split(' ').join('+');

         this.geocodeToLayer(query_url, data[i], Layer1, 1);*/
/*
        if (i % 10 == 0)
            setTimeout(getGeocode(data[i]), 2000);
        else
            getGeocode(data[i]);

    }

*/
     // changes the spaces to plus signs and then sends for geocoding
     function getGeocode(d){
         var query = d.ArtistLocation;
         var query_url = query.split(' ').join('+');

         self.geocodeToLayer(query_url, d, Layer1, 1);
     }

     var i = 0;

     // makes the geocode requests at 100ms intervals
    // one city location at a time for each artist
     function myLoop () {
         setTimeout(function () {
             getGeocode(data[i])
             i++;                     //  increment the counter
             if (i < data.length) {            //  if the counter < 10, call the loop function
                 myLoop();             //  ..  again which will trigger another
             }                        //  ..  setTimeout()
         }, 100)
     }

     myLoop();                      //  start the loop
},

 // geocoding for a single artist
 Layer2Data:function(artist) { 
    for (var i = 0; i < artist.length; i++) {
      var query = artist[i].ArtistLocation;
        var query_url = query.split(' ').join('+');

    this.geocodeToLayer(query_url, artist[i], Layer2, 2);
    }
},


// Performs the geocoding and plotting of the artist locations to the shared map
 geocodeToLayer:function(query_url, artist, layer, num) {

    // Construct Google Maps Geocoding API request url
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + query_url + '&key=AIzaSyCo_5NcD0Lh1FgqUV4cFbqwTKjH0ZD50IA'

    // Perform request to get latlng for artist location
    $.get(url, function(data) {
        // check response status
        if (data.status.localeCompare("OK")) {
            alert("Geocoding request failed: STATUS " + data.status);
        }
        var latlng = data.results[0].geometry.location; // save latlng from response

        // fetch color to use for the circlemarker based on layer
        var mColor;
        if (num == 1) {
            Layer1.eachLayer(function (layer) {
                var mll = layer.getLatLng();
                if (latlng.lat == mll.lat && latlng.lng == mll.lng) {
                    layer.setRadius(layer.getRadius()+10);
                }
            });
            mColor = getGenreColor(artist.ArtistMainGenre);
        }
        else {
            Layer2.eachLayer(function (layer) {
                var mll = layer.getLatLng();
                if (latlng.lat == mll.lat && latlng.lng == mll.lng) {
                    layer.setRadius(layer.getRadius()+10);
                }
            });
            mColor = getUserColor(artist.user); 
        }

        // Plot latlng marker on map
        var dot = L.circleMarker(latlng, {
                color: mColor,
                radius: 10,           // Circle radius
                opacity: 1,          // Stroke opacity
                weight: 2,           // Stroke weight
                fillOpacity: 0.2,    // Fill opacity);
        });

        // generate tool tip html
        tooltip = '<img src="' + artist.ArtistImageLink + '" />' + 
                  '<p>' + artist.ArtistName + '</p>' +
                  '<p>' + artist.ArtistLocation + '</p>' +
                  '<p>' + artist.ArtistMainGenre + '</p>';

        // set popup position relative to mouse click on marker
        dot.bindPopup(tooltip, {
            offset: new L.Point(-4, 0),
        });

        // add marker to map
        layer.addLayer(dot);
    });
},

// clear all markers to layer 1
 Layer1Reset:function() {
    Layer1.clearLayers();
},

  // clear all markers to layer 2
 Layer2Reset:function() {
    Layer2.clearLayers();
}




}







// get matching genre color from streamgraph
function getGenreColor(x){

    for (var i = 0; i < shared_color.length; i++){
        if (shared_color[i].genre == x)
         return shared_color[i].color;
    }

    return "#FFF";
    /*
         return x == 'rock'    ? '#55E000': // bright green
           x == 'pop'     ? '#CCFF00': // yellow-green
           x == 'dubstep' ? '#FFFF00': // 
                            '#FF0FD7'; // pink*/
}

    // get color of user
    function getUserColor(x) {
        return x == 'user1'    ? '#FF5144': // bright green
           x == 'user2'    ? '#3AC0FF': // yellow-green
                             '#FFCA00';
    }




// sets the first letter of a string to uppercase
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}




//===========================Styles==================================// 
