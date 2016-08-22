import React from 'react';
import settings from './settings';
import autoBind from '../utils/autoBind.js';
import './App/app.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      api: null,
      route: window.location.hash.substr(1)
    };

    this.getApi();
  }
  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: window.location.hash.substr(1) })
    });
  }
  getApi() {
    $.ajax(settings.api.host)
    .success((api) => this.setState({ api }))
    .fail(() => this.setState({ errorMessage: 'Hubo un error al cargar la aplicación.' }));
  }
  render() {
    if (this.state.errorMessage) {
      return <div>{this.state.errorMessage}</div>;
    }

    if (!this.state.api) {
      return <div>'Cargando...'</div>;
    }

    return <div>'Hello World'</div>;
  }
  getComponent() {
    const routes = {
      home: '/'
    };

    const routeHandlers = {
      reports: () => <div>'Home'</div>,
    };

    const matchingRoute = this.getMatchingRoute(this.state.route, routes);
    
    if (!matchingRoute.route) {
      window.location.hash = '/home';
      return routeHandlers.home();
    }

    return routeHandlers[matchingRoute.route](matchingRoute.params);
  }
  getMatchingRoute(route, routes) {
    const forEachIndexed = R.addIndex(R.forEach);
    const currentRouteParts = route.split('/');

    let matchingRoute = null, routeParams = null;
    forEachIndexed((routeName, index) => {
      let parts = routes[routeName].split('/');
      
      if (matchingRoute || parts.length !== currentRouteParts.length) {
        return;
      }

      const params = {};
      let matching = true;
      forEachIndexed((part, partIndex) => {
        if (!matching) {
          return;
        }

        const currentRoutePart = currentRouteParts[partIndex];
        if (part[0] === ':') {
          params[R.tail(part)] = currentRoutePart;
        } else {
          matching = currentRoutePart === part;
        }
      }, parts);

      if (matching) {
        matchingRoute = routeName;
        routeParams = params;
      }
    }, Object.keys(routes));

    return {
      route: matchingRoute,
      params: routeParams
    }
  }
}
