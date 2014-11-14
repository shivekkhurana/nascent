define(function (require) {
  return {
    init : function () {
      var mapBase = require(['map/base'], function (mapBase) {
        mapBase.init();
      });

      var mapDrawing = require(['map/drawing'], function (mapDrawing) {
        mapDrawing.init();
      });
    }
  }
});