import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import request from 'services/request';

// @NOTE: this reducer follows the duck pattern...
// https://github.com/erikras/ducks-modular-redux

// Actions

const namespace = 'dictionary/search';

export const LOADING = `${namespace}/LOADING`;
export const SET_SEARCH = `${namespace}/SET_SEARCH`;
export const CLEAR_SEARCH = `${namespace}/CLEAR_SEARCH`;
export const SEARCH_RESULTS = `${namespace}/SEARCH_RESULTS`;
export const MORE_SEARCH_RESULTS = `${namespace}/MORE_SEARCH_RESULTS`;

// Initial State

const initialState = {
  loading: false,
  search: '',
  results: null,
  total: 0,
  limit: 50,
  offset: 0
};


// Selectors

export const isLoading = (state) => state.search.loading;
export const getSearch = (state) => state.search.search;
export const getResults = (state) => state.search.results;
export const getTotal = (state) => state.search.total;
export const getLimit = (state) => state.search.limit;
export const getOffset = (state) => state.search.offset;
export const hasMore = (state) => (
  state.search.total > (state.search.offset + state.search.limit)
);

// Action Creators

export const setSearch = (search) => ({
  type: SET_SEARCH,
  search
});

export const fetchSearchResults = () => (dispatch, getState) => {
  const state = getState();
  const search = getSearch(state);
  dispatch({ type: LOADING });
  request({
    url: '/search',
    query: { q: search }
  })
  .then(response => {
    dispatch({
      type: SEARCH_RESULTS,
      results: response.body.results,
      metadata: response.body.metadata
    });
  });
};

export const fetchMoreSearchResults = () => (dispatch, getState) => {
  const state = getState();
  const search = getSearch(state);
  const limit = getLimit(state);
  const offset = getOffset(state);
  dispatch({ type: LOADING });
  request({
    url: '/search',
    query: {
      q: search,
      offset: offset + limit,
      limit: limit
    }
  })
  .then(response => {
    dispatch({
      type: SEARCH_RESULTS,
      results: response.body.results,
      metadata: response.body.metadata
    });
  });
};

export default handleActions({
  [LOADING]: (state, action) => ({
    ...state,
    loading: true
  }),
  [SET_SEARCH]: (state, action) => (
    (action.search.length === 0)
      ? ({ ...initialState })
      : ({ ...state, search: action.search })
  ),
  [CLEAR_SEARCH]: (state, action) => ({
    ...initialState
  }),
  [SEARCH_RESULTS]: (state, action) => ({
    ...state,
    loading: false,
    results: action.results,
    total: action.metadata.total,
    limit: action.metadata.limit,
    offset: action.metadata.offset
  }),
  [MORE_SEARCH_RESULTS]: (state, action) => ({
    ...state,
    loading: false,
    results: state.results.concat(action.results),
    total: action.metadata.total,
    limit: action.metadata.limit,
    offset: action.metadata.offset
  })
}, initialState);
