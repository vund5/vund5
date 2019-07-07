import React from "react";
import Setup from "./src/boot/setup";
import { Provider } from 'react-redux';
import store from './redux';

import {translate } from 'react-i18next';
import i18n from './src/I18n/index';

const WrappedStack = ({t}) => {
  return <Setup screenProps={{ t }} />;
};
const ReloadAppOnLanguageChange = translate('common', {
  bindI18n: 'languageChanged',
  bindStore: false,
})(WrappedStack);

// The entry point using a react navigation stack navigation
// gets wrapped by the I18nextProvider enabling using translations
// https://github.com/i18next/react-i18next#i18nextprovider

export default class App extends React.Component {
  render() {
  return (
    <Provider store={store}>
      <ReloadAppOnLanguageChange />
    </Provider>
  );
  }
}
