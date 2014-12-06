define(
  [  
    'async!https://maps.googleapis.com/maps/api/js?v=3&libraries=places,drawing&sensor=false'
  ],
  function () {
    return {
      draw : function (latLngArray, map) {
        var polygon = new google.maps.Polygon({
          paths: latLngArray,
          strokeColor: '#1c2de0',
          strokeOpacity: 0.8,
          strokeWeight: 0.5,
          fillColor: '#1c2de0',
          fillOpacity: 0.35
        });

        polygon.setMap(map);
        return polygon;
      }
    }
  }
);