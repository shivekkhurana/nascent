define(
  [
    'jquery',
    'underscore',
    'map/marcetorProjection',
    'map/drawing/polygon',
    'async!https://maps.googleapis.com/maps/api/js?v=3&libraries=places,drawing&sensor=false',
  ],
  function ($, _, mProj, pedPoly) {

    var genPedLines = function (latLngs) {
      var pedLines = [];

      _.each(_.range(latLngs.length), function (index) {
        //get pairs of points 1,2 : 2,3 ... n-1,n : n,0
        var points = latLngs[index+1] ? [latLngs[index], latLngs[index+1]] : [latLngs[index], latLngs[0]];
        
        var p1 = {x : points[0].lng(), y : points[0].lat() };
        var p2 = {x : points[1].lng(), y : points[1].lat() };

        var lineFunction = function (x) {
          return ((p1.y - p2.y)/(p1.x - p2.x))*x + ((p1.x*p2.y - p2.x*p1.y)/(p1.x - p2.x));
        };

        pedLines.push({
          fn : lineFunction, 
          bounds : {
            min : _.min([p1.x, p2.x]), 
            max : _.max([p1.x, p2.x])
          },
          //need for debugging
          points : points
        });
      });
      return pedLines;
    };

    var getOrigin = function (latLngs) {
      return new google.maps.LatLng(
        _.min(_.map(latLngs, function (latLng) {
          return latLng.lat();
        })),
        _.min(_.map(latLngs, function (latLng) {
          return latLng.lng();
        }))
      );
    };

    var getMaxX = function (latLngs) {
      return _.max(_.map(latLngs, function (latLng) {
        return latLng.lng();
      }));
    };

    var islineInTileBound = function (tileBounds, line) {
      var tLeft = tileBounds[0].lng(); // k1
      var tRight = tileBounds[1].lng(); // k2
      var lMin = line.bounds.min; // x1
      var lMax = line.bounds.max; // x2
      return !((lMin < tLeft && lMax < tLeft) || (lMin > tRight && lMax > tRight));
    };

    var buildUrl = function (tileCenter) {
      return "http://maps.googleapis.com/maps/api/staticmap?center="+tileCenter.lat()+","+tileCenter.lng()+"&zoom=20&scale=2&size=640x480&maptype=satellite&sensor=false&format=jpg&visual_refresh=true"
    };

    /*
      debugging help
    */
    var dropMarker = function (latLng, title) {
      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title
      });
      return marker;
    };

    var markLine = function (pedLine, text) {
      dropMarker(pedLine.points[0], text);
      dropMarker(pedLine.points[1], text);
    };

    var markLineWithBounds = function (pedLine, text, originYLat) {
      markLine(pedLine, text);
      dropMarker(new google.maps.LatLng(originYLat, pedLine.bounds.min), 'Min Bound');
      dropMarker(new google.maps.LatLng(originYLat, pedLine.bounds.max), 'Max Bound');
    };
    /////////////////
    var ped = function (latLngs, map) {  

      var pedTiles = []; 
      var pedLines = genPedLines(latLngs);
      var origin = getOrigin(latLngs);
      var maxX = getMaxX(latLngs);

      for (;;){  
        var staticCenter = mProj.getCenter(origin);
        
        // check ped termination
        if (origin.lng() > maxX) break;

        var baseTileBounds = mProj.getCorners(staticCenter);
        
        // get band bounds  
        var yVals = [];
        _.each(pedLines, function (line) {
          if (islineInTileBound(baseTileBounds, line)) {
            yVals.push(line.fn(baseTileBounds[0].lng()));
            yVals.push(line.fn(baseTileBounds[1].lng()));

            // point inside band condition
            var tLeft = baseTileBounds[0].lng(); // k1
            var tRight = baseTileBounds[1].lng(); // k2
            var lMin = line.bounds.min; // x1
            var lMax = line.bounds.max; // x2
            if ((tLeft < lMax) && (lMax < tRight)) yVals.push(line.fn(lMax));
            if ((tLeft < lMin) && (lMin < tRight)) yVals.push(line.fn(lMin));
          };
        });

        // progress on band
        var tileBounds = baseTileBounds;
        while (tileBounds[0].lat() < _.max(yVals)) {
          $('.tiles-data').show().append(buildUrl(tileBounds[3]));
          var pedTile = pedPoly.draw(tileBounds, map);
          pedTiles.push(pedTile);
          tileBounds = mProj.getCorners(mProj.getCenter(tileBounds[3]));
        }

        // shift band condition
        origin = baseTileBounds[1];
      }
      return pedTiles;
    };
    return ped;
  }
);