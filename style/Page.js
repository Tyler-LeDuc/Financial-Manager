import React from 'react';
import { AppContext } from '../App/AppProvider';

// extract page from props, check if page is name passed in at component level. children props are nested components
export default function({ name, children }) {
  return (
    <AppContext.Consumer>
      {({ page }) => {
        if (page !== name) {
          return null;
        }
        return <div> {children}</div>;
      }}
    </AppContext.Consumer>
  );
}
