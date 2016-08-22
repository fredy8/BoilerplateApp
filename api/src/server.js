import fs from 'fs';
import https from 'https';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import api from './api';
import settings from './settings';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', api);

if (app.get('env') == 'development') {
	const server = http.createServer(app).listen(settings.port, () =>
		console.log(`Server listening https://localhost:${settings.port}`));
} else {
	const server = https.createServer({
	  key: fs.readFileSync('@@SSL_KEY@@'),
	  cert: fs.readFileSync('@@SSL_CERT@@'),
	  ca: fs.readFileSync('@@SSL_CA@@')
	}, app).listen(3000, () =>
		console.log(`Server listening https://localhost:${settings.port}`));
}
