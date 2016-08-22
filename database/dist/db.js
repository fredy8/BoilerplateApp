'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _anyDb = require('any-db');

var _anyDb2 = _interopRequireDefault(_anyDb);

var _anyDbTransaction = require('any-db-transaction');

var _anyDbTransaction2 = _interopRequireDefault(_anyDbTransaction);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbConnectionString = 'postgres://postgres@' + _settings2.default.hostname + ':5432/' + _settings2.default.name;

var pool = _anyDb2.default.createPool(dbConnectionString, { min: 2, max: 100 });
var beginAsync = _bluebird2.default.promisify(_anyDbTransaction2.default);

exports.default = {
  queryAsync: _bluebird2.default.promisify(pool.query.bind(pool)),
  begin: function begin() {
    return beginAsync(pool).then(function (transaction) {
      _bluebird2.default.promisifyAll(transaction);
      return transaction;
    });
  }
};