import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

import "@blueprintjs/core/lib/css/blueprint.css";

ReactDOM.render(
  //<React.StrictMode>
    <Router>
      <App />
    </Router>,
  //</React.StrictMode>,
  document.getElementById('root')
);