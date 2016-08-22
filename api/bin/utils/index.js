'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var stringWithLength = function stringWithLength(minLen, maxLen, obj) {
  return _ramda2['default'].allPass([_ramda2['default'].is(String), function () {
    return obj.length >= minLen;
  }, function () {
    return obj.length <= maxLen;
  }], obj);
};

exports['default'] = {
  stringWithLength: stringWithLength
};
module.exports = exports['default'];