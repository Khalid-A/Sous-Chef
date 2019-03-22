import React from 'react';
import { StyleSheet, Image, Text, View, Dimensions, TouchableOpacity, SafeAreaView, StatusBar, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { loginExistingUser } from './../redux/actions/AuthenticationAction';
import { BUTTON_BACKGROUND_COLOR } from '../common/SousChefColors';
import { DEFAULT_FONT } from '../common/SousChefTheme';
import globalStyle from '../common/SousChefTheme';

class Welcome extends React.Component {
    static navigationOptions = {
        header: null,
        headerVisible: false,
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
            <View style={styles.container}>
                <LinearGradient colors={['#1d945b', '#17ba6b', '#ffc100',]} style={globalStyle.linearGradient} locations={[0.4,0.65,1]}>
                    <Image source={require('../assets/sousChefWhite.png')} style={[styles.logo]} resizeMode="contain" />
                    <Text style={styles.welcome}>Welcome to Sous Chef</Text>

                    <TouchableOpacity style ={globalStyle.gradientButton} onPress={this.onLoginPressed}>
                        <Text style ={globalStyle.gradientButtonText}>LOGIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style = {globalStyle.gradientButton} onPress={this.onSignUpPressed}>
                        <Text style ={globalStyle.gradientButtonText}>SIGN UP</Text>
                    </TouchableOpacity>

                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    logo: {
        marginTop: Dimensions.get('window').height/4,
        height: 60,
        width: 160,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 70,
        color: "white",
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
        userInfo: () => {
            dispatch(loginExistingUser())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
