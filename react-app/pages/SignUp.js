import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';

import firebase from 'react-native-firebase';
import { RkTextInput, RkButton } from 'react-native-ui-kitten';
import { BACKGROUND_COLOR, BUTTON_BACKGROUND_COLOR } from '../common/SousChefColors';


export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: ''
        };
    }
    
    async authenticate() {
        // TODO: You: Do firebase things
        const { user } = await firebase.auth().signInAnonymously();
        console.warn('User -> ', user.toJSON());

        await firebase.analytics().logEvent('foo', { bar: '123'});
    }

    handleSignUp = () => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => this.props.navigation.navigate('Welcome'))
          .catch(error => this.setState({ errorMessage: error.message }));
        
        // TODO: deal with errors: already existing user, badly formatted email
    }

    render() {
        return (
            <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.welcome}>
                Welcome to SousChef
                </Text>
                {/* <View style={styles.modules}>
                    <Text style={styles.modulesHeader}>Press the button below to authenticate into Firebase</Text>
                    <Button
                        onPress={this.authenticate}
                        title="Authenticate"
                    />
                </View> */}
            </View>
            
            <View style={styles.emailPasswordContainer}>
                <RkTextInput 
                    rkType="clear"
                    placeholder = "example@email.com"
                    label={'Email:'}
                    labelStyle={styles.text}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <RkTextInput 
                    rkType="clear"
                    placeholder = "examplePassword"
                    style={styles.textInputBorder}
                    label={'Password:'}
                    labelStyle={styles.text}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
            </View>
            <View style={styles.container}>
                <RkButton
                    rkType="rounded"
                    style={{backgroundColor: BUTTON_BACKGROUND_COLOR}}
                    borderTopWidth={40}
                    onPress={this.handleSignUp}
                >
                Sign Up
                </RkButton>
            </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: BACKGROUND_COLOR
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR,
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
    modules: {
        margin: 20,
    },
    modulesHeader: {
        fontSize: 16,
        marginBottom: 8,
    },
    emailPasswordContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: BACKGROUND_COLOR,
    },
    text: {
        borderLeftWidth: 20,
        fontSize: 15,
        color: '#333333',
    },
    textInputBorder: {
        marginTop: 0,
        marginBottom: 0
    },
});
  