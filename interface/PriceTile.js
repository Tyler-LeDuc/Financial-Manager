import React from 'react';
import styled, { css } from 'styled-components';
import { SelectableTile } from '../Shared/Tile';
import { fontSize3, fontSizeBig, greenBoxShadow } from '../Shared/Styles';
import { CoinHeaderGridStyled } from '../Settings/CoinHeaderGrid';
import { AppContext } from '../App/AppProvider';

// justify content to right
const JustifyRight = styled.div`
  justify-self: right;
`;

// justify content to left
const JustifyLeft = styled.div`
  justify-self: left;
`;

// displays the price of the coin
const TickerPrice = styled.div`
  ${fontSizeBig};
`;

// percent is displayed red if price change is negative, green otherwise
const ChangePct = styled.div`
  color: green;
  ${props =>
    props.red &&
    css`
      color: red;
    `}
`;

// returns number with 7 significant figs.
const numberFormat = number => {
  return +(number + '').slice(0, 7);
};

// component for display the percentage price change
function ChangePercent({ data }) {
  return (
    <JustifyRight>
      <ChangePct red={data.CHANGEPCT24HOUR < 0}>
        {numberFormat(data.CHANGEPCT24HOUR)} %
      </ChangePct>
    </JustifyRight>
  );
}

// style to compact second row of coins on dashboard
const PriceTileStyled = styled(SelectableTile)`
  ${props =>
    props.compact &&
    css`
      display: grid;
      ${fontSize3}
      grid-gap: 5px;
      grid-template-columns: repeat(3, 1fr);
    `}

  ${props =>
    props.currentFavourite &&
    css`
      ${greenBoxShadow}
      pointer-events: none;
    `}
`;

function PriceTile({
  coinSymbol,
  data,
  currentFavourite,
  setCurrentFavourite
}) {
  return (
    <PriceTileStyled
      onClick={setCurrentFavourite}
      currentFavourite={currentFavourite}
    >
      <CoinHeaderGridStyled>
        <div> {coinSymbol} </div>
        <ChangePercent data={data} />
      </CoinHeaderGridStyled>
      <TickerPrice>${numberFormat(data.PRICE)}</TickerPrice>
    </PriceTileStyled>
  );
}

function PriceTileCompact({
  coinSymbol,
  data,
  currentFavourite,
  setCurrentFavourite
}) {
  return (
    <PriceTileStyled
      onClick={setCurrentFavourite}
      compact
      currentFavourite={currentFavourite}
    >
      <JustifyLeft> {coinSymbol} </JustifyLeft>
      <ChangePercent data={data} />
      <JustifyRight>${numberFormat(data.PRICE)}</JustifyRight>
    </PriceTileStyled>
  );
}

export default function({ price, index }) {
  let coinSymbol = Object.keys(price)[0];
  let data = price[coinSymbol]['USD'];

  // we want to display the tiles differently depending what row it is on
  let TileClass = index < 5 ? PriceTile : PriceTileCompact;

  return (
    <AppContext.Consumer>
      {({ currentFavourite, setCurrentFavourite }) => (
        <TileClass
          coinSymbol={coinSymbol}
          data={data}
          currentFavourite={currentFavourite === coinSymbol}
          setCurrentFavourite={() => setCurrentFavourite(coinSymbol)}
        />
      )}
    </AppContext.Consumer>
  );
}
