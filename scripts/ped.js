define(
  [
    'underscore',
    'map/marcetorProjection',
    'async!https://maps.googleapis.com/maps/api/js?v=3&libraries=places,drawing&sensor=false',
  ],
  function (_, mProj) {
  
    var config = {
      dim : {
        height : 480,
        width : 760
      }, 
    }
    
    var getCorners = function (center, zoom, mapWidth, mapHeight){
      ///////////////
      mapWidth = mapWidth || config.dim.width;
      mapHeight = mapHeight || config.dim.height;
      ///////////////

      var proj = new mProj();
      var scale = Math.pow(2,zoom);
      var centerPx = proj.fromLatLngToPoint(center);

      var sWPoint = {x: (centerPx.x -(mapWidth/2)/ scale) , y: (centerPx.y + (mapHeight/2)/ scale)};
      var sWLatLon = proj.fromPointToLatLng(sWPoint);
      
      var NEPoint = {x: (centerPx.x +(mapWidth/2)/ scale) , y: (centerPx.y - (mapHeight/2)/ scale)};
      var NELatLon = proj.fromPointToLatLng(NEPoint);

      var tileLatLngArray = [
        sWLatLon,
        new google.maps.LatLng(sWLatLon.lat(), NELatLon.lng()),
        NELatLon,
        new google.maps.LatLng(NELatLon.lat(), sWLatLon.lng())
      ];

      return tileLatLngArray;
    };

    var getCenter = function (lowerLeft, zoom, mapWidth, mapHeight) {
      ///////////////
      mapWidth = mapWidth || config.dim.width;
      mapHeight = mapHeight || config.dim.height;
      ///////////////

      var proj = new mProj();
      var scale = Math.pow(2,zoom);
      var llPx = proj.fromLatLngToPoint(lowerLeft);

      var centerPoint = {x: (llPx.x + (mapWidth/scale))/2 , y: (llPx.y + (mapHeight/scale))/2};
      var centerLatLon = proj.fromPointToLatLng(centerPoint);
      
      return centerLatLon;
    };

    return function (latLongArray) {
      
      //////////////////////
      var origin = {x:0, y:0};

      var coordinates = _.map(latLongArray, function (point) {
        return [point.lat(), point.lng()];
      });

      origin.x = _.min(_.map(coordinates, function (c) {
        return c[0];
      }));

      origin.y = _.min(_.map(coordinates, function (c) {
        return c[1];
      }));

      //////////////////////

      var centerPoint = new google.maps.LatLng(origin.x, origin.y);
      var zoom = 16;

      var corners = getCorners(centerPoint, zoom);
      console.log(corners);
      var center = getCenter(corners[0], zoom);

      console.log(center, centerPoint);
    };
  }
);