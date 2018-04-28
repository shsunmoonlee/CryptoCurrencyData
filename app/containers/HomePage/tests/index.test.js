/**
 * Test the HomePage
 */

import React from 'react';
import { shallow, render } from 'enzyme';
// import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import {store} from 'containers/app'

import WizardForm from 'components/WizardForm';
import { HomePage, mapDispatchToProps } from '../index';
import { Row, Col, Button } from 'antd';

describe('<HomePage />', () => {

  // Before each test reset the item data for safety
  beforeEach(() => {
  });

  it('should render two Rows and one WizardForm', () => {
    const renderedComponent = shallow(
      <HomePage />
    );
    expect(renderedComponent.find(Row).length).toBe(2);
    expect(renderedComponent.find(WizardForm).length).toBe(1);

  });
  describe('mapDispatchToProps', () => {
    describe('onChangeUsername', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onChangeUsername).toBeDefined();
      });

      it('should dispatch changeUsername when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const username = 'mxstbr';
        result.onChangeUsername({ target: { value: username } });
        expect(dispatch).toHaveBeenCalledWith(changeUsername(username));
      });
    });

    describe('onSubmitForm', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onSubmitForm).toBeDefined();
      });

      it('should dispatch loadRepos when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        result.onSubmitForm();
        expect(dispatch).toHaveBeenCalledWith(loadRepos());
      });

      it('should preventDefault if called with event', () => {
        const preventDefault = jest.fn();
        const result = mapDispatchToProps(() => {});
        const evt = { preventDefault };
        result.onSubmitForm(evt);
        expect(preventDefault).toHaveBeenCalledWith();
      });
    });
  });
});
