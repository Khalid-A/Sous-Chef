import React from 'react';
import { Button, StyleSheet, Platform, Image, Text, View, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppRegistry, TextInput } from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { beginRecipePreviewFetch } from '../redux/actions/RecipeAction';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors';
import { setIngredientsToRemove } from '../redux/actions/PantryAction';
import { TabView, SceneMap } from 'react-native-tab-view';

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
      index: 0,
      routes: [
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' },
      ],
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
      if(!text){
        return null;
      }
      return (
        <Text style={styles.detail}>{quantity} {text}</Text>
      );
    });
  }

  FirstRoute = () => (
    <ScrollView style={{flex:1, marginBottom: 0,}}>
      <Text style={styles.subtitle}>Ingredients</Text>
                      {this.listIngredients()}
  </ScrollView>
  );

  SecondRoute = () => (
    <ScrollView style={{flex:1, marginBottom: 0,}}>
    <Text style={styles.subtitle}>Directions</Text>
             {this.listDirections()}
  </ScrollView>
  );

render() {
  if(this.state.recipe){
    return (
      <View style={styles.container}>
      <Text style={styles.title}>{this.state.recipe.title}</Text>
      <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{width: Dimensions.get('window').width/3, height: 90, backgroundColor: 'powderblue'}} >
                <Text style={{textAlign: 'left'}}>Serving{"\n"}Size: {"\n"}{this.state.recipe.servings}</Text>
                </View>
                <View style={{width: Dimensions.get('window').width/3, height: 90, backgroundColor: 'skyblue'}} >
                <Text style={styles.subtitle}>Cook{"\n"}Time: {"\n"}{this.state.recipe.time.hour} hours {this.state.recipe.time.minute} minutes</Text>
              </View>
                <View style={{width: Dimensions.get('window').width/3, height: 90, backgroundColor: 'steelblue'}}>
                  <Text>Favorite</Text>
                </View>
              </View>
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: this.FirstRoute,
          second: this.SecondRoute,
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
      <LinearGradient colors={['#17ba6b','#1d945b']} locations={[0.3,1]} style = {styles.button}>
                  <TouchableOpacity
                      onPress={this.onSignUpPressed}
                  ><Text style = {styles.buttonText} onPress={this.finishCooking}>FINISHED!</Text></TouchableOpacity>
                </LinearGradient>
      </View>
    );
  }
  return null;
}

}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    // padding:10,
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
  buttonText: {
    fontSize: 16,
    fontFamily: 'Avenir',
    textAlign: 'center',
    color: 'white',
    backgroundColor:'transparent',
    fontWeight: 'bold',
  },
  button: {
    alignSelf:'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    width: 250,
    borderRadius:30,
    margin: 10,
  },
});
export default connect(null,  null)(CookNow)
