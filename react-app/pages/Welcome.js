import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import { RkButton } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { loginExistingUser } from './../redux/actions/AuthenticationAction';

class Welcome extends React.Component {
    static navigationOptions = {
        header: null,
        headerVisible: false,
    }
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.userInfo();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userID) {
            this.props.navigation.navigate('Main');
        }
    }

    onSignUpPressed = () => {
        this.props.navigation.navigate("SignUp");
    }

    onLoginPressed = () => {
        this.props.navigation.navigate("Login");
    }

    render() {
        return (
            <ScrollView>
            <View style={styles.container}>
                <Image source={require('../assets/sousChefLogo.png')} style={[styles.logo]} resizeMode="contain" />
                <Text style={styles.welcome}>
                Welcome to {'\n'} Sous Chef
                </Text>
                <RkButton
                    rkType="rounded"
                    onPress={this.onLoginPressed}
                >
                Login
                </RkButton>

                <RkButton
                    rkType="rounded"
                    onPress={this.onSignUpPressed}
                >
                SignUp
                </RkButton>
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

const mapStateToProps = (state) => {
    return {
        userID: state.userInfo.userID,
        errorMessage: state.userInfo.errorMessage
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        userInfo: () => {
            dispatch(loginExistingUser())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
