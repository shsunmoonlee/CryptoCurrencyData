/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import {
  getFormValues,
} from 'redux-form'

const selectHighestState = (state) => state;
const selectGlobal = (state) => state.global;
const selectForm = (state) => state.form;

const makeGlobalState = () => createSelector(
  selectHighestState,
  (highestState) => highestState
);

const makeFormValue = () => createSelector(
  selectHighestState,
  (highestState) => getFormValues('wizard')(highestState)
);

const makeSelectAnswers = () => createSelector(
  selectGlobal,
  (globalState) => globalState.answers
);

const makeSelectQuestions = () => createSelector(
  selectGlobal,
  (globalState) => globalState.questions
);

const makeSelectCurrentUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.currentUser
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.loading
);

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.error
);

const makeSelectRepos = () => createSelector(
  selectGlobal,
  (globalState) => globalState.userData.repositories
);

export {
  makeGlobalState,
  selectGlobal,
  makeFormValue,
  makeSelectAnswers,
  makeSelectQuestions,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
};
