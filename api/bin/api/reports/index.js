'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _authAuthorization = require('../auth/authorization');

var router = _express2['default'].Router();

router.get('/xtnaReportTemplate.pptx', _authAuthorization.requireAuth, function (req, res) {
  return res.sendFile(_path2['default'].join(__dirname, '../../static', 'xtnaReportTemplate.pptx'));
});
router.get('/humanFactorsReportTemplate.pptx', _authAuthorization.requireAuth, function (req, res) {
  return res.sendFile(_path2['default'].join(__dirname, '../../static', 'humanFactorsReportTemplate.pptx'));
});

exports['default'] = router;
module.exports = exports['default'];