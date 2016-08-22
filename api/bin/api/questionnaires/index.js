'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _database = require('../../database');

var _database2 = _interopRequireDefault(_database);

var _shared = require('shared');

var _serverName = require('../serverName');

var _serverName2 = _interopRequireDefault(_serverName);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _ = _ramda2['default'].__;

var router = _express2['default'].Router();

var getQuestionnaireRels = function getQuestionnaireRels(id) {
  var answers = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  var _rels = {
    self: _serverName2['default'].api + 'questionnaires/' + id
  };

  if (answers) {
    _rels.answers = _serverName2['default'].api + 'questionnaires/' + id + '/answers';
    _rels.personalData = _serverName2['default'].api + 'questionnaires/' + id + '/personalData';
  }

  return _rels;
};

var getAnswersRels = function getAnswersRels(id) {
  return {
    self: _serverName2['default'].api + 'Questionnaires/' + id + '/answers'
  };
};

var stages = {
  privacy_policy: 0,
  personalData: 1,
  q1: 2,
  q2: 3,
  completed: 4
};

router.put('/questionnaires/:id/personalData', function (req, res, next) {
  if (!_shared.validations.uuid(req.params.id)) {
    return next();
  }

  var personalData = req.body.personalData;
  var name = personalData.name;
  var company = personalData.company;
  var sex = personalData.sex;

  var save = req.body.save === true || req.body.save === 'true';
  var age = typeof req.body.personalData.age === 'string' ? parseInt(req.body.personalData.age, 10) : req.body.personalData.age;

  if (!_shared.validations.name(name) && (!save || name !== '')) {
    return next([400, 'Invalid name.']);
  }

  if (!_shared.validations.age(age)) {
    return next([400, 'Invalid age.']);
  }

  if (!_shared.validations.company(company) && (!save || company !== '')) {
    return next([400, 'Invalid name.']);
  }

  if (!_shared.validations.sex(sex) && (!save || sex !== '')) {
    return next([400, 'Invalid sex.']);
  }

  _database2['default'].queryAsync('SELECT stage FROM Questionnaires WHERE id = $1', [req.params.id]).then(function (_ref) {
    var rows = _ref.rows;

    if (rows.length === 0) {
      return next();
    }

    var expiration = rows[0].expiration;
    if (expiration && (0, _moment2['default'])().isAfter(expiration)) {
      return next([412, 'The questionnaire has expired.']);
    }

    var stage = rows[0].stage;

    if (stage !== stages.personalData) {
      return next([412, 'Personal data cannot be modified at this stage.']);
    }

    return stage;
  }).then(function (stage) {
    _database2['default'].queryAsync('UPDATE Users SET name=$1, age=$2, company=$3, sex=$4 WHERE questionnaireId=$5', [name, age, company, sex, req.params.id]).then(function () {
      if (save) {
        return res.status(204).end();
      }

      _database2['default'].queryAsync('UPDATE Questionnaires SET stage=$1 WHERE id=$2', [stage + 1, req.params.id]).then(function () {
        return res.status(204).end();
      });
    });
  });
});

