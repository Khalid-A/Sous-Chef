import React from 'react';
import Welcome from './pages/Welcome'
import SignUp from './pages/SignUp'
import DiscoverRecipes from './pages/DiscoverRecipes'
import Pantry from './pages/Pantry';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Provider } from 'react-redux';
import store from './redux/store';

const AppNavigator = createAppContainer(createStackNavigator(
  {
    Welcome: Welcome,
    SignUp: SignUp,
    DiscoverRecipes: DiscoverRecipes,
    Pantry: Pantry
  },
  {
    initialRouteName: "Pantry"
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
