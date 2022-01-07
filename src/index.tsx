import './polyfills';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './app';

ReactDOM.render(
  <StrictMode>
    <Main />
  </StrictMode>,
  document.getElementById('root')
);
