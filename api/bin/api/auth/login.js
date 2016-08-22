'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _shared = require('shared');

var _database = require('../../database');

var _database2 = _interopRequireDefault(_database);

var _utils = require('../../utils');

var _utils2 = _interopRequireDefault(_utils);

var _serverName = require('../serverName');

var _serverName2 = _interopRequireDefault(_serverName);

_bluebird2['default'].promisifyAll(_bcrypt2['default']);
_bluebird2['default'].promisifyAll(_jsonwebtoken2['default']);

var jwtSecret = 'kcge76nisbv5ksgv3sifvnwuccpm342vfw';

var credentialsValidations = _ramda2['default'].pick(['username', 'password'], _shared.validations);

var _rels = {
  self: _serverName2['default'].api + 'login'
};

exports['default'] = function (req, res, next) {
  console.log(req.body);
  if (!_shared.validations.validateObject(credentialsValidations, req.body)) {
    return next([400, 'Invalid user data.']);
  }

  var _req$body = req.body;
  var username = _req$body.username;
  var password = _req$body.password;

  _database2['default'].queryAsync('SELECT username, hash FROM Admins WHERE username = $1', ['' + username]).then(function (_ref) {
    var rows = _ref.rows;

    if (!rows.length) {
      return next([401, 'Invalid username']);
    }

    return _bcrypt2['default'].compareAsync(password, rows[0].hash);
  }).then(function (correctPassword) {
    if (!correctPassword) {
      return next([401, 'Incorrect password']);
    }

    res.json({
      _rels: _rels,
      token: _jsonwebtoken2['default'].sign({ username: username }, jwtSecret)
    });
  });
};

module.exports = exports['default'];