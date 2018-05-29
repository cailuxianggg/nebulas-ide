import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {constractList} from './ideService';

constractList((a)=>{
  console.log(a)
})
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
