define(function (require) {
  /*globals*/
  var map;
  var drawingManager;

  return {
    init : function () {
      var mapBase = require(['map/base'], function (mapBase) {
        map = mapBase.init();
      });

      var mapDrawing = require(['map/drawing/tool'], function (mapDrawing) {
        mapDrawing.init(map, drawingManager);
      });

      require(['jquery'], function($){
        $('.copy-data').click(function(){
          console.log($('.tiles-data').text());
        });
      })
    }
  }
});