define(
  [
    'async!https://maps.googleapis.com/maps/api/js?v=3&libraries=places,drawing&sensor=false'
  ],
  function () {
    var MERCATOR_RANGE = 256;

    var bound = function (value, opt_min, opt_max) {
      if (opt_min != null) value = Math.max(value, opt_min);
      if (opt_max != null) value = Math.min(value, opt_max);
      return value;
    };

    var degreesToRadians = function (deg) {
      return deg * (Math.PI / 180);
    };

    var radiansToDegrees = function (rad) {
      return rad / (Math.PI / 180);
    };

    var MercatorProjection = function () {
      this.pixelOrigin_ = new google.maps.Point( MERCATOR_RANGE / 2, MERCATOR_RANGE / 2);
      this.pixelsPerLonDegree_ = MERCATOR_RANGE / 360;
      this.pixelsPerLonRadian_ = MERCATOR_RANGE / (2 * Math.PI);
    };

    MercatorProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
      var me = this;

      var point = opt_point || new google.maps.Point(0, 0);

      var origin = me.pixelOrigin_;
      point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;
      // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
      // 89.189.  This is about a third of a tile past the edge of the world tile.
      var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);
      point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
      return point;
    };

    MercatorProjection.prototype.fromPointToLatLng = function(point) {
      var me = this;

      var origin = me.pixelOrigin_;
      var lng = (point.x - origin.x) / me.pixelsPerLonDegree_;
      var latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;
      var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
      return new google.maps.LatLng(lat, lng);
    };

    //pixelCoordinate = worldCoordinate * Math.pow(2,zoomLevel)
    var config = {
      dim : {
        height : 480,
        width : 640
      }, 
      zoom : 20
    };

    return {
      getCorners : function (center, zoom, mapWidth, mapHeight){
        ///////////////
        mapWidth = mapWidth || config.dim.width;
        mapHeight = mapHeight || config.dim.height;
        zoom = zoom || config.zoom;
        ///////////////

        var proj = new MercatorProjection();
        var scale = Math.pow(2,zoom);
        var centerPx = proj.fromLatLngToPoint(center);

        var sWPoint = {x: (centerPx.x - (mapWidth/2)/ scale) , y: (centerPx.y - (mapHeight/2)/ scale)};
        var sWLatLon = proj.fromPointToLatLng(sWPoint);
        
        var nEPoint = {x: (centerPx.x + (mapWidth/2)/ scale) , y: (centerPx.y + (mapHeight/2)/ scale)};
        var nELatLon = proj.fromPointToLatLng(nEPoint);

        return [
          new google.maps.LatLng(nELatLon.lat(), sWLatLon.lng()),
          nELatLon,
          new google.maps.LatLng(sWLatLon.lat(), nELatLon.lng()),
          sWLatLon,
        ];
      },

      getCenter : function (lowerLeft, zoom, mapWidth, mapHeight) {
        ///////////////
        mapWidth = mapWidth || config.dim.width;
        mapHeight = mapHeight || config.dim.height;
        zoom = zoom || config.zoom;
        ///////////////

        var proj = new MercatorProjection();
        var scale = Math.pow(2, zoom);
        var llPx = proj.fromLatLngToPoint(lowerLeft);

        var centerPoint = { 
            x : llPx.x + (mapWidth/2)/scale, 
            y : llPx.y - (mapHeight/2)/scale
        };
        return proj.fromPointToLatLng(centerPoint);
      },
    };
  }
);