'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _questionnaires = require('./questionnaires');

var _questionnaires2 = _interopRequireDefault(_questionnaires);

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _reports = require('./reports');

var _reports2 = _interopRequireDefault(_reports);

var _errorHandlers = require('./errorHandlers');

var _errorHandlers2 = _interopRequireDefault(_errorHandlers);

var _serverName = require('./serverName');

var _serverName2 = _interopRequireDefault(_serverName);

var router = _express2['default'].Router();

router.use(_auth2['default']);

router.get('/', function (req, res) {
  var root = {
    _rels: {
      self: _serverName2['default'].api,
      questionnaire: _serverName2['default'].api + 'questionnaires/{id}'
    }
  };

  if (req.username) {
    root._rels.xtnaReportTemplate = _serverName2['default'].api + 'xtnaReportTemplate.pptx';
    root._rels.humanFactorsReportTemplate = _serverName2['default'].api + 'humanFactorsReportTemplate.pptx';
    root._rels.users = _serverName2['default'].api + 'users';
    root._rels.getUserById = _serverName2['default'].api + 'users/{id}';
    root.user = { username: req.username };
  } else {
    root._rels.login = _serverName2['default'].api + 'login';
  }

  res.json(root);
});

router.use(_questionnaires2['default']);
router.use(_users2['default']);
router.use(_reports2['default']);
router.use.apply(router, _toConsumableArray(_errorHandlers2['default']));

exports['default'] = router;
module.exports = exports['default'];