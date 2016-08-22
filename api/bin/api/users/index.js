'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _shared = require('shared');

var _database = require('../../database');

var _database2 = _interopRequireDefault(_database);

var _utils = require('../../utils');

var _utils2 = _interopRequireDefault(_utils);

var _serverName = require('../serverName');

var _serverName2 = _interopRequireDefault(_serverName);

var _sendMail = require('../../sendMail');

var _sendMail2 = _interopRequireDefault(_sendMail);

var _authAuthorization = require('../auth/authorization');

var router = _express2['default'].Router();
var userValidations = _ramda2['default'].pick(['name', 'email', 'expirationDays'], _shared.validations);
var pageSize = 20;

var usersRels = function usersRels(page, total, sort, order, nameFilter, companyFilter, emailFilter, stageFilter, sexFilter) {
  var filters = {
    name: nameFilter,
    company: companyFilter,
    email: emailFilter,
    stage: stageFilter,
    sex: sexFilter
  };

  var filterQuery = _ramda2['default'].compose(_ramda2['default'].join('&'), _ramda2['default'].map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var k = _ref2[0];
    var v = _ref2[1];
    return k + '=' + encodeURIComponent(v);
  }), _ramda2['default'].filter(_ramda2['default'].last), _ramda2['default'].toPairs)(filters);

  var rels = {
    self: _serverName2['default'].api + ('users?page=' + page + (filterQuery ? '&' + filterQuery : '') + '&sort=' + sort + '&order=' + order),
    getPage: _serverName2['default'].api + ('users?page={pageNum}' + (filterQuery ? '&' + filterQuery : '') + '&sort=' + sort + '&order=' + order),
    search: _serverName2['default'].api + ('users?name={name}&company={company}&email={email}&sex={sex}&stage={stage}&sort=' + sort + '&order=' + order),
    sort: _serverName2['default'].api + ('users?page=' + page + (filterQuery ? '&' + filterQuery : '') + '&sort={sort}&order={order}'),
    'export': _serverName2['default'].api + 'users/export'
  };

  if ((page + 1) * pageSize < total) {
    rels.next = _serverName2['default'].api + ('users?page=' + (page + 1) + (filterQuery ? '&' + filterQuery : '') + '&sort=' + sort + '&order=' + order);
  }

  if (page) {
    rels.previous = _serverName2['default'].api + ('users?page=' + (page - 1) + (filterQuery ? '&' + filterQuery : '') + '&sort=' + sort + '&order=' + order);
  }

  return rels;
};

var wrapUser = _ramda2['default'].curryN(2, function (addTemplates, user) {
  return _ramda2['default'].merge({
    _rels: _ramda2['default'].merge({ self: _serverName2['default'].api + 'users/' + user.id }, !addTemplates ? {} : {
      xtnaReportTemplate: _serverName2['default'].api + 'xtnaReportTemplate.pptx',
      humanFactorsReportTemplate: _serverName2['default'].api + 'humanFactorsReportTemplate.pptx'
    })
  }, user);
});

