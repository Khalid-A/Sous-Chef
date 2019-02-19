import React from 'react';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors'
import { StyleSheet, Image, Text, View, ScrollView, FlatList, Dimensions } from 'react-native';
import firebase from 'react-native-firebase';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { beginRecipePreviewFetch } from '../redux/actions/RecipeAction';
import { connect } from 'react-redux';

const recipesRef = firebase.firestore().collection('recipes');
const pantryRef = firebase.firestore().collection('pantrylists');
const glRef = firebase.firestore().collection('grocerylists');
const mappingsRef = firebase.firestore().collection('standardmappings');

const win = Dimensions.get('window');

export default class PreviewRecipe extends React.Component {
    static navigationOptions = {
        title: "Preview Recipe",
        headerVisible: true,
        headerTintColor: "white",
        headerLeft: null,
        headerStyle: {
            backgroundColor: BUTTON_BACKGROUND_COLOR,
        },
        headerTitleStyle: {
            fontFamily: "Avenir Next",
            fontSize: 35
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            recipeID: this.props.navigation.state.id,
            recipe: null,
            image: "",
            imageWidth: 0,
            imageHeight: 0,
            haveIngredients: [],
            dontHaveIngredients: []
        };
    }

    componentWillMount() {
        var recipeID = "0063ec25-5e33-4a59-9a52-ecd090c3fcad";

        recipesRef.doc(recipeID).get().then((doc) => {
            var data = doc.data();
            var ingredientsArray = Object.values(data.ingredients);
            data.ingredients = ingredientsArray;
            this.setState({
                recipe: data,
                image: data.images ? data.images : "https://images.media-allrecipes.com/userphotos/560x315/2345230.jpg"
            });

            calculateHaveIngredients();
        })
        .catch(function(error) {
            console.warn("Error getting documents: ", error);
        });
    }

    isInPantry(ingrData, pantryIngrData) {
        // Search for standard mappings of ingredient
        mappingsRef.doc(ingrData.ingredient).get().then((doc) => {
            var data = doc.data();
            var ingrDescription = ingrData.ingredient +
            var convRatio = data.standardTo[]
        });
        var quantity = ingrData.quantity;
        var unit = ingrData.unit;
    }

    // Sort required ingredients into enough and not enough
    getSurpluses() {
        return this.state.recipe.ingredients.map((recipeIngrData) => {
            // Search for item in pantry
            var surplus = null;
            pantryRef.doc(this.props.userID).collection("ingredients")
                .doc(recipeIngrData.ingredient).get().then((pantryIngrDoc) => {
                    if (pantryIngrDoc.exists) {
                        var pantryIngrData = pantryIngrDoc.data();
                        // Figure out if we have enough
                        surplus = pantryIngrData.amount -
                            recipeIngrData.amount;
                    }
                }).catch(function(error) {
                });

            if (surplus == null) {
                // We don't have this ingredient at all
                surplus = -recipeIngrData.amount;
            }

            return surplus;
        });
    }

    updatePantryAmount(have, item, surplus) {
        if (have) {
            var docExists = false;
            // Increment amount in pantry to how much this recipe needs
            firebase.firestore().runTransaction(function(transaction) {
                var pantryDocRef = pantryRef.doc(this.props.userID)
                    .collection("ingredients").doc(item.ingredient);
                transaction.get(pantryDocRef).then(function(doc) {
                    if (doc.exists) {
                        // We have more of this ingredient, update
                        docExists = true;
                        var data = doc.data();
                        transaction.update(pantryDocRef, {
                            amount: data.amount - surplus;
                        });
                    }
                });
            });

            if (!docExists) {
                // We need to add this item to the pantry
                pantryRef.doc(this.props.userID).collection("ingredients")
                    .doc(item.ingredient).set({
                        amount: -surplus;
                    });
            }
        }
        else {
            // We want to make sure this item is removed from the pantry
            pantryRef.doc(this.props.userID).collection("ingredients")
                .doc(item.ingredient).delete().then(function() {
                    console.log(item.ingredient + " deleted successfully");
                }).catch(function(error) {
                    console.log(item.ingredient + " already deleted");
                });
        }
    }

    indicateHave(arrayIndex, have=true) {
        var fromArray, toArray;
        if (have) {
            fromArray = this.state.dontHaveIngredients;
            toArray = this.state.haveIngredients;
        }
        else {
            fromArray = this.state.haveIngredients;
            toArray = this.state.dontHaveIngredients;
        }
        // Move ingredient to appropriate array in state
        var element = fromArray[arrayIndex];
        var item, surplus;
        [item, surplus] = element;
        fromArray.splice(arrayIndex, 1);
        toArray.push(item);

        // Update ingredient in pantry
        updatePantryAmount(have, item, surplus);

        // TODO: do we need to re-render manually?
    }

