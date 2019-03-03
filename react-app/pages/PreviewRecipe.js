import React from 'react';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors';
import { StyleSheet, Image, Text, View, ScrollView, FlatList, Dimensions, Button } from 'react-native';
import firebase from 'react-native-firebase';
// import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { beginRecipePreviewFetch } from '../redux/actions/RecipeAction';
import { connect } from 'react-redux';

const recipesRef = firebase.firestore().collection('test_recipes');
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
            recipeID: this.props.navigation.getParam("recipeID"),
            userID: this.props.navigation.getParam("userID"),
            recipe: null,
            image: "",
            imageWidth: 0,
            imageHeight: 0,
            haveIngredients: [],
            dontHaveIngredients: [],
            addToGlIsClicked: {}
        };
    }

    componentWillMount() {
        recipesRef.doc(this.state.recipeID).get().then((doc) => {
            var data = doc.data();
            var ingredientsArray = [];
            for (var key in data.ingredients) {
                var val = data.ingredients[key];
                val.ingredient = key;
                val.key = key;
                // Initialize value of clicked map
                var copyAddToGL = {...this.state.addToGlIsClicked};
                copyAddToGL[key] = false;
                this.setState({
                    addToGlIsClicked: copyAddToGL
                });
                ingredientsArray.push(val);
            }
            data.ingredients = ingredientsArray;
            this.setState({
                recipe: data,
                image: data.images
            });
            this.calculateHaveIngredients();
        })
        .catch((error) => {
            console.warn("Error getting documents for recipe" +
                this.state.recipeID + "\n" +
                error
            );
        });
    }

    updatePantryAmount = (have, item, surplus) => {
        if (have) {
            var docExists = false;
            // Increment amount in pantry to how much this recipe needs
            firebase.firestore().runTransaction((transaction) => {
                var pantryDocRef = pantryRef.doc(this.state.userID)
                    .collection("ingredients").doc(item.ingredient);
                return transaction.get(pantryDocRef).then((doc) => {
                    if (!doc.exists) {
                        throw "Document does not exist";
                    }
                    // We have more of this ingredient, update
                    docExists = true;
                    var data = doc.data();
                    transaction.update(pantryDocRef, {
                        amount: data.amount - surplus
                    });
                });
            }).catch((err) => {
                // We need to add this item to the pantry
                pantryRef.doc(this.state.userID).collection("ingredients")
                    .doc(item.ingredient).set({
                        amount: -surplus
                    });
            });
        }
        else {
            // We want to make sure this item is removed from the pantry
            pantryRef.doc(this.state.userID).collection("ingredients")
                .doc(item.ingredient).delete().then(() => {
                    console.log(item.ingredient + " deleted successfully");
                }).catch((error) => {
                    console.log(item.ingredient + " already deleted");
                });
        }
    }

    indicateHave = (arrayIndex, have=true) => {
        var haveCopy = [...this.state.haveIngredients];
        var dontHaveCopy = [...this.state.dontHaveIngredients];

        var element, item, surplus;
        // Move ingredient to appropriate array in state
        if (have) {
            element = dontHaveCopy[arrayIndex];
            item = element[0];
            surplus = element[1];
            dontHaveCopy.splice(arrayIndex, 1);
            haveCopy.push(element);
        }
        else {
            element = haveCopy[arrayIndex];
            item = element[0];
            surplus = element[1];
            haveCopy.splice(arrayIndex, 1);
            dontHaveCopy.push(element);
        }

        this.setState({
            haveIngredients: haveCopy,
            dontHaveIngredients: dontHaveCopy
        });
        this.render();

        // Update ingredient in pantry
        this.updatePantryAmount(have, item, surplus);
    }

    addIngrToGroceryList = (dontHaveIndex) => {
        var item, surplus;
        item = this.state.dontHaveIngredients[dontHaveIndex][0];
        surplus = this.state.dontHaveIngredients[dontHaveIndex][1];
        var docExists = false;
        // Increment amount in GL to how much this recipe needs
        firebase.firestore().runTransaction((transaction) => {
            var glDocRef = glRef.doc(this.state.userID)
                .collection("ingredients").doc(item.ingredient);
            return transaction.get(glDocRef).then((doc) => {
                if (!doc.exists) {
                    throw "Ingredient not in GL";
                }
                // We have more of this ingredient, update
                docExists = true;
                var data = doc.data();
                transaction.update(glDocRef, {
                    amount: data.amount - surplus
                });
            });
        }).catch((err) => {
            // We need to add this item to the pantry
            glRef.doc(this.state.userID).collection("ingredients")
                .doc(item.ingredient).set({
                    amount: -surplus
                });
        }).then(() => {
            var copyAddToGL = {...this.state.addToGlIsClicked};
            copyAddToGL[item.ingredient] = true;
            this.setState({
                addToGlIsClicked: copyAddToGL
            });

            this.render();
        });
    }

    addAllToGroceryList = () => {
        this.state.dontHaveIngredients.forEach((item, index) => {
            if (!this.state.addToGlIsClicked[item[0].ingredient]) {
                // Only add if it hasn't been added already
                this.addIngrToGroceryList(index);
            }
        });
    }

    calculateHaveIngredients = () => {
        if (this.state.recipe.ingredients == null){
            console.warn("null");
        }

        // Sort ingredients into have and don't have
        var promises = [];
        for (var i = 0; i < this.state.recipe.ingredients.length; i++) {
            // Search for item in pantry
            promises.push(pantryRef.doc(this.state.userID).collection("ingredients")
                .doc(this.state.recipe.ingredients[i].ingredient).get());
        }

        // Deal with concurrency issues by "joining" at steps
        Promise.all(promises).then((docs) => {
            var surpluses = new Array(docs.length);
            surpluses = surpluses.map((x) => { return null; });
            for (var i = 0; i < docs.length; i++) {
                var pantryIngrDoc = docs[i];
                if (!pantryIngrDoc.exists) {
                    break;
                }
                var pantryIngrData = pantryIngrDoc.data();
                surpluses[i] = pantryIngrData.amount -
                    this.state.recipe.ingredients[i].standardQuantity;
            }
            return surpluses;
        }).then((surpluses) => {
            for (var i = 0; i < surpluses.length; i++) {
                // Handle case when we don't have this ingredient at all
                if (surpluses[i] == null) {
                    surpluses[i] = -this.state.recipe.ingredients[i].standardQuantity;
                }
            }
            return surpluses;
        }).then((surpluses) => {
            var haveIngredients = [];
            var dontHaveIngredients = [];
            for (var i = 0; i < surpluses.length; i++) {
                var surplus = surpluses[i];
                var arr = [this.state.recipe.ingredients[i], surplus];
                if (surplus >= 0) {
                    // We have enough of ingredient at index i
                    haveIngredients.push(arr);
                }
                else {
                    // We don't have enough of ingredient at index i
                    dontHaveIngredients.push(arr);
                }
            }
            this.setState({
                haveIngredients: haveIngredients,
                dontHaveIngredients: dontHaveIngredients
            });
        });
    }

    cookNow = () => {
        this.props.navigation.navigate('CookNow', {
            // TODO: substitutions here
            recipeID: this.state.recipeID,
            recipe: this.state.recipe
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
                    <FlatList
                        data={this.state.haveIngredients}
                        extraData={this.state}
                        keyExtractor={(item, index) => item[0].key}
                        style={[styles.ingredientFlatList]}
                        renderItem={({item, index}) =>
                            <View key={item.key}>
                                <Text
                                    style={[styles.ingredientName]}
                                    key={"Ingredient Name " + index}
                                    data={{surplus: item[1]}}>
                                    {item[0].originalQuantity} {item[0].originalText}
                                </Text>
                                <Button
                                    style={{color: 'red'}}
                                    key={"Don't Have " + index}
                                    title="Don't Have"
                                    onPress={() => this.indicateHave(index, false)}
                                ></Button>
                            </View>
                        }
                    />

                    <Text style={[styles.ingredientsLabel]}>
                        You don&apos;t have:
                    </Text>

                    <FlatList
                        data={this.state.dontHaveIngredients}
                        extraData={this.state}
                        keyExtractor={(item, index) => item[0].key}
                        renderItem={({item, index}) =>
                            <View key={item.key}>
                                <Text
                                    style={[styles.ingredientName]}
                                    key={"Ingredient Name " + index}
                                    data={{surplus: item[1]}}>
                                    {item[0].originalQuantity} {item[0].originalText}
                                </Text>
                                <Button
                                    key={"Have " + index}
                                    style={{color: 'red'}}
                                    title="Have"
                                    onPress={() => this.indicateHave(index)}
                                ></Button>
                                <Button
                                    style={{color: 'red'}}
                                    key={"Add to GL " + index}
                                    disabled={this.state.addToGlIsClicked[item[0].ingredient]}
                                    title={this.state.addToGlIsClicked[item[0].ingredient] ? "Added to GL" : "Add to GL"}
                                    onPress={() => this.addIngrToGroceryList(index)}
                                ></Button>
                            </View>
                        }
                    />

                    <Button
                        style={{color: 'yellow'}}
                        title="Add All to Grocery List"
                        onPress={() => this.addAllToGroceryList()}
                    ></Button>

                    <Button
                        style={{color: 'red'}}
                        title="Make right now"
                        onPress={() => this.cookNow()}
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
    ingredientFlatList: {
        height: 500
    }
});
