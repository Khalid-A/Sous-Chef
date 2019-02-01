import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import {RkButton} from 'react-native-ui-kitten';
import firebase from 'react-native-firebase';
import { setName } from '../redux/actions/action';
import { connect } from 'react-redux';

class Welcome extends React.Component {
    static navigationOptions = {
        header: null,
        headerVisible: false,
    }
    constructor(props) {
        super(props);
        this.state = {};
    }

    onSetNamePressed = () => {
        // this.props.navigation.navigate("SignUp");
        this.props.setName("Tucker")
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
                    rkType="rounded large"
                    onPress={this.onSetNamePressed}
                >
                Set Name
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

const mapStateToProps = state => {
return {
        name: state.name
    }
}

const mapDispatchToProps = dispatch => {
return {
        setName: (name) => {
            dispatch(setName(name));
        }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Welcome)