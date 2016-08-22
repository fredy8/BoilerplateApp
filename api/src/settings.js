import servers from 'servers';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let settings = {
  hostname: servers.production.hostname,
  port: '@@API_PORT@@'
};

if (process.env.NODE_ENV == 'production') {
	const devSettings = {
    hostname: servers.development.hostname,
    port: '@@API_PORT_DEV@@'
	};

	settings = R.merge(settings, devSettings);
}

settings.apiUrl = `https://${settings.hostname}:${settings.port}/`

module.exports = settings;
