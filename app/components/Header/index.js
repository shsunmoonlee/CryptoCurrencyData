import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
// import Banner from './simplesurance.jpg';
import messages from './messages';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div style={{textAlign: 'center', margin: '0 auto' }}>
        <A style={{fontSize: '35px'}} href="/">
          Crypto Coin Market Table, Liquid Chart
        </A>
        <NavBar>
          <HeaderLink to="/">
            <FormattedMessage {...messages.home} />
          </HeaderLink>
          <HeaderLink to="/liquidity">
            Liquidity
          </HeaderLink>
        </NavBar>
      </div>
    );
  }
}

export default Header;
