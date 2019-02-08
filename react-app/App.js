import React from 'react';
import Welcome from './pages/Welcome'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import DiscoverRecipes from './pages/DiscoverRecipes'
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Provider } from 'react-redux'
import store from './redux/store'

const AppNavigator = createAppContainer(createStackNavigator(
  {
    Welcome: Welcome,
    SignUp: SignUp,
    Login: Login,
    DiscoverRecipes: DiscoverRecipes
  },
  {
    initialRouteName: "Welcome"
  }
));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator/>
      </Provider>
    );
  }
}
