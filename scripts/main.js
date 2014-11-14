
requirejs.config({
  baseUrl : 'scripts',
  paths : {
    async : 'lib/requirejs-plugins/src/async',
    jquery : 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
    underscore : 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min'
  },
});

require(["app"], function(app) {
  app.init();
});