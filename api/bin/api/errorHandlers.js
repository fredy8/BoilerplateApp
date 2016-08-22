'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var notFound = function notFound(req, res, next) {
  next([404, 'Resource not found']);
};

var errorHandler = function errorHandler(err, req, res, next) {
  if (!_ramda2['default'].isArrayLike(err) || err.length !== 2 || typeof err[0] !== 'number' || typeof err[1] !== 'string') {
    res.status(500);
    console.error(err.stack);
    return res.json({
      status: status,
      message: 'Internal server error'
    });
  }

  var _err = _slicedToArray(err, 2);

  var status = _err[0];
  var message = _err[1];

  res.status(status);
  res.json({
    status: status,
    message: message
  });
};

exports['default'] = [notFound, errorHandler];
module.exports = exports['default'];