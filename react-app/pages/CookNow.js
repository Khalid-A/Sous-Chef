import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import { AppRegistry, TextInput } from 'react-native';
import { Dimensions } from 'react-native'
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { beginRecipePreviewFetch } from '../redux/actions/RecipeAction';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors';
import { setIngredientsToRemove } from '../redux/actions/PantryAction';

const recipesRef = firebase.firestore().collection('test_recipes');

class CookNow extends React.Component {
  static navigationOptions = {
        title: "Cook Now",
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
    this.state = {
      recipe: null,
      recipeID: this.props.navigation.getParam("recipeID"),
    };
    this.listIngredients = this.listIngredients.bind(this);
    this.listDirections = this.listDirections.bind(this);
    this.finishCooking = this.finishCooking.bind(this);
  }

  componentWillMount(){
    recipesRef.doc(this.state.recipeID).get().then((doc) => {
     this.setState({recipe: doc.data()});
    })
    .catch(function(error) {
        console.warn("Error getting documents: ", error);
    });
  }

  finishCooking(){
    this.props.navigation.navigate('Finished', {
      ingredientsToRemove: this.state.recipe.ingredients
    });
  }

  listDirections(){
    if(this.state.recipe.ingredients == null){
      console.warn("ingredients are null");
    }
    return this.state.recipe.directions.map((direction, index) => {
      if(!direction){
        return null;
      }
      return (
        <Text style={styles.detail}>{index+1}. {direction}</Text>
      );
    });
  }

  listIngredients(){
    if(this.state.recipe.ingredients == null){
      console.warn("null");
    }
    return Object.keys(this.state.recipe.ingredients).map((ingredientID) => {
      const text = this.state.recipe.ingredients[ingredientID].originalText;
      const quantity = this.state.recipe.ingredients[ingredientID].originalQuantity;
      // const unit = this.state.recipe.ingredients[ingredientID].unit;
      if(!ingredient){
        return null;
      }
      return (
        <Text style={styles.detail}>{quantity} {text}</Text>
      );
    });
  }

  render() {
    if(this.state.recipe){
      return (
            <ScrollView>
            <View style={styles.container}>
            <Text style={styles.title}>{this.state.recipe.title}</Text>
            <Text style={{textAlign: 'left'}}>Serving Size: {this.state.recipe.servings}</Text>
            <Text style={styles.subtitle}>Ingredients</Text>
            {this.listIngredients()}
            <Text style={styles.subtitle}>CookTime: {this.state.recipe.time.hour} hours {this.state.recipe.time.minute} minutes</Text>
            <Text style={styles.subtitle}>Directions</Text>
            {this.listDirections()}
            <Button style={{color: 'red', }} title="Finished!" onPress={this.finishCooking}></Button>
            </View>
            </ScrollView>
      );
    }
    return null;
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    padding:10,
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
    fontFamily: "Avenir",

  },
  subtitle: {
    fontSize: 17,
  },
});
export default connect(null,  null)(CookNow)
