import { BACKGROUND_COLOR, BUTTON_BACKGROUND_COLOR, DARK_GREEN_BACKGROUND } from './../common/SousChefColors'
import React, { Component } from 'react';
import { StyleSheet, Image, Text, View, ScrollView } from 'react-native';
import { RkButton } from 'react-native-ui-kitten';
import { createUser } from './../redux/actions/AuthenticationAction';
import { connect } from 'react-redux';
import SousChefTextInput from './../components/SousChefTextInput'

export class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userID) {
            this.props.navigation.navigate('Main');
        }
    }

    handleSignUp = () => {
        this.props.signUp(this.state.email, this.state.password);
    }

    render() {
        return (
            <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Image source={require('../assets/sousChefLogo.png')} style={[styles.logo]} resizeMode="contain" />
            </View>
            <View style={styles.emailPasswordContainer}>
                <SousChefTextInput
                    placeholder='example@email.com'
                    label={'Email:'}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <SousChefTextInput
                    placeholder='examplePassword'
                    label={'Password:'}
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
        userID: state.userInfo.userID,
        errorMessage: state.userInfo.errorMessage
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (email, password) => {
            dispatch(createUser(email, password))
        }
    }
}
    
export default connect(mapStateToProps, mapDispatchToProps)(SignUp)