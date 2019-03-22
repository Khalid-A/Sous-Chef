import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { DEFAULT_FONT } from '../common/SousChefTheme';
import { BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR } from '../common/SousChefColors';
import { removeFromPantry } from '../redux/actions/PantryAction';
import { addRatingForRecipe } from '../redux/actions/RecipeAction';
import { saveIsRecent } from '../redux/actions/FavoritedAction';
import StarRating from 'react-native-star-rating';
import { Icon } from 'react-native-elements';
import globalStyle from '../common/SousChefTheme';

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
    /*function formats ingredients for easy iteration for display*/
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
    }
    /*funtion removes an item from the ingredients to remove list.
    Change is refelected visually. */
    removeItem = (ingredientIndex) => {
        delete this.state.ingredients[ingredientIndex];
        this.setState({
            ingredients: this.state.ingredients
        });
    }
    /*This function adds the recipe to recent recipes in database.
    This function removes the items int he list from the pantry.
    It then navigates to pantry so that the user can se the changes.*/
    updatePantry() {
        this.props.saveIsRecent(this.props.userID, this.state.recipeID)

        this.props.removeFromPantry(this.props.userID, this.state.ingredients)
        if (this.state.rating !== null) {
            addRatingForRecipe(this.props.navigation.getParam("recipeID"), parseFloat(this.state.rating), this.props.userID);
        }
        this.props.navigation.navigate('Pantry');
    }
    /*funtion iterates through the ingredients and displays ingredients
    and quantities that will be decremented from pantry. Delete icon is included
    for each item. */
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
                <View style={styles.listItem}>

                    <Text style={styles.detail}>{quantity} {text}</Text>
                    <Icon
                        style={{
                            justifyContent: 'flex-end',
                        }}
                        name={'clear'}
                        color='#17ba6b'
                        onPress={() => this.removeItem(ingredientID)}
                        />
                </View>
            );
        });
    }
    /* This function sets the rating in the state*/
    addRating(rating) {
        this.setState({
            rating: rating
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Rate this Recipe: </Text>
                <StarRating
                    containerStyle={{width: Dimensions.get('window').width - 100, marginLeft:5,marginBottom:20,}}
                    disabled={false}
                    maxStars={5}
                    rating={this.state.rating}
                    emptyStarColor ={BACKGROUND_COLOR}
                    fullStarColor = {BUTTON_BACKGROUND_COLOR}
                    halfStarColor = {BUTTON_BACKGROUND_COLOR}
                    halfStarEnabled = {true}
                    starSize = {30}
                    selectedStar={(rating) => {
                        this.addRating(rating);
                    }}
                    />
                <Text style={styles.title}>Items: </Text>
                <Text style={{color:'grey', margin:5,}}>The following Items will be removed from your Pantry</Text>
                <ScrollView>
                    {this.listIngredients()}
                </ScrollView>
                <LinearGradient colors={['#17ba6b','#1d945b']} locations={[0.3,1]} style = {styles.button}>
                    <TouchableOpacity>
                        <Text style = {globalStyle.gradientButtonText} onPress={() => this.updatePantry()}>
                            Update Pantry
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingTop: 10,
        paddingLeft: 10,
        paddingBottom: 10,
        paddingRight: 10,
    },
    detail:{
        flex:3,
        fontSize: 15,
        fontFamily: DEFAULT_FONT,
    },
    title: {
        fontSize: 20,
        fontFamily: DEFAULT_FONT,
        margin: 5,
        fontWeight: 'bold',
        color: BUTTON_BACKGROUND_COLOR,

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
    listItem:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems:'center',
        marginLeft: 10,
        borderTopColor:BACKGROUND_COLOR,
        borderTopWidth:.25,
        borderBottomColor:BACKGROUND_COLOR,
        borderBottomWidth:.25,
        paddingTop:5,
        paddingBottom:5,
    }
});

const mapStateToProps = state => {
    return {
        userID: state.userInfo.userID,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveIsRecent: (userID, recipeID) => {
            saveIsRecent(userID, recipeID)
        },
        removeFromPantry: (userID, ingredients) => {
            removeFromPantry(userID, ingredients)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Finished)
