import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RkButton } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { loginExistingUser } from './../redux/actions/AuthenticationAction';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors';

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
            <View style={styles.container}>
                <LinearGradient colors={['#1d945b', '#17ba6b', '#ffc100',]} style={styles.linearGradient} locations={[0.4,0.65,1]}>

                <Image source={require('../assets/sousChefWhite.png')} style={[styles.logo]} resizeMode="contain" />
                <Text style={styles.welcome}>Welcome to Sous Chef</Text>

                  <TouchableOpacity style = {styles.button} onPress={this.onLoginPressed}>
                    <Text style ={styles.buttonText}>LOGIN</Text>
                  </TouchableOpacity>



                <TouchableOpacity style = {styles.button}
                    onPress={this.onSignUpPressed}
                ><Text style ={styles.buttonText}>SIGN UP</Text></TouchableOpacity>


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
    linearGradient: {
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Avenir',
    textAlign: 'center',
    // margin: 10,
    color: BUTTON_BACKGROUND_COLOR,
    backgroundColor:'transparent',
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    width: 250,
    borderRadius:30,
    margin: 10,
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
