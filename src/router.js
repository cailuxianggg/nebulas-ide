import React from 'react';
import { 
	Router,
	Route,
	hashHistory
} from 'react-router';
import App from './App';
import Layout from './layout';
import IdeIndex from './ideIndex';
import MyConstract from './myConstract';
import Help from './help';


function MainRouter() {
	return (
		<Router history={hashHistory}>
			<Route component={Layout}>
				<Route path="/" component={IdeIndex} />
				<Route path="contract" component={App} />
				<Route path="mine" component={MyConstract} />
				<Route path="help" component={Help} />
			</Route>
		</Router>)
}

export default MainRouter;

