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
import { TabBar } from 'react-native-tab-view';
import { Icon } from 'react-native-elements'
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
        { key: 'Ingredients', title: 'INGREDIENTS' },
        { key: 'Directions', title: 'DIRECTIONS' },
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
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', marginLeft: 10,}}>
          <Icon
            name='album'
            color='#17ba6b'
            size={10} />
          <Text style={styles.detail}>{quantity} {text}</Text>

        </View>

      );
    });
  }

  FirstRoute = () => (
    <ScrollView style={{flex:1, marginBottom: 0,}}>
                      {this.listIngredients()}
  </ScrollView>
  );

  SecondRoute = () => (
    <ScrollView style={{flex:1, marginBottom: 0,}}>
             {this.listDirections()}
  </ScrollView>
  );

render() {

  if(this.state.recipe){
    console.warn(this.state.recipe.images);
    return (
      <View style={styles.container}>
      <Image source={
          this.state.recipe.images.trim() == "" ?
          require("../assets/sousChefLogo.png") :
          {uri: this.state.recipe.images}} style={[styles.logo]} resizeMode="contain" />
      <Text style={styles.title}>{this.state.recipe.title}</Text>
      <View style={{flexDirection: 'row', paddingBottom:0, marginBottom:0, borderBottomColor:BACKGROUND_COLOR, borderBottomWidth: 0.25, height: 60, }}>
                <View style={{width: Dimensions.get('window').width/4, height: 60, padding:10, alignItems: 'flex-start',flexDirection: 'row'}} >
                  <Icon
                    name='restaurant'
                    color='#17ba6b' />
                  <Text style={styles.subtitle}>Servings: {"\n"}{this.state.recipe.servings}</Text>
                </View>
                <View style={{width: Dimensions.get('window').width/2, height: 60,padding:10, alignItems: 'flex-start',flexDirection: 'row', marginLeft: 10,}} >
                  <Icon
                    name='timer'
                    color='#17ba6b' />
                <Text style={styles.subtitle}>Cook Time: {"\n"}{this.state.recipe.time.hour} hours {this.state.recipe.time.minute} minutes</Text>
              </View>

                <View style={{width: Dimensions.get('window').width/4, height: 60, alignItems: 'flex-start',flexDirection: 'row',paddingTop:10}}>
                    <Icon
                      name='favorite'
                      color='#17ba6b'

                     />
                </View>
              </View>

      <TabView
        style={{flex: 1,}}
        navigationState={this.state}
        renderScene={SceneMap({
          Ingredients: this.FirstRoute,
          Directions: this.SecondRoute,
        })}
        renderTabBar={props =>
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: BUTTON_BACKGROUND_COLOR }}
    style={{ backgroundColor: 'white', color: BUTTON_BACKGROUND_COLOR, }}
    activeColor = {{color: BUTTON_BACKGROUND_COLOR, textColor:BUTTON_BACKGROUND_COLOR, }}
    inactiveColor = {{}}
    labelStyle = {{color: BUTTON_BACKGROUND_COLOR, fontWeight: 'bold', fontFamily: 'Avenir'}}
  />
}
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
    // backgroundColor: '#F5FCFF',
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
    marginLeft:10,
    marginTop: 5,
    marginBottom:5,

  },
  title: {
    fontSize: 20,
    fontFamily: "Avenir",
    margin: 5,
    fontWeight: 'bold',
    color: BUTTON_BACKGROUND_COLOR,

  },
  subtitle: {
    fontSize: 14,
    marginLeft: 5,
    color: 'grey',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Avenir',
    textAlign: 'center',
    color: 'white',
    backgroundColor:'transparent',
    fontWeight: 'bold',
  },
  logo: {
      // marginTop: Dimensions.get('window').height/5,
      height: Dimensions.get('window').height/3.85,
      width: Dimensions.get('window').width,
  },
  button: {
    // flex: 1,
    alignSelf:'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    width: 250,
    // height: 10,
    borderRadius:30,
    margin: 10,
  },
});
export default connect(null,  null)(CookNow)
