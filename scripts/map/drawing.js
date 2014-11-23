define([
  'jquery',  
  'async!https://maps.googleapis.com/maps/api/js?v=3&libraries=places,drawing&sensor=false'
],function ($) {
  var selectedShape;
  return {
    init : function (map, drawingManager) {
      var Drawer = {
        initialize : function () {
          var polyOptions = {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true
          };
          drawingManager = new google.maps.drawing.DrawingManager({
            drawingControl: true,
            draggable: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.BOTTOM_LEFT,
              drawingModes: [
                google.maps.drawing.OverlayType.POLYGON,
              ]
            },
            rectangleOptions : polyOptions,
            polygonOptions : polyOptions,
            map : map
          });
        }, 
        clear : function () {
          if (selectedShape) {
            selectedShape.setMap(null);
            drawingManager.setOptions({
              drawingControl : true
            });
          }
        }
      };
      
      var polygonComplete = function (e) {
        // Switch back to non-drawing mode after drawing a shape.
        drawingManager.setDrawingMode(null);
        drawingManager.setOptions({
          drawingControl : false
        });

        selectedShape = e.overlay;
        selectedShape.type = e.type;
        console.log(e.overlay.getPath().getArray());
      };

      var addOverlayCompleteListener = function (){
        if(drawingManager){
          google.maps.event.addListener(drawingManager,'overlaycomplete',function(polygon) {
            polygonComplete(polygon);

            google.maps.event.addListener(polygon.overlay.getPath(), 'set_at', function() {
              console.log(polygon.overlay.getPath().getArray());
            });

            google.maps.event.addListener(polygon.overlay.getPath(), 'insert_at', function() {
              console.log(polygon.overlay.getPath().getArray());
            });
          });
        } else {
          setTimeout(addOverlayCompleteListener, 500);
        }
      }

      addOverlayCompleteListener();

      $(window).load(function () {
        //Drawer.initialize();
      });

      $('.reset').click(function () {
        //Drawer.clear();
      });
      google.maps.event.addDomListener(window, 'load', Drawer.initialize );
      google.maps.event.addDomListener($('.reset')[0], 'click', Drawer.clear );
    }
  }
});