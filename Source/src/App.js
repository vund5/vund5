import React from "react";
import { Root } from "native-base";
import { createStackNavigator, createDrawerNavigator } from "react-navigation";

import home from "./screens/home/";
import login from "./screens/login/";
import forgotPassword from "./screens/forgotPassword/";
import register from "./screens/register/";
import accountManager from "./screens/accountManager/";
import changePassword from "./screens/changePassword/";
import userProfile from "./screens/userProfile/";
import setting from "./screens/setting/";
import changeLanguage from "./screens/changeLanguage/";
import LocationDirections from "./screens/locationDirections/";
import SideBar from "./screens/sidebar/index";

const Drawer = createDrawerNavigator(
  {
    home: { screen: home },
    login: { screen: login },
    forgotPassword: { screen: forgotPassword },
    register: { screen: register },
    accountManager: { screen: accountManager },
    changePassword: { screen: changePassword },
    userProfile: { screen: userProfile },
    setting: { screen: setting },
    changeLanguage: { screen: changeLanguage },
  },
  {
    initialRouteName: "home",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = createStackNavigator(
  {
    home: { screen: home },
    LocationDirections: { screen: LocationDirections },
    Drawer: { screen: Drawer },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <AppNavigator />
  </Root>;
