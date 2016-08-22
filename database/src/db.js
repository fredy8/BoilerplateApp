import R from 'ramda';
import Promise from 'bluebird';
import anyDB from 'any-db';
import begin from 'any-db-transaction';
import settings from './settings';

const dbConnectionString = `postgres://postgres@${settings.hostname}:5432/${settings.name}`;

const pool = anyDB.createPool(dbConnectionString, { min: 2, max: 100 });
const beginAsync = Promise.promisify(begin);

export default {
  queryAsync: Promise.promisify(pool.query.bind(pool)),
  begin: () =>
    beginAsync(pool).then((transaction) => {
      Promise.promisifyAll(transaction);
      return transaction;
    })
};
