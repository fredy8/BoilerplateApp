'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

// import lex from './letsencrypt-express';

var app = (0, _express2['default'])();

var clientPort = 443;

if (app.get('env') === 'development') {
	clientPort = 8080;
}

app.use((0, _cors2['default'])());

app.use(_bodyParser2['default'].json());
app.use(_bodyParser2['default'].urlencoded({ extended: true }));

app.use('/', _api2['default']);

if (app.get('env') == 'development') {
	(function () {
		var server = _http2['default'].createServer(app).listen(3000, function () {
			return console.log('Server listening https://localhost:' + server.address().port);
		});
	})();
} else {
	(function () {
		var server = _https2['default'].createServer({
			key: _fs2['default'].readFileSync('/etc/letsencrypt/archive/whitewatertools.com/privkey1.pem'),
			cert: _fs2['default'].readFileSync('/etc/letsencrypt/archive/whitewatertools.com/fullchain1.pem'),
			ca: _fs2['default'].readFileSync('/etc/letsencrypt/archive/whitewatertools.com/chain1.pem')
		}, app).listen(3000, function () {
			return console.log('Server listening https://localhost:' + server.address().port);
		});
	})();
}

// if (app.get('env') !== 'production') {
//   const server = app.listen(3000, () =>
//     console.log(`Server listening http://localhost:${server.address().port}`));
// } else {
//   lex.create('./letsencrypt.config', app).listen([3000], [3001], () => {
//     console.log(`Server listening http://localhost:${server.address().port}`));
//   });
// }