import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AppRegistry, TextInput } from 'react-native';
import { Dimensions } from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { setIngredientsToRemove } from '../redux/actions/PantryAction';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors';
import StarRating from 'react-native-star-rating';
import { addRatingForRecipe } from '../redux/actions/RecipeAction';

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
    this.state = {
      ingredients: this.getIngredientsToRemove(),
      rating: null,
    };
    this.listIngredients = this.listIngredients.bind(this);
  }

  getIngredientsToRemove = () => {
    const pantryTitle = this.props.pantry.map((item) => {
      return item.title;
    });

    const ingredients = this.props.navigation.getParam("ingredientsToRemove", null);
    const filtered = ingredients.filter((item) => {
      if(pantryTitle.includes(item.ingredient)){
        return true;
      }
      return false;
    });

    return filtered;
  }

  removeItem(ingredientIndex){
    var newIngredients = [...this.state.ingredients];
    newIngredients.splice(ingredientIndex, 1);
    this.setState({
      ingredients: newIngredients
    });
  }

  updatePantry(){
    const ingredients = this.state.ingredients.reduce(function(map, item) {
        map[item.ingredient] = item;
        return map;
    }, {});
    this.props.setIngredientsToRemove(this.state.ingredients);
    if (this.state.rating !== null) {
      addRatingForRecipe(this.props.navigation.getParam("recipeID"), parseFloat(this.state.rating), this.props.userID);
    }
    this.props.navigation.navigate('Pantry', {
      ingredientsToRemove: this.state.ingredients
    });
  }

  listIngredients(){
    if(this.state.ingredients == null){
      console.warn("null");
    }
    return this.state.ingredients.map((ingredient, index) => {
      if(!ingredient.ingredient){
        return null;
      }

      return (
        <View style={{flexDirection: 'row',}}>
          <Text style={styles.detail}>{ingredient.ingredient}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.removeItem(index)}
            >
            <Text> Delete Item </Text>
          </TouchableOpacity>
        </View>
      );
    });
  }

  addRating(rating) {
    this.setState({
      rating: rating
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={this.state.rating}
            selectedStar={(rating) => {
              this.addRating(rating);
            }}
          />
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: BUTTON_BACKGROUND_COLOR,
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
    // pantry: state.pantry,
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
    userID: state.userInfo.userID
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
