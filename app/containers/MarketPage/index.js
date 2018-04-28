/*
 * MarketPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Row, Col, Button } from 'antd';
import { makeGlobalState, makeFormValue, makeSelectAnswers, makeSelectQuestions, makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import H2 from 'components/H2';
import MarketTable from 'components/MarketTable';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { finalSubmitForm, loadRepos, saveUserAnswers } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

import showResults from './showResults'

export class MarketPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {

  }

  render() {

    return (
      <div>
        <article>
          <Helmet>
            <title>Home Page</title>
            <meta name="description" content="A React.js Boilerplate application MarketPage" />
          </Helmet>
        </article>
        <MarketTable />
      </div>
    );
  }
}

MarketPage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  repos: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    finalSubmitForm: () => dispatch(finalSubmitForm()),
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
    saveUserAnswers: (answers) => dispatch(saveUserAnswers(answers)),
  };
}

const mapStateToProps = createStructuredSelector({
  globalState: makeGlobalState(),
  formValue: makeFormValue(),
  answers: makeSelectAnswers(),
  questions: makeSelectQuestions(),
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});
const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'market', reducer });
const withSaga = injectSaga({ key: 'market', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(MarketPage);
