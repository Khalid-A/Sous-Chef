import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import {RkButton} from 'react-native-ui-kitten';
import firebase from 'react-native-firebase';
import { setName } from '../redux/actions/action';
import { connect } from 'react-redux';

class CookNow extends React.Component {
    static navigationOptions = {
        header: null,
        headerVisible: false,
    }
    constructor(props) {
        super(props);
        this.state = {};
    }

    listIngredients(){
    return this.props.ingredients.map((ingredient) => {
      return <Text>{ingredient.ingredient}</Text>
    });
  }

    render() {
        return (
            <ScrollView>
            <View style={styles.container}>
                {this.listSteps()}
            </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
        paddingTop: 40,
        paddingLeft: 10,
        paddingBottom: 10,
        paddingRight: 10,
    },
    input: {
      height: 30,
      width: Dimensions.get('window').width - 20,
      borderColor: 'gray',
      borderWidth: 1,
    },
    multilineInput: {
      height: 60,
      width: Dimensions.get('window').width - 20,
      borderColor: 'gray',
      borderWidth: 1,
    },
    title: {
        fontSize: 20,
    },
});

const mapStateToProps = state => {
return {
        recipe: state.recipe
    }
}

const mapDispatchToProps = dispatch => {
// return {
//         setName: (name) => {
//             dispatch(setName(name));
//         }
//     }
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
