define(
  [
    'underscore',
    'map/marcetorProjection',
    'map/drawing/ped/polygon',
    'async!https://maps.googleapis.com/maps/api/js?v=3&libraries=places,drawing&sensor=false',
  ],
  function (_, mProj, pedPoly) {
  
    var config = {
      dim : {
        height : 480,
        width : 640
      }, 
      zoom : 20
    }
    
    var getCorners = function (center, zoom, mapWidth, mapHeight){
      ///////////////
      mapWidth = mapWidth || config.dim.width;
      mapHeight = mapHeight || config.dim.height;
      zoom = zoom || config.zoom;
      ///////////////

      var proj = new mProj();
      var scale = Math.pow(2,zoom);
      var centerPx = proj.fromLatLngToPoint(center);

      var sWPoint = {x: (centerPx.x -(mapWidth/2)/ scale) , y: (centerPx.y - (mapHeight/2)/ scale)};
      var sWLatLon = proj.fromPointToLatLng(sWPoint);
      
      var nEPoint = {x: (centerPx.x +(mapWidth/2)/ scale) , y: (centerPx.y + (mapHeight/2)/ scale)};
      var nELatLon = proj.fromPointToLatLng(nEPoint);

      return [
        sWLatLon,
        new google.maps.LatLng(nELatLon.lat(), sWLatLon.lng()),
        nELatLon,
        new google.maps.LatLng(sWLatLon.lat(), nELatLon.lng()),
      ];
    };

    var getCenter = function (lowerLeft, zoom, mapWidth, mapHeight) {
      ///////////////
      mapWidth = mapWidth || config.dim.width;
      mapHeight = mapHeight || config.dim.height;
      zoom = zoom || config.zoom;
      ///////////////

      var proj = new mProj();
      var scale = Math.pow(2, zoom);
      var llPx = proj.fromLatLngToPoint(lowerLeft);

      var centerPoint = { 
          x : llPx.x + (mapWidth/2)/scale, 
          y : llPx.y + (mapHeight/2)/scale
      };
      return proj.fromPointToLatLng(centerPoint);
    };

    var ped = function (latLongArray, map) {      
      //////////////////////
      var origin = {};

      var coordinates = _.map(latLongArray, function (point) {
        return [point.lng(), point.lat()];
      });

      origin.x = _.min(_.map(coordinates, function (c) {
        return c[0];
      }));

      origin.y = _.min(_.map(coordinates, function (c) {
        return c[1];
      }));
      //////////////////////

      var pedOrigin = new google.maps.LatLng(origin.y, origin.x);
      var staticCenter = getCenter(pedOrigin);
      
      console.log('pedOrigin : ' + pedOrigin);
      console.log('staticCenter : ' + staticCenter);

      var bounds = getCorners(staticCenter);
      
      pedPoly.draw(bounds, map);
      console.log('bounds : ' + bounds);

      console.log('getting back same orign : ' + pedOrigin.equals(bounds[0]));
    };

    return ped;
  }
);