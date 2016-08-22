'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _anyDb = require('any-db');

var _anyDb2 = _interopRequireDefault(_anyDb);

var _anyDbTransaction = require('any-db-transaction');

var _anyDbTransaction2 = _interopRequireDefault(_anyDbTransaction);

var dbConnectionString = 'postgres://postgres:postgres@localhost:5432/whitewater';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  var environments = require('../environments');
  var env = environments.development;
  dbConnectionString = 'postgres://postgres@' + env.host + ':5432/whitewater';
}

var pool = _anyDb2['default'].createPool(dbConnectionString, { min: 2, max: 100 });
var beginAsync = _bluebird2['default'].promisify(_anyDbTransaction2['default']);

exports['default'] = {
  queryAsync: _bluebird2['default'].promisify(pool.query.bind(pool)),
  begin: function begin() {
    return beginAsync(pool).then(function (transaction) {
      _bluebird2['default'].promisifyAll(transaction);
      return transaction;
    });
  }
};
module.exports = exports['default'];