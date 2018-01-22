import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import history from 'redux/history';
import { NonIdealState } from '@blueprintjs/core';
import Search from './Search';
import Definition from './Definition';

class Main extends Component {

  state = {}

  componentDidCatch(error, info) {
    // @NOTE: here is where to send exception to Sentry or another logging service.
    console.error(error); // eslint-disable-line no-console
    this.setState({ error });
  }

  render() {

    if (this.state.error) {
      return (
        <NonIdealState
          title='Oops!'
          description='Sorry, something went wrong - Please try reloading the page.'
          visual='error'
        />
      );
    }

    return (
      <Router history={history}>
        <Switch>
          <Route exact path='/search' component={() => <Search />} />
          <Route path='/definition/:word' component={(match) => <Definition word={match.params.word} />} />
          <Redirect to='/search' />
        </Switch>
      </Router>
    );
  }
}

export default connect()(Main);
