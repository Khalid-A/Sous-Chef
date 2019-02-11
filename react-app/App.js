import React from 'react';
import Welcome from './pages/Welcome'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import DiscoverRecipes from './pages/DiscoverRecipes'
import Pantry from './pages/Pantry';
import { createStackNavigator, createDrawerNavigator, NavigationActions, createAppContainer } from "react-navigation";
import { Provider } from 'react-redux';
import {YellowBox, View, TouchableOpacity, Button} from 'react-native';
import store from './redux/store';
import Icon from 'react-native-vector-icons/Ionicons';
import { DARK_GREEN_BACKGROUND } from './common/SousChefColors';

YellowBox.ignoreWarnings(['ListView is deprecated']);

const AppNavigator = createAppContainer(createStackNavigator({
    Welcome: Welcome,
    SignUp: SignUp,
    Login: Login,
    Main: {
        screen: createDrawerNavigator(
        {
            DiscoverRecipes: {
                screen: createStackNavigator(
                    {
                        DiscoverRecipes:{
                            screen: DiscoverRecipes,
                            navigationOptions: ({ navigation }) => ({
                                headerLeft: (
                                    <View>
                                        <TouchableOpacity 
                                            onPress={() => {navigation.openDrawer()}} 
                                        >
                                            <Icon 
                                                name="md-menu" 
                                                style={{
                                                    color: 'white', 
                                                    padding: 10, 
                                                    marginLeft:10, 
                                                    fontSize: 20
                                                }}/>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                    }, 
                    {
                        initialRouteName: "DiscoverRecipes"
                    }
                ),
                navigationOptions: {
                    drawerLabel: "Discover"
                },
            },
            Pantry: createStackNavigator(
                {
                    Pantry:{
                        screen: Pantry,
                        navigationOptions: ({ navigation }) => ({
                            headerLeft: (
                                <View>
                                    <TouchableOpacity 
                                        onPress={() => {navigation.openDrawer()}} 
                                    >
                                        <Icon 
                                            name="md-menu" 
                                            style={{
                                                color: 'white', 
                                                padding: 10, 
                                                marginLeft:10, 
                                                fontSize: 20
                                            }}/>
                                    </TouchableOpacity>
                                </View>
                            ),
                            drawerLabel: "Pantry"
                        })
                    }
                }, 
                {
                    initialRouteName: "Pantry"
                }
            )
        },
        {
            initialRouteName: "DiscoverRecipes",
            drawerBackgroundColor: DARK_GREEN_BACKGROUND,
            contentOptions: {
                activeTintColor: "lightgrey",
                inactiveTintColor: "white"
            }
        }
        ),
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    }
},
{
    initialRouteName: "Welcome",
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
