import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';
import { AppRegistry, TextInput } from 'react-native';
import { Dimensions } from 'react-native'
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';

class CookNow extends React.Component {
    static navigationOptions = {
        header: null,
        headerVisible: false,
    }
    constructor(props) {
        super(props);
        this.state = {};
        this.listIngredients = this.listIngredients.bind(this);
    }

    listIngredients(){
      if(this.props.recipe.ingredients == null){
        console.warn("null");
      }
      return Object.keys(this.props.recipe.ingredients).map((ingredientID) => {
        if(this.props == null){
          console.warn("null");
        }
        console.warn(this.props.recipe.ingredients[ingredientID].ingredient);
          if(this.props.recipe.ingredients[ingredientID].ingredient == null){
            return;
          }
          else{
          return <Text>{this.props.recipe.ingredients[ingredientID].ingredient}</Text>
        }
      });

  }

    // onSetNamePressed = () => {
    //     // this.props.navigation.navigate("SignUp");
    //     this.props.setName("Tucker")
    // }

    render() {
        return (
            <ScrollView>
            <View style={styles.container}>
                {this.listIngredients()}
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
                ingredient: "Peper",
              },
              ingredient5:{
                ingredient: "",
              },
              ingredient4:{
                ingredient: "Bread",
              },
          },
        },

    }
}

const mapDispatchToProps = dispatch => {
return {
        setName: (name) => {
            dispatch(setName(name));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CookNow)


//       return this.props.recipe.ingredients.keys().map((ingredient) => {
//         if(ingredient == null){
//           console.warn("null");
//         }
//         return <Text>{ingredient.ingredient}</Text>
//       });

      // return this.props.recipe.ingredients.keys().map((ingredient) => {
      //   if(ingredient == null){
      //     console.warn("null");
      //   }
      //   return <Text>{ingredient.ingredient}</Text>
      // });
//       return this.props.recipe.ingredients.keys().map((iKey) => {
//         Const ingredient = this.props.recipes.ingredients[iKey];
//         if(ingredient == null){
//           console.warn("null");
//         }
//         return <Text>{ingredient.ingredient}</Text>
//       });
