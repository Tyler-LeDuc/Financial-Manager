import React from 'react';
import { Tile } from '../Shared/Tile';
import { AppContext } from '../App/AppProvider';
import CoinImage from '../Shared/CoinImage';
import styled from 'styled-components';

const SpotLightName = styled.h2`
  text-align: center;
`;

export default function() {
  return (
    <AppContext.Consumer>
      {({ currentFavourite, coinList }) => (
        <Tile>
          <SpotLightName> {coinList[currentFavourite].CoinName} </SpotLightName>
          <CoinImage spotlight coin={coinList[currentFavourite]} />
        </Tile>
      )}
    </AppContext.Consumer>
  );
}
