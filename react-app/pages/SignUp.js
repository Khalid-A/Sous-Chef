import { BACKGROUND_COLOR, BUTTON_BACKGROUND_COLOR, DARK_GREEN_BACKGROUND} from './../common/SousChefColors'
import React, { Component } from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import { RkTextInput, RkButton } from 'react-native-ui-kitten';
import { signUpUser } from '../redux/actions/action';
import { connect } from 'react-redux';

export class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userId) {
            // TODO: set naviagtion to Discover
            this.props.navigation.navigate('Welcome');
        }
    }

    handleSignUp = () => {
        this.props.signUpUser(this.state.email, this.state.password);
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
                <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
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
  
const mapStateToProps = (state) => {
    return {
        userId: state.loginUser.userId,
        errorMessage: state.loginUser.errorMessage
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        signUpUser: (email, password) => {
            dispatch(signUpUser(email, password))
        }
    }
}
    
export default connect(mapStateToProps, mapDispatchToProps)(SignUp)