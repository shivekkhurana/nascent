define([
  'jquery',  
  'async!https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places,drawing'
], function ($) {
  return {
    init : function () {
      var markers = [];
      
      var $mapContainer = $('.map')[0];
      
      //expose map to global scope
      map = new google.maps.Map($mapContainer, {
        zoom : 10,
        zoomControl : true, 
        mapTypeId : google.maps.MapTypeId.HYBRID,
        center : new google.maps.LatLng(28.630129, 77.217246)
      });

      // Create the search box and link it to the UI element.
      var input = ($('input.place')[0]);
    
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */
        (input)
      );

      // Listen for the event fired when the user selects an item from the
      // pick list. Retrieve the matching places for that item.
      google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }
        for (var i = 0, marker; marker = markers[i]; i++) {
          marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
          });

          markers.push(marker);

          bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
      });
    
      return map; 
    }
  }
});