    addIngrToGroceryList(dontHaveIndex) {
        var item, surplus;
        [item, surplus] = this.state.dontHaveIngredients[dontHaveIndex];
        var docExists = false;
        // Increment amount in GL to how much this recipe needs
        firebase.firestore().runTransaction(function(transaction) {
            var glDocRef = glRef.doc(this.props.userID)
                .collection("ingredients").doc(item.ingredient);
            transaction.get(pantryDocRef).then(function(doc) {
                if (doc.exists) {
                    // We have more of this ingredient, update
                    docExists = true;
                    var data = doc.data();
                    transaction.update(glDocRef, {
                        amount: data.amount - surplus;
                    });
                }
            });
        });

        if (!docExists) {
            // We need to add this item to the pantry
            glRef.doc(this.props.userID).collection("ingredients")
                .doc(item.ingredient).set({
                    amount: -surplus;
                });
        }
    }

    addAllToGroceryList() {
        this.state.dontHaveIngredients.forEach((item, index) => {
            addIngrToGroceryList(index);
        });
    }

    createHaveList() {
        var elements = [];

        this.state.haveIngredients.forEach((elem, i) => {
            var item, surplus;
            [item, surplus] = elem;
            elements.push(
                <View>
                    <Text
                        style={[styles.ingredientName]}
                        data={{surplus: surplus}}
                        key={item.ingredient}>
                        {item.quantity} {item.unit} {item.ingredient}
                    </Text>
                    <Button
                        style={{color: 'red'}}
                        title="Don't Have"
                        onPress={indicateHave(i, false)}
                    ></Button>
                </View>
            );
        });

        return elements;
    }

    createDontHaveList() {
        var elements = [];

        this.state.dontHaveIngredients.forEach((elem, i) => {
            var item, surplus;
            [item, surplus] = elem;
            elements.push(
                <View>
                    <Text
                        style={[styles.ingredientName]}
                        data={{surplus: surplus}}
                        key={item.ingredient}>
                        {item.quantity} {item.unit} {item.ingredient}
                    </Text>
                    <Button
                        style={{color: 'red'}}
                        title="Have"
                        onPress={indicateHave(i)}
                    ></Button>
                    <Button
                        style={{color: 'red'}}
                        title="Add to GL"
                        onPress={addIngrToGroceryList(i)}
                    ></Button>
                </View>
            );
        });

        return elements;
    }

    calculateHaveIngredients() {
        if (this.state.recipe.ingredients == null){
            console.warn("null");
        }

        // surpluses[i] == (we have enough of this.state.recipe.ingredients[i])
        var surpluses = getSurpluses();

        // Sort ingredients into have and don't have
        var haveIngredients = [];
        var dontHaveIngredients = [];
        surpluses.forEach((surplus, i) => {
            if (surplus >= 0) {
                // We have enough of ingredient at index i
                haveIngredients.push([
                    this.state.recipe.ingredients[i],
                    surplus
                ]);
            }
            else {
                // We don't have enough of ingredient at index i
                donthHaveIngredients.push([
                    this.state.recipe.ingredients[i],
                    surplus
                ]);
            }
        });

        this.setState({
            haveIngredients: haveIngredients,
            dontHaveIngredients: dontHaveIngredients
        });
    }

    cookNow() {
        this.props.navigation.navigate('CookNow', {
            // TODO: substitutions here
        });
    }

    // TODO: https://www.npmjs.com/package/react-native-swipe-list-view
    render() {
        if (this.state.recipe && this.state.recipe.ingredients) {
            return (
                <View style={[styles.container]}>
                    <Text style={[styles.sectionHeader]}>
                        {this.state.recipe.title ? this.state.recipe.title : "unknown"}
                    </Text>
                    <View style={[styles.imageContainer]}>
                        <Image source={{uri: this.state.image}}
                            style={[styles.image]}/>
                    </View>

                    <Text style={[styles.ingredientsLabel]}>
                        You have:
                    </Text>
                    <Button
                        style={{color: 'yellow'}}
                        title="Add All to Grocery List"
                        onPress={addAllToGroceryList()}
                    ></Button>
                    {this.createHaveList()}
                    <Text style={[styles.ingredientsLabel]}>
                        You don't have:
                    </Text>
                    {this.createDontHaveList()}

                    <Button
                        style={{color: 'red'}}
                        title="Make right now"
                        onPress={cookNow()}
                    ></Button>
                </View>
            );
        }
        else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: BACKGROUND_COLOR,
        paddingBottom: 25
    },
    section: {
        flex: 1,
        flexDirection: "row"
    },
    sectionHeader: {
        fontFamily: "Avenir Next",
        fontSize: 25,
        margin: 10
    },
    sectionContainer: {
        flex: 1,
    },
    listItem: {
        borderColor: "red",
        borderWidth: 1,
        fontFamily: "Avenir Next",
        fontSize: 15,
        margin: 3
    },
    ingredientQuantity: {
        fontWeight: "bold",
        fontSize: 10
    },
    ingredientName: {
    },
    ingredientsLabel: {

    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 560,
        height: 315
    }
});
