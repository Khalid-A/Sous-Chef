import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';

import firebase from 'react-native-firebase';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async authenticate() {
    // TODO: You: Do firebase things
    const { user } = await firebase.auth().signInAnonymously();
    console.warn('User -> ', user.toJSON());

    await firebase.analytics().logEvent('foo', { bar: '123'});
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Image source={require('./assets/sousChefLogo.png')} style={[styles.logo]} resizeMode="contain" />
          <Text style={styles.welcome}>
            Welcome to {'\n'} Sous Chef
          </Text>
          <View style={styles.modules}>
            <Text style={styles.modulesHeader}>Press the button below to authenticate into Firebase</Text>
            <Button
              onPress={this.authenticate}
              title="Authenticate"
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
});
