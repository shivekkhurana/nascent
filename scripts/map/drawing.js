define([
  'jquery', 
  'underscore',
  'async!https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places,drawing'
], function ($, _) {
  return {
    init : function () {
      function initializeDrawingControl () {
        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_LEFT,
            drawingModes: [
              google.maps.drawing.OverlayType.POLYGON,
              google.maps.drawing.OverlayType.RECTANGLE
            ]
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

        //map comes in from global scope
        drawingManager.setMap(map);
      }

      google.maps.event.addDomListener(window, 'load', initializeDrawingControl());
    }
  }
});