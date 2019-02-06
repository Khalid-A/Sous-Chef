import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import { AppRegistry, TextInput } from 'react-native';
import { Dimensions } from 'react-native'
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { setIngredientsToRemove } from '../redux/actions/action';

class CookNow extends React.Component {
    static navigationOptions = {
        header: null,
        headerVisible: false,
    }
    constructor(props) {
        super(props);
        this.state = {
          ingredients: this.props.recipe.ingredients,

        };
        this.listIngredients = this.listIngredients.bind(this);
    }
    removeItem(ingredientID){
      const newIngredients = this.state.ingredients
      delete newIngredients[ingredientID];
      this.setState({
        ingredients: newIngredients,
      });
    }

    updatePantry(){
      this.props.setIngredientsToRemove(this.state.ingredients);
      //TODO: navigate to next page here

    }
    listIngredients(){
      console.warn(this.state.ingredients);
      if(this.state.ingredients == null){
        console.warn("null");
      }
      return Object.keys(this.state.ingredients).map((ingredientID) => {
        const ingredient = this.state.ingredients[ingredientID].ingredient;
        if(!ingredient){
          return null;
        }
          return (
            <View>
            <Text>{ingredient}</Text>
            <Button onPress={() => this.removeItem(ingredientID)} title="Delete Item"></Button>
            </View>
          );
      });
  }

    render() {
        return (
            <ScrollView>
            <View style={styles.container}>
                {this.listIngredients()}
                <Button onPress={() => this.updatePantry()} title="Update Pantry"> </Button>
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
  console.warn('THE STORE, oooooo', state);
return {
        // recipe: state.recipe
        recipe:{
          ingredients:{
              ingredient1:{
                ingredient: "Avocado",
              },
              ingredient2:{
                ingredient: "Salt",
              },
              ingredient3:{
                ingredient: "Pepper",
              },
              ingredient5:{
                ingredient: "",
              },
              ingredient4:{
                ingredient: "Bread",
              },
          },
        },
        TESTIngredients: state.cookNow.ingredientsToRemove,
    }
}

const mapDispatchToProps = dispatch => {
return {
        setIngredientsToRemove: (ingredients) => {
          dispatch(setIngredientsToRemove(ingredients));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CookNow)