router.put('/questionnaires/:id/answers', function (req, res, next) {
  if (!_shared.validations.uuid(req.params.id)) {
    return next();
  }

  var newAnswers = req.body.answers;

  if (!_shared.validations.answers(newAnswers)) {
    return next([400, 'Invalid answers.']);
  }

  _database2['default'].queryAsync('SELECT expiration, answers, stage FROM Questionnaires WHERE id = $1', [req.params.id]).then(function (_ref2) {
    var rows = _ref2.rows;

    if (rows.length === 0) {
      return next();
    }

    var expiration = rows[0].expiration;

    if (expiration && (0, _moment2['default'])().isAfter(expiration)) {
      return next([412, 'The questionnaire has expired.']);
    }

    var oldAnswers = rows[0].answers;
    var stage = rows[0].stage;

    if (stage === stages.privacy_policy) {
      return _database2['default'].queryAsync('UPDATE Questionnaires SET stage=$1 WHERE id = $2', [stage + 1, req.params.id]).then(function () {
        return res.end();
      });
    }

    if (stage === stages.personalData) {
      return next([412, 'Personal data form must be completed first.']);
    }

    if (stage === stages.completed) {
      return next([412, 'The questionnaire cannot be modified at this stage.']);
    }

    if (stage === stages.q1 && !_ramda2['default'].equals(oldAnswers[1], newAnswers[1]) || stage === stages.q2 && !_ramda2['default'].equals(oldAnswers[0], newAnswers[0])) {
      return next([412, 'Cannot modify answers from stage ' + (stage ? 0 : 1) + ' because the questionnaire is in stage ' + stage + '.']);
    }

    // stage is only completed if save is set to false
    var nextStage = stage + (req.body.save ? 0 : 1);
    var completionDate = null;

    if (nextStage === stages.completed) {
      completionDate = (0, _moment2['default'])().format('YYYY-MM-DD HH:mm:ss');
    }

    if (!req.body.save) {
      var questionnaireIndex = stage - stages.q1;
      var completedAnswersValidation = [_shared.validations.finishedQuestionnaire1, _shared.validations.finishedQuestionnaire2];
      if (!completedAnswersValidation[questionnaireIndex](newAnswers[questionnaireIndex])) {
        return next([412, 'The answers are incomplete. Try setting { save: true } to only save the answers without advancing stage.']);
      }
    }

    _database2['default'].queryAsync('UPDATE Questionnaires SET answers=$1, stage=$2, completionDate=$3 WHERE id = $4', [JSON.stringify(newAnswers), nextStage, completionDate, req.params.id]).then(function () {
      return res.end();
    });
  });
});

router.get('/Questionnaires/:id/answers', function (req, res) {
  if (!_shared.validations.uuid(req.params.id)) {
    return next();
  }

  _database2['default'].queryAsync('SELECT expiration, answers FROM Questionnaires WHERE id = $1', [req.params.id]).then(function (_ref3) {
    var rows = _ref3.rows;

    if (rows.length === 0) {
      return next();
    }

    var expiration = rows[0].expiration;

    if ((0, _moment2['default'])().isAfter(expiration)) {
      res.json({ expired: true, _rels: getQuestionnaireRels(req.params.id, false) });
    }

    var answers = rows[0].answers;

    return res.json({ answers: answers, _rels: getAnswersRels(req.params.id) });
  });
});

router.get('/questionnaires/:id', function (req, res, next) {
  if (!_shared.validations.uuid(req.params.id)) {
    return next();
  }

  _database2['default'].queryAsync('SELECT expiration, answers, stage FROM Questionnaires WHERE id = $1', [req.params.id]).then(function (_ref4) {
    var rows = _ref4.rows;

    if (rows.length === 0) {
      return next();
    }

    var _rows$0 = rows[0];
    var answers = _rows$0.answers;
    var stage = _rows$0.stage;
    var expiration = _rows$0.expiration;

    if (expiration && (0, _moment2['default'])().isAfter(expiration)) {
      return res.json({ expired: true, _rels: getQuestionnaireRels(req.params.id, false) });
    }

    var answersResource = _ramda2['default'].merge(answers, { _rels: getAnswersRels(req.params.id), length: answers.length });

    _database2['default'].queryAsync('SELECT name, company, age, sex FROM Users where questionnaireId = $1', [req.params.id]).then(function (_ref5) {
      var rows = _ref5.rows;

      if (rows.length !== 1) {
        return next();
      }

      var _rows$02 = rows[0];
      var name = _rows$02.name;
      var company = _rows$02.company;
      var age = _rows$02.age;
      var sex = _rows$02.sex;

      return res.json({ stage: stage, expiration: expiration, _rels: getQuestionnaireRels(req.params.id), _embedded: { answers: answersResource, personalData: { name: name, company: company, age: age || 0, sex: sex } } });
    });
  });
});

exports['default'] = router;
module.exports = exports['default'];