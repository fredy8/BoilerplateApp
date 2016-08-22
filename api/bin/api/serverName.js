'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var server = '{{API_LOCATION}}';
if (server[0] == '{') {
  server = 'http://localhost';
}

var clientPort = process.env.NODE_ENV === 'development' ? '8080' : '80';

exports['default'] = {
  api: server + ':3000/',
  client: server + '/'
};
module.exports = exports['default'];