var getResults = function getResults(answers) {
  var values = [[1, 0, 3, 2], [3, 0, 1, 2], [1, 3, 0, 2], [1, 3, 2, 0], [0, 3, 1, 2], [2, 1, 3, 0], [1, 3, 0, 2], [1, 3, 2, 0], [3, 2, 1, 0], [4, 1, 2, 3], [3, 2, 0, 1], [1, 2, 3, 0], [0, 2, 1, 3], [3, 2, 0, 1], [1, 3, 0, 2], [3, 0, 2, 1], [1, 2, 0, 3], [2, 0, 3, 1], [0, 1, 2, 3], [1, 2, 3, 0], [3, 2, 1, 0], [1, 3, 0, 2], [1, 3, 0, 2], [1, 2, 0, 3], [0, 3, 2, 1], [1, 3, 0, 2], [0, 2, 1, 3], [3, 0, 1, 2]];

  var most = [0, 0, 0, 0, 0];
  var least = [0, 0, 0, 0, 0];
  for (var i = 0; i < answers[1].length; i++) {
    most[values[i][answers[1][i][0] - 1]]++;
    least[values[i][answers[1][i][1] - 1]]++;
  }

  var boundaries = {
    AX: [3, 4, 5, 6, 7, 8, 10, 12],
    AT: [3, 4, 5, 6, 8, 9, 10, 12],
    AN: [2, 3, 4, 5, 7, 8, 9, 12],
    AA: [2, 3, 4, 5, 6, 7, 9, 11],
    NX: [3, 4, 5, 6, 8, 9, 10, 11],
    NT: [3, 4, 5, 6, 7, 8, 9, 11],
    NN: [4, 5, 7, 8, 10, 11, 12, 14],
    NA: [3, 4, 5, 6, 7, 9, 10, 11]
  };

  var result = {
    AX: 1,
    AT: 1,
    AN: 1,
    AA: 1,
    NX: 9,
    NT: 9,
    NN: 9,
    NA: 9
  };

  var xtna = ['X', 'A', 'N', 'T'];
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 8; j++) {
      if (most[i] >= boundaries['A' + xtna[i]][j]) {
        result['A' + xtna[i]]++;
      }

      if (least[i] >= boundaries['N' + xtna[i]][j]) {
        result['N' + xtna[i]]--;
      }
    }
  }

  return {
    xtna: result,
    'disc+': most.slice(0, 4),
    'disc-': least.slice(0, 4),
    benzinger: { L: 5, A: 2, V: 11, I: 8 }
  };
};

var invitationTemplate = {
  text: _fs2['default'].readFileSync(_path2['default'].join(__dirname, '../../static/Invitation.txt'), 'utf8'),
  html: _fs2['default'].readFileSync(_path2['default'].join(__dirname, '../../static/Invitation.html'), 'utf8')
};

var fillTemplate = _ramda2['default'].curryN(4, function (name, expirationDays, questionnaireId, template) {
  return template.replace('{{name}}', name).replace('{{limit}}', expirationDays !== -1 ? ' Dispones de ' + expirationDays + ' día' + (expirationDays === 1 ? '' : 's') + ' para responder los cuestionarios.' : '').replace('{{link}}', _serverName2['default'].client + '#/cuestionarios/' + questionnaireId);
});

var getEmailContent = function getEmailContent(name, expirationDays, questionnaireId) {
  var replace = fillTemplate(name, expirationDays, questionnaireId);
  return {
    text: replace(invitationTemplate.text),
    html: replace(invitationTemplate.html)
  };
};

router.post('/users', _authAuthorization.requireAuth, function (req, res, next) {
  if (_ramda2['default'].is(String, req.body.expirationDays)) {
    req.body.expirationDays = parseFloat(req.body.expirationDays, 10);
  }

  if (!_shared.validations.validateObject(userValidations, req.body)) {
    return next([400, 'Invalid user data.']);
  }

  var user = _ramda2['default'].pick(['name', 'email'], req.body);

  var questionnaireId = _nodeUuid2['default'].v4();
  var expirationDate = req.body.expirationDays !== -1 ? (0, _moment2['default'])().add(req.body.expirationDays, 'day').format('YYYY-MM-DD HH:mm:ss') : null;

  _database2['default'].begin().then(function (transaction) {
    return transaction.queryAsync('INSERT INTO Questionnaires (id, expiration) VALUES ($1, $2)', [questionnaireId, expirationDate]).then(function () {
      return transaction.queryAsync('INSERT INTO Users (name, company, age, email, questionnaireId) VALUES ($1, $2, $3, $4, $5) RETURNING id, creationDate', [user.name, user.company, user.age, user.email, questionnaireId]);
    }).then(function (_ref3) {
      var rows = _ref3.rows;

      transaction.commitAsync().then(function () {
        return (0, _sendMail2['default'])(_ramda2['default'].merge({ to: user.email, subject: 'Human Factors - ' + user.name }, getEmailContent(user.name, req.body.expirationDays, questionnaireId)));
      }).then(function () {
        var userResource = wrapUser(false, _ramda2['default'].merge(rows[0], user));
        res.json({
          _rels: {
            newUser: userResource._rels.self
          },
          _embedded: {
            newUser: userResource
          }
        });
      });
    });
  });
});

