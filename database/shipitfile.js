import servers from 'servers';
import R from 'ramda';

module.exports = function (shipit) {
  const config = R.compose(
    R.fromPairs,
    R.map((environment) => [environment, { servers: servers[environment] }]),
    Object.keys)(servers);

  shipit.initConfig(config);

  shipit.task('install-db', function () {
    return shipit.remote('pwd');
  });
};
