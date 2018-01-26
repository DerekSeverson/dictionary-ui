import React, { Component } from 'react';
import { NonIdealState, Button } from '@blueprintjs/core';
import Rx from 'rxjs';
import request from 'services/request';
import styles from './Search.scss';

const DEFAULT_STATE = {
  loading: false,
  search: '',
  results: null,
  total: 0,
  limit: 50,
  offset: 0
};

export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
  }

  componentWillMount() {

    this.$search = new Rx.Subject();

    // Immediate View Response
    this.$search.subscribe(value => {
      this.setState(state => (
        (value.length === 0)
          ? ({ ...DEFAULT_STATE })
          : ({ search: value })
      ));
    });

    // Delayed Search Request
    this.$search
      .filter(search => search.length > 0) // 1 or more characters
      .debounceTime(400) // pause for 400ms
      .distinctUntilChanged() // only if value has changed
      .switchMap(search => {
        return Rx.Observable.fromPromise(
          request({
            url: '/search',
            query: { q: search }
          })
        );
      })
      .subscribe(response => {
        this.setState({
          results: response.body.results,
          total: response.body.metadata.total,
          limit: response.body.metadata.limit,
          offset: response.body.metadata.offset
        });
      });
  }

  clearSearch() {
    this.setState({ ...DEFAULT_STATE });
  }

  onLoadMore() {
    this.setState({
      loading: true
    });
    request({
      url: '/search',
      query: {
        q: this.state.search,
        offset: this.state.offset + this.state.limit,
        limit: this.state.limit
      }
    })
    .then(response => {
      this.setState(state => ({
        loading: false,
        results: state.results.concat(response.body.results),
        total: response.body.metadata.total,
        limit: response.body.metadata.limit,
        offset: response.body.metadata.offset
      }));
    });
  }

  onSearchChanged(value) {
    this.$search.next(value);
  }

  componentWillUnmount() {
    this.$search.complete();
  }

  render() {
    const { search, results, total, offset, limit, loading } = this.state;

    return (
      <div className={styles.search_page}>
        <div className={styles.search_bar}>
          <div className={`pt-input-group pt-large ${styles.search_input}`}>
            <span className='pt-icon pt-icon-search' />
            <input
              className='pt-input'
              type='search'
              placeholder='Search the dictionary'
              value={search}
              onChange={e => this.onSearchChanged(e.target.value)}
            />
            {search && <Button
              className={`pt-minimal ${styles.circular}`}
              iconName='cross'
              onClick={() => this.clearSearch()}
            />}
          </div>
        </div>
        <div className={styles.search_body}>
          {(() => {
            if (search.length === 0) {
              return (
                <div className='margin-top-30'>
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
            } else if (results && results.length === 0) {
              return (
                <div className='margin-top-30'>
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
                <div>
                  <div className={styles.search_list}>
                    {results && results.map(item => (
                      <div key={item.id}
                        className={styles.search_list_item}
                      >
                        <span key={item.id}
                          className='pt-tag pt-large pt-minimal'
                        >{item.word}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    {(total > (offset + limit)) && (
                      <Button
                        className='pt-large pt-fill'
                        text='Load More'
                        disabled={loading}
                        loading={loading}
                        onClick={() => this.onLoadMore()}
                      />
                    )}
                  </div>
                </div>
              );
            }
          })()}
        </div>
      </div>
    );
  }

}
