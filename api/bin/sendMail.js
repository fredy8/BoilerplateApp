'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var transporter = _nodemailer2['default'].createTransport({
  service: 'Gmail',
  auth: {
    user: 'victoria@whitewater.mx',
    pass: 'victorhi5'
  }
});

var defaults = {
  from: 'Whitewater Teaming Tools <victoria@whitewater.mx>'
};

_bluebird2['default'].promisifyAll(transporter);

exports['default'] = function (options) {
  return transporter.sendMailAsync(_ramda2['default'].merge(defaults, options));
};

module.exports = exports['default'];