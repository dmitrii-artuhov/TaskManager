import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

// pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Board from './pages/Board';
// protected routes
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// styles
import './style.scss';
// design inspiration - https://dribbble.com/shots/10566652--1-1DT-Dashboard/attachments/2349473?mode=media


class App extends Component {
  // use this carefully
  componentWillMount = () => {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={ Home } />
            <ProtectedRoute exact path="/account" component={ Profile } />
            <ProtectedRoute exact path="/board/:id" component={ Board } />
            <Route path="*" component={ NotFound } />
          </Switch>
        </Router>
      </Provider>
    );
  }
}


export default App;
