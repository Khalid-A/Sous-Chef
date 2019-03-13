import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { DEFAULT_FONT } from '../common/SousChefTheme';
import { BUTTON_BACKGROUND_COLOR } from '../common/SousChefColors';
import { removeFromPantry } from '../redux/actions/PantryAction';
import { addRatingForRecipe } from '../redux/actions/RecipeAction';
import {
  getIsFavorited,
  saveIsFavorited,
  saveIsRecent,
} from '../redux/actions/FavoritedAction';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';

class Finished extends React.Component {
  static navigationOptions = {
    title: "Finished",
    headerVisible: true,
    headerTintColor: "white",
    headerTransparent:false,
    headerBackground:(
      <LinearGradient colors={['#17ba6b','#1d945b']} locations={[0.3,1]} style={{height:90}}>
        <SafeAreaView style={{flex:1 }}>
          <StatusBar barStyle="light-content"/>
        </SafeAreaView>
      </LinearGradient>
    ),
    headerTitleStyle: {
        fontFamily: DEFAULT_FONT,
        fontSize: 25,
        textAlign: 'left',
    },
  }
  constructor(props) {
    super(props);
    this.state = {
      recipeID: null,
      ingredients: null,
      isFavorited: null,
      rating: null,
    };
    this.listIngredients = this.listIngredients.bind(this);

  }

  getIngredientsToRemove = (ingredients) => {
    ingredientsToRemove = {}
    for (var i = 0; i < ingredients.length; i++) {
      ingredientsToRemove[i] =  ingredients[i];
    }
    return ingredientsToRemove
  }

  componentWillMount(){
    this.setState({
      recipeID: this.props.navigation.getParam("recipeID"),
      ingredients: this.getIngredientsToRemove(
        this.props.navigation.getParam("ingredientsToRemove")
      ),
    });
    this.props.getIsFavorited(this.props.userID, this.props.navigation.getParam("recipeID"))
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.isFavorited !== this.props.isFavorited) {
      this.setState({isFavorited: nextProps.isFavorited})
    }
  }


  removeItem = (ingredientIndex) => {
    delete this.state.ingredients[ingredientIndex];
    this.setState({
      ingredients: this.state.ingredients
    });
  }

  updatePantry() {
    this.props.saveIsFavorited(
      this.props.userID,
      this.state.recipeID,
      this.state.isFavorited
    )
    this.props.saveIsRecent(this.props.userID, this.state.recipeID)

    this.props.removeFromPantry(this.props.userID, this.state.ingredients)
    if (this.state.rating !== null) {
      addRatingForRecipe(this.props.navigation.getParam("recipeID"), parseFloat(this.state.rating), this.props.userID);
    }

    this.props.navigation.navigate('Pantry');
  }

  listIngredients(){
    if(this.state.ingredients == null){
      console.warn("null");
    }
    return Object.keys(this.state.ingredients).map((ingredientID) => {
      const text = this.state.ingredients[ingredientID][0].originalText;
      const quantity = this.state.ingredients[ingredientID][0].originalQuantity;
      const index = ingredientID;
      if(!text){
        return null;
      }
      return (
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', marginLeft: 10,}}>

          <Text style={styles.detail}>{quantity} {text}</Text>
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

  addRating(rating) {
    this.setState({
      rating: rating
    });
  }

  render() {
    return (
      <View>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={this.state.rating}
          selectedStar={(rating) => {
            this.addRating(rating);
          }}
        />
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
        <ActionButton
          buttonColor={BUTTON_BACKGROUND_COLOR}
          onPress={() => {
            this.setState({
              isFavorited: !this.state.isFavorited
            })
          }}
          renderIcon={() => {
            if (this.state.isFavorited)
                return (
                    <Icon
                        name="md-heart"
                        style={styles.actionButtonIcon}
                    />
                );
            else
                return (
                    <Icon
                        name="md-heart-empty"
                        style={styles.actionButtonIcon}
                    />
                );
          }}
          />
      </View>
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
    fontFamily: DEFAULT_FONT,

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
    userID: state.userInfo.userID,
    isFavorited: state.favoritedTracker.isFavorited
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getIsFavorited: (userID, recipeID) => {
      dispatch(getIsFavorited(userID, recipeID))
    },
    saveIsFavorited: (userID, recipeID, isFavorited) => {
      saveIsFavorited(userID, recipeID, isFavorited)
    },
    saveIsRecent: (userID, recipeID) => {
      saveIsRecent(userID, recipeID)
    },
    removeFromPantry: (userID, ingredients) => {
      removeFromPantry(userID, ingredients)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Finished)
