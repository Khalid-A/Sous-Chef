import { BACKGROUND_COLOR, BUTTON_BACKGROUND_COLOR, DARK_GREEN_BACKGROUND } from '../common/SousChefColors'
import React, { Component } from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, Dimensions, SafeAreaView, StatusBar,} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { loginUser } from './../redux/actions/AuthenticationAction';
import { connect } from 'react-redux';
import { DEFAULT_FONT } from './../common/SousChefTheme';
import SousChefTextInput from './../components/SousChefTextInput'
import globalStyle from '../common/SousChefTheme';

export class Login extends Component {
    static navigationOptions = {
        headerTransparent:false,
        headerBackground:(
            <LinearGradient colors={['#17ba6b','#1d945b']} locations={[0.3,1]} style={{height:90}}>
                <SafeAreaView style={{flex:1 }}>
                    <StatusBar barStyle="light-content"/>
                </SafeAreaView>
            </LinearGradient>
        ),

    }

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

    handleLogin = () => {
        this.props.login(this.state.email, this.state.password);
    }

    render() {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#1d945b', '#17ba6b', '#ffc100',]} style={globalStyle.linearGradient} locations={[0.4,0.65,1]}>
                    <Image source={require('../assets/sousChefWhite.png')} style={[styles.logo]} resizeMode="contain" />

                    <SousChefTextInput
                        placeholder='example@email.com'
                        label={'Email:'}
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                        />
                    <View
                        style={{
                            borderBottomColor: 'white',
                            borderBottomWidth: 1,
                        }}
                        />

                    <SousChefTextInput
                        placeholder='examplePassword'
                        label={'Password:'}
                        onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                        />
                    <View
                        style={{
                            borderBottomColor: 'white',
                            borderBottomWidth: 1,
                        }}
                        />

                    <TouchableOpacity
                        style = {globalStyle.gradientButton}
                        onPress={this.handleLogin}
                        >
                        <Text style ={globalStyle.gradientButtonText}>
                            LOGIN
                        </Text>
                    </TouchableOpacity>

                    <Text style={globalStyle.errorMessage}>{this.props.errorMessage}</Text>
                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    logo: {
        marginTop: Dimensions.get('window').height/5,
        height: 60,
        width: 160,
    },
});

const mapStateToProps = (state) => {
    return {
        userID: state.userInfo.userID,
        errorMessage: state.userInfo.errorMessage
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (email, password) => {
            dispatch(loginUser(email, password))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
