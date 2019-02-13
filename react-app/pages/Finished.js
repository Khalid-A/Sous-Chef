import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AppRegistry, TextInput } from 'react-native';
import { Dimensions } from 'react-native'
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { setIngredientsToRemove } from '../redux/actions/PantryAction';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors';

class Finished extends React.Component {
  static navigationOptions = {
    title: "Finished",
    headerVisible: true,
    headerTintColor: "white",
    headerLeft: null,
    headerStyle: {
      backgroundColor: BUTTON_BACKGROUND_COLOR,
    },
    headerTitleStyle: {
      fontFamily: "Avenir",
      fontSize: 30,
      textAlign: 'left',
    },
  }
  constructor(props) {
    super(props);
    const results = this.findIngredients();
    this.state = {
      ingredients:null,
    };
    this.listIngredients = this.listIngredients.bind(this);
    // this.intersect = this.intersect.bind(this);
  }

  componentWillMount(){
    const pantryTitle = this.props.pantry.map((item) => {
      return item.title;
    });

    const ingredients = this.props.navigation.getParam("ingredientsToRemove", null)
    const ingredientList = Object.keys(ingredients).map((item) => {
      return ingredients[item];
    });

    const filtered = ingredientList.filter((item) => {
      if(pantryTitle.includes(item.ingredient)){
        return true;
      }
      return false;
    });

    this.setState({
      ingredients: filtered,
    });

  }

  findIngredients() {
    const ingredientsFromRecipe = this.props.navigation.getParam("ingredientsToRemove", null);
    console.warn(ingredientsFromRecipe);
    // this.props.pantry;
    const ingredientsFromPantry =[
      {
        title:"vanilla",
        unit: "",
        amount:"",
      },
      {
        title:"eggs",
        unit: "",
        amount:"",
      },
      {
        title:"margarine",
        unit: "",
        amount:"",
      },
    ];
  }

  removeItem(ingredientID){
    const newIngredients = this.state.ingredients
    delete newIngredients[ingredientID];
    this.setState({
      ingredients: newIngredients,
    });
  }

  updatePantry(){
    //TODO: navigate to next page here
    this.props.setIngredientsToRemove(this.state.ingredients);
    // this.props.navigation.navigate('Pantry', {
    //   ingredientsToRemove: this.state.ingredients
    // });
  }
  listIngredients(){
    // TODO: add swiping on ingredients
    if(this.state.ingredients == null){
      console.warn("null");
    }
    return Object.keys(this.state.ingredients).map((ingredientID) => {
      const ingredient = this.state.ingredients[ingredientID].ingredient;
      if(!ingredient){
        return null;
      }

      return (
        <View style={{flexDirection: 'row',}}>
          <Text style={styles.detail}>{ingredient}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.removeItem(ingredientID)}
            >
            <Text> Delete Item </Text>
          </TouchableOpacity>
        </View>
      );
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          {this.listIngredients()}
          <TouchableOpacity
            style={styles.buttonBig}
            onPress={() => this.updatePantry()}
            >
            <Text>Update Pantry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

// const mapStateToProps = state => {
//     return {
//         pantry: state.pantry,
//         userID: state.userInfo.userID
//     }
// }

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
  detail:{
    fontSize: 15,
    fontFamily: "Avenir",

  },
  title: {
    fontSize: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: BUTTON_BACKGROUND_COLOR,
    padding: 3,
    width: 120,
    borderRadius:5,
    margin: 5,
  },
  buttonBig: {
    alignItems: 'center',
    backgroundColor: BUTTON_BACKGROUND_COLOR,
    padding: 10,
    width: 200,
    borderRadius:5,
    margin: 5,
  },
});

const mapStateToProps = state => {
  return {
    pantry: [
      {
        title:"vanilla",
        unit: "",
        amount:"",
      },
      {
        title:"eggs",
        unit: "",
        amount:"",
      },
      {
        title:"margarine",
        unit: "",
        amount:"",
      },
    ],
    // pantry: state.pantry,
    // userID: state.userInfo.userID
  }
}

const mapDispatchToProps = dispatch => {
  return {

    setIngredientsToRemove: (ingredients) => {
      dispatch(setIngredientsToRemove(ingredients));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Finished)
