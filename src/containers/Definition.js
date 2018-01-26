import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NonIdealState } from '@blueprintjs/core';
import request from 'services/request';
import styles from './Definition.scss';

const STATUS = Object.freeze({
  LOADING: Symbol('LOADING'),
  LOADED: Symbol('LOADED'),
  ERROR: Symbol('ERROR')
});

const groupby = (array, key) => (
  array.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {})
);

class Definition extends Component {

  state = {
    status: STATUS.LOADING,
    info: null
  };

  componentDidMount() {
    const { word } = this.props;
    request({
      url: `/definition/${word}`
    })
    .then(response => {
      this.setState({
        status: STATUS.LOADED,
        info: Object.entries(groupby(response.body.definitions, 'category'))
      });
    })
    .catch(error => {
      this.setState({ status: STATUS.ERROR });
    });
  }

  render() {
    const { word } = this.props;
    const { info, status } = this.state;

    return (
      <div className={styles.definition_page}>
        <h1 className={styles.title}>{word}</h1>
        <hr />
        {(() => {

          if (status === STATUS.LOADING) {
            return null;
          }

          if (status === STATUS.ERROR) {
            return (
              <div className='margin-top-30'>
                <NonIdealState
                  title='No Definition'
                  description='Sorry, but we could not find your word.  Try another?'
                  visual='disable'
                />
              </div>
            );
          }

          if (status === STATUS.LOADED && info) {

            return (info.map(([category, defs]) => (
              <div key={category} className='margin-left-15 margin-top-30'>
                <h3 className={styles.category}>{category}</h3>
                <div>
                  {defs.map((def, index) => (
                    <div key={index} className={styles.definition_group}>
                      <span className='float-left'>{index + 1}.</span>
                      <div className={styles.definition_text}>
                        <div className={styles.definition}>{def.definition}</div>
                        {def.examples && def.examples[0] && (
                          <div className={styles.example}>{def.examples[0]}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )));
          }

        })()}
      </div>
    );
  }

};

Definition.propTypes = {
  word: PropTypes.string.isRequired
};

export default Definition;
