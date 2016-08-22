'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

_bluebird2['default'].promisifyAll(_jsonwebtoken2['default']);

var jwtSecret = 'kcge76nisbv5ksgv3sifvnwuccpm342vfw';
var router = _express2['default'].Router();

router.use(function (req, res, next) {
  var accessToken = req.headers['x-access-token'];
  if (!accessToken) {
    return next();
  }

  _jsonwebtoken2['default'].verifyAsync(accessToken, jwtSecret).then(function (_ref) {
    var username = _ref.username;

    req.username = username;
    next();
  })['catch'](_jsonwebtoken2['default'].JsonWebTokenError, function (err) {
    return next([400, 'Invalid token.']);
  });
});

router.post('/login', _login2['default']);

exports['default'] = router;
module.exports = exports['default'];