var getFilters = function getFilters(startingIndex, nameFilter, companyFilter, emailFilter, stageFilter, sexFilter) {
  var filter = [],
      args = [];
  var index = startingIndex;

  if (nameFilter) {
    filter.push('name ILIKE $' + index);
    args.push('%' + nameFilter + '%');
    index++;
  }

  if (companyFilter) {
    filter.push('company ILIKE $' + index);
    args.push('%' + companyFilter + '%');
    index++;
  }

  if (emailFilter) {
    filter.push('email = $' + index);
    args.push('' + emailFilter);
    index++;
  }

  if (stageFilter) {
    filter.push('stage = $' + index);
    args.push('' + stageFilter);
    index++;
  }

  if (sexFilter) {
    filter.push('sex = $' + index);
    args.push('' + sexFilter);
    index++;
  }

  return {
    where: filter.join(' AND '),
    args: args,
    nextIndex: index
  };
};

router.get('/users', _authAuthorization.requireAuth, function (req, res, next) {
  var page = parseFloat(req.query.page || '0', 10);
  var nameFilter = req.query.name;
  var companyFilter = req.query.company;
  var emailFilter = req.query.email;
  var stageFilter = parseFloat(req.query.stage, 10);
  var sexFilter = req.query.sex;
  var sort = req.query.sort || 'id';
  var order = req.query.order || 'asc';
  var sqlSort = sort === 'id' ? 'u.id' : sort;

  if (isNaN(page) || !_shared.validations.isNumberInRange(0, 1000000000, page)) {
    return next([400, 'Invalid page number.']);
  }

  if (nameFilter && !_shared.validations.name(nameFilter)) {
    return next([400, 'Name filter must contain between 1 and 60 characters.']);
  }

  if (companyFilter && !_shared.validations.company(companyFilter)) {
    return next([400, 'Company filter must contain between 1 and 60 characters.']);
  }

  if (emailFilter && !_shared.validations.company(emailFilter)) {
    return next([400, 'Email filter must be a valid email.']);
  }

  if (stageFilter && !_shared.validations.isNumberInRange(0, 3, stageFilter)) {
    return next([400, 'Stage must be an integer between 0 and 3.']);
  }

  if (sexFilter && !_shared.validations.sex(sexFilter) === -1) {
    return next([400, 'Sex filter must be M or F.']);
  }

  if (!_ramda2['default'].contains(sqlSort, ['u.id', 'name', 'company', 'age', 'expiration', 'stage', 'email', 'sex', 'completionDate'])) {
    return next([400, 'Invalid sort field.']);
  }

  if (!_ramda2['default'].contains(order, ['asc', 'desc'])) {
    return next([400, 'Invalid sort order.']);
  }

  require('../../database/setup');

  var mapIndexed = _ramda2['default'].addIndex(_ramda2['default'].map);
  _database2['default'].begin().then(function (transaction) {
    var fromClause = 'FROM Users as u JOIN Questionnaires as q on u.questionnaireId = q.id';
    var filters = getFilters(1, nameFilter, companyFilter, emailFilter, stageFilter, sexFilter);
    var whereClause = filters.where ? 'WHERE ' + filters.where : '';
    transaction.queryAsync('SELECT COUNT(*) ' + fromClause + ' ' + whereClause + ';', filters.args).then(function (_ref4) {
      var _ref4$rows = _slicedToArray(_ref4.rows, 1);

      var count = _ref4$rows[0].count;

      transaction.queryAsync('\n        SELECT u.id, name, company, age, expiration, stage, email, sex, completionDate\n        ' + fromClause + '\n        ' + whereClause + '\n        ORDER BY ' + sqlSort + ' ' + order + '\n        LIMIT $' + filters.nextIndex + '\n        OFFSET $' + (filters.nextIndex + 1) + ';', [].concat(_toConsumableArray(filters.args), [pageSize, page * pageSize])).then(function (_ref5) {
        var rows = _ref5.rows;

        transaction.commitAsync().then(function () {
          var rowToUser = function rowToUser(row) {
            return _ramda2['default'].merge(_ramda2['default'].pick(['id', 'name', 'company', 'age', 'email', 'sex'], row), { questionnaire: { expirationDate: row.expiration, stage: row.stage, completionDate: row.completiondate } });
          };
          var userResources = rows.map(_ramda2['default'].compose(wrapUser(false), rowToUser));
          var _rels = _ramda2['default'].fromPairs(mapIndexed(function (user, idx) {
            return [idx + page * pageSize, user._rels.self];
          }, userResources));
          var _embedded = _ramda2['default'].fromPairs(mapIndexed(function (user, idx) {
            return [idx + page * pageSize, user];
          }, userResources));
          res.json({ _rels: _ramda2['default'].merge(_rels, usersRels(page, count, sort, order, nameFilter, companyFilter, emailFilter, stageFilter, sexFilter)), _embedded: _embedded, total: count });
        });
      });
    });
  });
});

