'use strict';

var _servers = require('servers');

var _servers2 = _interopRequireDefault(_servers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  name: '@@DB_NAME@@',
  hostname: _servers2.default.development.hostname
};