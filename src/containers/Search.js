import React, { Component } from 'react';
import PropTypes  from 'prop-types';
// import { connect } from 'react-redux';
import { NonIdealState } from '@blueprintjs/core';


export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      results: []
    };
  }

  onSearchChanged(value) {
    this.setState(state => ({
      search: value
    }));
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
                results.map(item => (
                  <h6 key={item.id}>{item.word}</h6>
                ))
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
