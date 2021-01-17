import React from 'react';
import styled from 'styled-components';
import { backgroundColor2, fontSize2 } from '../Shared/Styles';
import { AppContext } from '../App/AppProvider';
import _ from 'lodash';
import fuzzy from 'fuzzy';

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
`;

const SearchInput = styled.input`
  ${backgroundColor2}
  ${fontSize2}
  color: #1163c9;
  border: 1px solid;
  height: 25px;
  place-self: center left;
`;

// debounce is a lodash function that stops too many events firing off at once, telling it to wait 500ms before applying filter
const handleFilter = _.debounce((inputValue, coinList, setFilteredCoins) => {
  // Get all coin symbols
  let coinSymbols = Object.keys(coinList);
  // Get all the coin names, map symbol to name
  let coinNames = coinSymbols.map(sym => coinList[sym].CoinName);
  // Get all the coins and concat the name
  let allStringToSearch = coinSymbols.concat(coinNames);
  // fuzzy is used to do fuzzy search. It returns an object so needs to be converted to string
  let fuzzyResults = fuzzy
    .filter(inputValue, allStringToSearch, {})
    .map(result => result.string);
  // _.pickBy picks from the object a list of keys based on a callback function
  let filteredCoins = _.pickBy(coinList, (result, symbolKey) => {
    let coinName = result.CoinName;
    return (
      _.includes(fuzzyResults, symbolKey) || _.includes(fuzzyResults, coinName)
    );
  });
  // set filtered coins to what we have filtered from above
  setFilteredCoins(filteredCoins);
}, 500);

function filterCoins(e, setFilteredCoins, coinList) {
  let inputValue = e.target.value;
  // to reset list back to null if the search is emptied
  if (!inputValue) {
    setFilteredCoins(null);
    return;
  }
  handleFilter(inputValue, coinList, setFilteredCoins);
}

export default function() {
  return (
    <AppContext.Consumer>
      {({ setFilteredCoins, coinList }) => (
        <SearchGrid>
          <h2>Search All Coins</h2>
          <SearchInput
            onKeyUp={e => filterCoins(e, setFilteredCoins, coinList)}
          />
        </SearchGrid>
      )}
    </AppContext.Consumer>
  );
}