router.get('/users/export', _authAuthorization.requireAuth, function (req, res, next) {
  _database2['default'].queryAsync('SELECT u.id as uid, name, company, age, sex, email, completionDate, answers FROM Users as u JOIN Questionnaires as q on questionnaireId = q.id WHERE stage = 4').then(function (_ref6) {
    var rows = _ref6.rows;

    res.setHeader('Content-disposition', 'attachment; filename=usuarios.csv');
    res.setHeader('Content-type', 'text/plain; charset=utf-8');

    var results = getResults;
    var data = [['Id', 'Nombre', 'Compañía', 'Edad', 'Sexo', 'Fecha de Evaluación', 'Email', 'D+', 'I+', 'S+', 'C+', 'D-', 'I-', 'S-', 'C-']].concat(_toConsumableArray(rows.map(function (row) {
      var results = getResults(row.answers);
      return [row.uid, row.name, row.company, row.age, row.sex, row.completiondate, row.email].concat(_toConsumableArray(results['disc+']), _toConsumableArray(results['disc-']));
    })));

    var csvContent = '';
    data.forEach(function (infoArray, index) {
      var dataString = infoArray.join(",");
      csvContent += index < data.length ? dataString + "\n" : dataString;
    });

    csvContent = csvContent.replace(/á/g, 'a');
    csvContent = csvContent.replace(/é/g, 'e');
    csvContent = csvContent.replace(/í/g, 'i');
    csvContent = csvContent.replace(/ó/g, 'o');
    csvContent = csvContent.replace(/ú/g, 'u');
    csvContent = csvContent.replace(/ñ/g, 'n');
    csvContent = csvContent.replace(/Á/g, 'A');
    csvContent = csvContent.replace(/É/g, 'I');
    csvContent = csvContent.replace(/Í/g, 'E');
    csvContent = csvContent.replace(/Ó/g, 'O');
    csvContent = csvContent.replace(/Ú/g, 'U');
    csvContent = csvContent.replace(/Ñ/g, 'N');

    res.send(csvContent);
  });
});

router.get('/users/:id', _authAuthorization.requireAuth, function (req, res, next) {
  var id = parseFloat(req.params.id, 10);
  if (!_shared.validations.isNumberInRange(0, 1000000000, id)) {
    return next([400, 'Invalid user id.']);
  }

  _database2['default'].queryAsync('SELECT u.id, name, company, age, sex, creationDate, expiration, stage, answers, email, completionDate FROM Users as u JOIN Questionnaires as q on u.questionnaireId = q.id WHERE u.id = $1', [id]).then(function (_ref7) {
    var rows = _ref7.rows;

    if (!rows.length) {
      return next();
    }

    var rowToUser = function rowToUser(row) {
      return _ramda2['default'].mergeAll([_ramda2['default'].pick(['id', 'name', 'company', 'age', 'creationdate', 'email', 'sex'], row), { questionnaire: { expirationDate: row.expiration, stage: row.stage, answers: row.answers, completionDate: row.completiondate } }, { results: getResults(row.answers) }]);
    };
    _ramda2['default'].compose(res.json.bind(res), wrapUser(true), rowToUser, _ramda2['default'].head)(rows);
  });
});

exports['default'] = router;
module.exports = exports['default'];