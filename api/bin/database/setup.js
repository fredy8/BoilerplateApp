'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _indexJs = require('./index.js');

var _indexJs2 = _interopRequireDefault(_indexJs);

/*

database.begin()
.then((transaction) => {
  transaction.queryAsync(`
    CREATE TABLE Admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(25) NOT NULL UNIQUE,
      hash VARCHAR(61) NOT NULL,
      super BOOLEAN NOT NULL
    );`)
  .then(() =>
    transaction.queryAsync('CREATE UNIQUE INDEX usernameIndex ON Admins(username);'))
  .then(() =>
    transaction.queryAsync(`INSERT INTO Admins (username, hash, super) VALUES('admin', '$2a$12$UoH3fdVoPi5NhhcdobELW.QnJgsAS6TXC1adf7smEsGly.mx2cAVy', true);`))
  .then(() => transaction.commitAsync())
  .then(() => console.log('Created admins table.'));
}).catch((err) => console.log(err));

database.begin()
.then((transaction) => {
  const defaultArray = JSON.stringify([new Array(40).fill(0), new Array(28).fill([0, 0])]);
  transaction.queryAsync(`
    CREATE TABLE Questionnaires (
      id UUID PRIMARY KEY,
      expiration DATE,
      answers JSON NOT NULL DEFAULT '${defaultArray}'::JSON,
      stage SMALLINT NOT NULL DEFAULT 0,
      completionDate DATE
    );`)
  .then(() => transaction.queryAsync(`
    CREATE TABLE Users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(61) NOT NULL,
      company VARCHAR(61),
      age SMALLINT,
      sex CHAR,
      email VARCHAR(255) NOT NULL,
      creationDate DATE NOT NULL DEFAULT CURRENT_DATE,
      questionnaireId UUID NOT NULL REFERENCES Questionnaires(id)
    );`))
  .then(() => transaction.queryAsync('CREATE EXTENSION pg_trgm'))
  .then(() => transaction.queryAsync('CREATE EXTENSION btree_gin'))
  .then(() => transaction.queryAsync('CREATE INDEX nameIndex ON Users USING GIN(name gin_trgm_ops);'))
  .then(() => transaction.queryAsync('CREATE INDEX companyIndex ON Users USING GIN(company gin_trgm_ops);'))
  .then(() => transaction.queryAsync('CREATE INDEX emailIndex ON Users USING HASH(email);'))
  .then(() => transaction.queryAsync('CREATE INDEX qStageIndex ON Questionnaires USING HASH(stage);'))
  .then(() => transaction.queryAsync('CREATE INDEX usersQIdIndex ON Users USING HASH(questionnaireId);'))
  .then(() => transaction.commitAsync())
  .then(() => console.log('Created users and questionnaires tables.'));
}).catch((err) => console.log(err));

database.queryAsync('ALTER TABLE Users ALTER COLUMN company DROP NOT NULL;')
.catch((err) => console.log(err));

database.queryAsync('ALTER TABLE Users ALTER COLUMN age DROP NOT NULL;')
.catch((err) => console.log(err));

database.queryAsync('alter table users add column sex char;')
.catch((err) => console.log(err));

database.queryAsync('alter table questionnaires add column completionDate DATE;')
.catch((err) => console.log(err));
*/