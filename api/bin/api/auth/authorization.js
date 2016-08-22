'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  requireAuth: function requireAuth(req, res, next) {
    if (!req.username) {
      return next([401, 'Unauthorized.']);
    }

    next();
  }
};
module.exports = exports['default'];