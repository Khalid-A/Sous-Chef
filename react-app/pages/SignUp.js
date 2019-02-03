import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';

import firebase from 'react-native-firebase';
import { RkTextInput, RkButton } from 'react-native-ui-kitten';
import { setUserId } from '../redux/actions/action';
import { connect } from 'react-redux';
import { BACKGROUND_COLOR, BUTTON_BACKGROUND_COLOR, DARK_GREEN_BACKGROUND } from '../common/SousChefColors';

export class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            userId: '',
        };
    }

    handleSignUp = () => {
        firebase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((user) => {
                this.props.setUserId(firebase.auth().currentUser.uid);
                // TODO: set navigation to Discover
                this.props.navigation.navigate('Welcome'); 
            }).catch(error => this.setState({ errorMessage: error.message }));
    }

    render() {
        return (
            <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Image source={require('../assets/sousChefLogo.png')} style={[styles.logo]} resizeMode="contain" />
            </View>
            
            <View style={styles.emailPasswordContainer}>
                <RkTextInput 
                    rkType="clear"
                    placeholder = "example@email.com"
                    label={'Email:'}
                    labelStyle={styles.text}
                    style={styles.textInput}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <RkTextInput 
                    rkType="clear"
                    placeholder = "examplePassword"
                    label={'Password:'}
                    labelStyle={styles.text}
                    style={styles.textInput}
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
                <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
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
    emailPasswordContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: BACKGROUND_COLOR,
    },
    text: {
        borderLeftWidth: 50,
        fontSize: 15,
        color: '#333333',
    },
    textInput: {
        borderRightWidth: 50,
        borderColor: BACKGROUND_COLOR,
    },
    errorMessage: {
        color: DARK_GREEN_BACKGROUND,
        borderTopWidth: 20,
        borderLeftWidth: 20,
        borderRightWidth: 20,
        flexWrap: 'wrap',
    }
});
  
const mapDispatchToProps = dispatch => {
    return {
        setUserId: (userId) => {
            dispatch(setUserId(userId));
        }
    }
}
    
export default connect(null, mapDispatchToProps)(SignUp)