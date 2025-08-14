import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.tsx';
import './bootstrap';

const rootElement = document.getElementById('app');

if (rootElement) {
    ReactDOM.render(<App />, rootElement);
}
