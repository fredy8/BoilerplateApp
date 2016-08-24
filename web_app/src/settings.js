import servers from 'servers';

let settings = {
  api: {
    host: `https://${servers.production.hostname}:@@API_PORT@@/`
  }
};

if (process.env.NODE_ENV !== 'production') {
  const devSettings = {
    api: {
      host: `http://127.0.0.1:@@API_PORT_DEV@@/`
    }
  };

  settings = R.merge(settings, devSettings);
}

export default settings;
