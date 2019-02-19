import React from 'react';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors'
import { StyleSheet, Image, Text, View, ScrollView, FlatList, Dimensions } from 'react-native';
import firebase from 'react-native-firebase';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { beginRecipePreviewFetch } from '../redux/actions/RecipeAction';
import { connect } from 'react-redux';

const recipesRef = firebase.firestore().collection('recipes');
const pantryRef = firebase.firestore().collection('pantrylists');
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
            imageHeight: 0
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

    createIngredientList(haveIngredients, dontHaveIngredients) {
        var elements = [];

        elements.push(
            <Text style={[styles.ingredientsLabel]}>
                You have:
            </Text>
        );

        haveIngredients.forEach((elem) => {
            [item, surplus] = elem;
            elements.push(
                <Text
                    style={[styles.ingredientName]}
                    data={{"surplus": surplus}}
                    key={item.ingredient}>
                    {item.quantity} {item.unit} {item.ingredient}
                </Text>
            );
        });

        elements.push(
            <Text style={[styles.ingredientsLabel]}>
                You don't have:
            </Text>
        );

        dontHaveIngredients.forEach((elem) => {
            [item, surplus] = elem;
            elements.push(
                <Text
                    style={[styles.ingredientName]}
                    data={{"surplus": surplus}}
                    key={item.ingredient}>
                    {item.quantity} {item.unit} {item.ingredient}
                </Text>
            );
        });

        return elements;
    }

    listIngredients() {
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

        // Construct XML to return
        return createIngredientList();
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
                    {this.listIngredients()}
                    
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
