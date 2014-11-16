define(function (require) {
  /*globals*/
  var map;
  var drawingManager;

  return {
    init : function () {
      var mapBase = require(['map/base'], function (mapBase) {
        map = mapBase.init();
      });

      var mapDrawing = require(['map/drawing'], function (mapDrawing) {
        mapDrawing.init(map, drawingManager);
      });
    }
  }
});