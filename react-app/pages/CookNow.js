import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import { AppRegistry, TextInput } from 'react-native';
import { Dimensions } from 'react-native'
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { beginRecipePreviewFetch } from '../redux/actions/RecipeAction';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors';
// import { setIngredientsToRemove } from '../redux/actions/action';

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
            // alignItems: 'left',
        },
    }
    // constructor(props) {
    //     super(props);
    //     this.state = { recipeID: "0063ec25-5e33-4a59-9a52-ecd090c3fcad"};
    //     // this.state = { recipeID: this.props.navigation.state.id };
    // }
    // componentDidMount() {
    //     beginRecipePreviewFetch().then((data) => {
    //       this.setState({
    //           image: data.images ? data.images.trim() : "",
    //           ingredients: data.ingredients,
    //           servings: data.servings,
    //           time: data.time,
    //           title: data.title
    //       });
    //       console.warn(data);
    //     });
    // }

    // componentDidMount() {
    //   var data;
    //
    //   if (this.state.recipeID) {
    //       data = beginRecipePreviewFetch(this.state.recipeID);
    //   }
    //   console.warn(data);
    //   if (data) {
    //       this.setState({
    //           image: data.images ? data.images.trim() : "",
    //           ingredients: data.ingredients,
    //           servings: data.servings,
    //           time: data.time,
    //           title: data.title
    //       });
    //   }
    // }



  constructor(props) {
    super(props);
    this.state = {
      recipe: this.props.recipe,
      ingredients: this.props.recipe.ingredients,
      directions: this.props.recipe.directions,

    };
    this.listIngredients = this.listIngredients.bind(this);
    this.listDirections = this.listDirections.bind(this);
  }

  finishCooking(){
    // this.props.navigation.navigate('Finished');
  }
  listDirections(){
    if(this.state.ingredients == null){
      console.warn("ingredients are null");
    }
    return this.state.directions.map((direction, index) => {
      if(!direction){
        return null;
      }
      return (
        <Text style={styles.detail}>{index+1}. {direction}</Text>
      );
    });
  }
  listIngredients(){
    if(this.state.ingredients == null){
      console.warn("null");
    }
    return Object.keys(this.state.ingredients).map((ingredientID) => {
      const ingredient = this.state.ingredients[ingredientID].ingredient;
      const quantity = this.state.ingredients[ingredientID].quantity;
      const unit = this.state.ingredients[ingredientID].unit;
      if(!ingredient){
        return null;
      }
      return (
        <Text style={styles.detail}>{quantity} {unit} {ingredient}</Text>
      );
    });
  }

  render() {
    return (
          <ScrollView>
          <View style={styles.container}>
          <Text style={styles.title}>{this.state.recipe.title}</Text>
          <Text style={{textAlign: 'left'}}>Serving Size: {this.state.recipe.servings}</Text>
          <Text style={styles.subtitle}>Ingredients</Text>
          {this.listIngredients()}
          <Text style={styles.subtitle}>CookTime: {this.state.recipe.time.hour} hours {this.state.recipe.time.minutes} minutes</Text>
          <Text style={styles.subtitle}>Directions</Text>
          {this.listDirections()}
          <Button style={{color: 'red', }} title="Finished!" onPress={this.finishCooking()}></Button>
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

const mapStateToProps = state => {
  return {
    // recipe: state.props.navigation.state.ingredients,
    recipe:{
      directions:
      ["Preheat oven to 350 degrees F (175 degrees C).",
      "Mix cake mix, margarine, eggs, and vanilla extract together in a bowl until well combined; fold in white chocolate chips. Form dough into balls using a cookie scoop and arrange on a baking sheet.",
      "Bake in the preheated oven until edges of cookies are lightly browned, about 12 minutes. Cool cookies on baking sheet 1 minute before transferring to a wire rack to cool."],
      ingredients:{
        ingredient1:{
          ingredient: "eggs",
          quantity: 2,
          unit: ""
        },
        ingredient2:{
          ingredient: "margarine",
          quantity: 1,
          unit: "cups"
        },
        ingredient3:{
          ingredient: "white chocolate",
          quantity: 1,
          unit: "packages"
        },
        ingredient4:{
          ingredient: "vanilla extract",
          quantity: 1,
          unit: "teaspoons"
        },
        ingredient5:{
          ingredient: "butter pecan cake mix",
          quantity: 1,
          unit: "packages"
        },
      },
      servings: 36,
      time:{
        hour: 0,
        minutes: 37,
      },
      title: "Poor Man's Macadamia Nut Cookies",
    },
    // TESTIngredients: state.cookNow.ingredientsToRemove,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // setIngredientsToRemove: (ingredients) => {
      // dispatch(setIngredientsToRemove(ingredients));
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CookNow)
