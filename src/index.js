import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import MainRouter from './router';
import { getCurrentAccount } from './ideService';

getCurrentAccount((account) => {
	window.account = account;
})
registerServiceWorker();
ReactDOM.render(<MainRouter />, document.getElementById('root'));
