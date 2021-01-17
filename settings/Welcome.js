import React, { Component } from 'react';
import { AppContext } from '../App/AppProvider';

export default class Welcome extends Component {
  render() {
    return (
      <AppContext.Consumer>
        {({ firstVisit }) =>
          firstVisit ? (
            <div>
              <h1>Welcome, Please Select Your Favourite Coins to Begin. </h1>
            </div>
          ) : null
        }
      </AppContext.Consumer>
    );
  }
}
