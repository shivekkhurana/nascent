define([
  'jquery', 
  'underscore',
  'async!https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places,drawing'
], function ($, _) {
  return {
    init : function () {
      
      function initializeDrawingControl () {
        var mapOptions = {
          //center: new google.maps.LatLng(-34.397, 150.644),
          //zoom: 8
        };

        var map = new google.maps.Map($('.map')[0], mapOptions);

        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.MARKER,
              google.maps.drawing.OverlayType.CIRCLE,
              google.maps.drawing.OverlayType.POLYGON,
              google.maps.drawing.OverlayType.POLYLINE,
              google.maps.drawing.OverlayType.RECTANGLE
            ]
          },
          markerOptions: {
            icon: 'images/beachflag.png'
          },
          circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
          }
        });

        drawingManager.setMap(map);
      }

      google.maps.event.addDomListener(window, 'load', initializeDrawingControl);
    }
  }
});