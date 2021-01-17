import React from 'react';
import _ from 'lodash';
import { CoinSymbol } from '../Settings/CoinHeaderGrid';
import moment from 'moment';

const cryptocompare = require('cryptocompare');

export const AppContext = React.createContext();

const MAX_FAVOURITES = 10;
const TIME_UNITS = 10;

export class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'dashboard',
      favourites: ['BTC', 'ETH', 'XMR', 'DOGE'],
      timeInterval: 'months',
      ...this.savedSettings(),
      setPage: this.setPage,
      addCoin: this.addCoin,
      removeCoin: this.removeCoin,
      isInFavourites: this.isInFavourites,
      setFilteredCoins: this.setFilteredCoins,
      setCurrentFavourite: this.setCurrentFavourite,
      confirmFavourites: this.confirmFavourites,
      changeChartSelect: this.changeChartSelect
    };
  }

  // adds coin to favourites
  addCoin = key => {
    let favourites = [...this.state.favourites];
    if (favourites.length < MAX_FAVOURITES) {
      favourites.push(key);
      this.setState({ favourites });
    }
  };

  // remove coin from favourites
  removeCoin = key => {
    let favourites = [...this.state.favourites];
    // _.pull is lodash command to pull a value out of the array and then return new array with value removed
    this.setState({ favourites: _.pull(favourites, key) });
  };

  // check if value is already in favourites
  isInFavourites = key => _.includes(this.state.favourites, key);

  // want coin api to load on mount
  componentDidMount = () => {
    this.fetchCoins();
    this.fetchPrices();
    this.fetchHistorical();
  };

  // fetch prices for dashboard
  fetchPrices = async () => {
    // if user is visiting first time we don't have coin prices to fetch yet
    if (this.state.firstVisit) {
      return;
    }
    let prices = await this.prices();
    this.setState({ prices });
  };

  // fetch data for high chart
  fetchHistorical = async () => {
    if (this.state.firstVisit) {
      return;
    }
    let results = await this.historical();
    let historical = [
      {
        name: this.state.currentFavourite,
        data: results.map((ticker, index) => [
          moment()
            .subtract({ [this.state.timeInterval]: TIME_UNITS - index })
            .valueOf(),
          ticker.USD
        ])
      }
    ];
    this.setState({ historical });
  };

  historical = () => {
    let promises = [];
    for (let units = TIME_UNITS; units > 0; units--) {
      promises.push(
        cryptocompare.priceHistorical(
          this.state.currentFavourite,
          ['USD'],
          moment()
            .subtract({ [this.state.timeInterval]: units })
            .toDate()
        )
      );
    }
    return Promise.all(promises);
  };

  // prices function for fetchPrices function
  prices = async () => {
    let returnData = [];
    for (let i = 0; i < this.state.favourites.length; i++) {
      try {
        let priceData = await cryptocompare.priceFull(
          this.state.favourites[i],
          'USD'
        );
        returnData.push(priceData);
      } catch (e) {
        console.warn('Fetch Price error: ', e);
      }
    }
    return returnData;
  };

  // fetches coin data from crypto compare api
  fetchCoins = async () => {
    let coinList = (await cryptocompare.coinList()).Data;
    this.setState({ coinList });
  };

  // confirming favourites redirects to dashboard
  confirmFavourites = () => {
    let currentFavourite = this.state.favourites[0];
    this.setState(
      {
        firstVisit: false,
        page: 'dashboard',
        currentFavourite,
        prices: null,
        historical: null
      },
      () => {
        this.fetchPrices();
        this.fetchHistorical();
      }
    );
    localStorage.setItem(
      'cryptoDashboard',
      JSON.stringify({
        favourites: this.state.favourites,
        currentFavourite
      })
    );
  };

  // sets favourite coin on dashboard
  setCurrentFavourite = coinSymbol => {
    this.setState(
      {
        currentFavourite: coinSymbol,
        historical: null
      },
      this.fetchHistorical
    );
    localStorage.setItem(
      'cryptoDashboard',
      JSON.stringify({
        ...JSON.parse(localStorage.getItem('cryptoDashboard')),
        currentFavourite: coinSymbol
      })
    );
  };

  // Check if user has used site before by looking at ls
  savedSettings() {
    let cryptoDashboardData = JSON.parse(
      localStorage.getItem('cryptoDashboard')
    );
    // if we have not visited site before
    if (!cryptoDashboardData) {
      return { page: 'settings', firstVisit: true };
    }

    let { favourites, currentFavourite } = cryptoDashboardData;
    return { favourites, currentFavourite };
  }

  setPage = page => this.setState({ page });

  // filter coins with search bar
  setFilteredCoins = filteredCoins => this.setState({ filteredCoins });

  // changes whether to display days/weeks/months on chart of dashboard
  changeChartSelect = value => {
    console.log(value);
    this.setState(
      { timeInterval: value, historical: null },
      this.fetchHistorical
    );
  };

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
