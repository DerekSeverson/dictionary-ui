import React, { Component } from 'react';
import PropTypes  from 'prop-types';
// import { connect } from 'react-redux';
import { NonIdealState } from '@blueprintjs/core';
import Rx from 'rxjs';
import request from 'services/request';


export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      results: []
    };
  }

  componentWillMount() {
    this.$search = new Rx.Subject();
    this.$search.subscribe({
      next: value => this.setState({
        search: value
      })
    });
    this.$search
      .filter(search => search.length >= 2) // 2 or more characters
      .debounceTime(600) // pause for 600ms
      .distinctUntilChanged() // only if value has changed
      .switchMap(search => {
        return Rx.Observable.fromPromise(request({
          method: 'GET',
          url: '/search',
          query: {
            q: search
          }
        }));
      })
      .subscribe({
        next: response => {
          console.log(response);
          this.setState(state => ({
            results: response.body.results
          }));
        }
      });
  }

  onSearchChanged(value) {
    this.$search.next(value);
  }

  componentWillUnmount() {
    this.$search.complete();
  }

  render() {
    const { search, results } = this.state;

    return (
      <div>
        <div className='pt-input-group pt-large'>
          <span className='pt-icon pt-icon-search' />
          <input
            className='pt-input'
            type='search'
            placeholder='Search the dictionary'
            value={search}
            onChange={e => this.onSearchChanged(e.target.value)}
          />
        </div>
        <div>
          {(() => {
            if (search.length === 0) {
              return (
                <div style={{ marginTop: '30px' }}>
                  <NonIdealState
                    title='Give it a try!'
                    description='Search the dictionary for a particular word.'
                    visual={(
                      <div className='pt-non-ideal-state-visual pt-non-ideal-state-icon'>
                        <span className='pt-icon pt-icon-arrow-up rubberBand animated infinite' />
                      </div>
                    )}
                  />
                </div>
              );
            } else if (results.length === 0) {
              return (
                <div style={{ marginTop: '30px' }}>
                  <NonIdealState
                    title='No search results'
                    description={(
                      <p>Your search didn't match any words in our dictionary.
                        <br />Try searching for something else.
                      </p>
                    )}
                    visual='search'
                  />
                </div>
              );
            } else {
              return (
                <div style={{ display: 'fill' }}>
                  {results.map(item => (
                    <div
                      className='pt-card pt-elevation-0 pt-interactive'
                      style={{ margin: '10px', maxWidth: '260px', display: 'inline-block'}}
                      >
                      <h5 key={item.id}>{item.word}</h5>
                    </div>
                  ))}
                </div>
              );
            }
          })()}
        </div>
      </div>
    );
  }

}

// Search.propTypes = {
//   dispatch: PropTypes.func.isRequired,
//   input: PropTypes.string,
//   results: PropTypes.array
// };
//
// function mapStateToProps(state, ownProps) {
//   return {
//
//   };
// }
//
// export default connect(mapStateToProps)(Search);
