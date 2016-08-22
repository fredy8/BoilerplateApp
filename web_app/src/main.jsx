import 'normalize.css/normalize.css';
import 'react-date-picker/index.css';
import './utils/CanvasUtils';
import browserInfo from './utils/browserInfo';
import browserSupport from './App/browserSupport.jsx';
import React from 'react';
import App from './App/App.jsx';

const browser = browserInfo();
let supported =  browser.version >= (browserSupport[browser.name] || 0);

if (!supported) {
  let lines = [
    'Este sitio no puede ser visualizado con este navegador.',
    'Se requiere alguno de los siguientes navegadores:'
  ];

  for (let key in browserSupport) {
    let val = key;
    
    if (val == 'IE') {
      val = 'Internet Explorer'
    }

    lines.push(val + ' ' + browserSupport[key] + '+');
  }

  document.documentElement.innerHTML = lines.join('<br />');
} else {
  $.ajaxSetup({ cache: false });

  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    };
  }

  Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" && 
      isFinite(value) && 
      Math.floor(value) === value;
  };

  function main() {
    const app = document.createElement('div');
    document.body.appendChild(app);
    React.render(<App />, app);
  }

  main();
}
