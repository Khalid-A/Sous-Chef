import React from 'react';
import {
    BUTTON_BACKGROUND_COLOR,
    BACKGROUND_COLOR,
    ACTION_BUTTON_COLOR
} from '../common/SousChefColors';
import {DEFAULT_FONT} from '../common/SousChefTheme';
import { StyleSheet, Image, Text, View, ScrollView, FlatList, Dimensions, Button, TouchableOpacity, TextInput} from 'react-native';
import firebase from 'react-native-firebase';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
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
            unitsByIngrName: {},
            addToGlIsClicked: {},
            addAllToGlDisabled: false
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
        this.setState({
            addAllToGlDisabled: true
        });
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

                var unitMapCopy = {...this.state.unitsByIngrName};
                unitMapCopy[pantryIngrData.id] = pantryIngrData.unit;
                this.setState({
                    unitsByIngrName: unitMapCopy
                });
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
            recipe: this.state.recipe
        });
    }

    changeServings = (text) => {
        if (text.match(/\./i) || text == "") return;
        var numServings = parseInt(text);
        if (numServings == 0 || numServings == NaN) return;
        var scaleBy = numServings / this.state.recipe.servings;

        // Change quantities in have / don't have
        var haveIngredientsCopy = [...this.state.haveIngredients];
        var dontHaveIngredientsCopy = [...this.state.dontHaveIngredients];
        for (var i = 0; i < haveIngredientsCopy.length; i++) {
            haveIngredientsCopy[i][0].standardQuantity = Math.round(
                haveIngredientsCopy[i][0].standardQuantity * scaleBy * 100) / 100;
            haveIngredientsCopy[i][0].originalQuantity = Math.round(
                haveIngredientsCopy[i][0].originalQuantity * scaleBy * 100) / 100;
        }
        for (var i = 0; i < dontHaveIngredientsCopy.length; i++) {
            dontHaveIngredientsCopy[i][0].standardQuantity = Math.round(
                dontHaveIngredientsCopy[i][0].standardQuantity * scaleBy * 100) / 100;
            dontHaveIngredientsCopy[i][0].originalQuantity = Math.round(
                dontHaveIngredientsCopy[i][0].originalQuantity * scaleBy * 100) / 100;
        }
        this.setState({
            haveIngredients: haveIngredientsCopy,
            dontHaveIngredients: dontHaveIngredientsCopy
        });

        // Change quantities in recipe
        var recipeCopy = {...this.state.recipe};
        var ingredientsCopy = recipeCopy.ingredients;
        for (var i = 0; i < ingredientsCopy; i++) {
            ingredientsCopy[i].standardQuantity = Math.round(
                ingredientsCopy[i].standardQuantity * scaleBy * 100) / 100;
            ingredientsCopy[i].originalQuantity = Math.round(
                ingredientsCopy[i].originalQuantity * scaleBy * 100) / 100;
        }

        recipeCopy.servings = numServings;
        recipeCopy.ingredients = ingredientsCopy;
        this.setState({
            recipe: recipeCopy
        });
    }

    closeRow(rowMap, rowKey) {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    render() {
        if (this.state.recipe && this.state.recipe.ingredients) {
            return (
                <View style={[styles.container]}>
                    <Text style={[styles.sectionHeader]}>
                        {this.state.recipe.title ? this.state.recipe.title : "<Recipe Name>"}
                    </Text>

                    <View style={[styles.servings]}>
                        <Text style={[styles.serves]}>
                            Serves:
                        </Text>
                        <TextInput
                            style={{height: 40, fontSize: 14, borderColor: 'gray', borderWidth: 1}}
                            keyboardType={"number-pad"}
                            maxLength={3}
                            enablesReturnKeyAutomatically={true}
                            onChangeText={(text) => this.changeServings(text)}
                            defaultValue={this.state.recipe.servings.toString()}
                        />
                    </View>

                    <Text style={[styles.ingredientsLabel]}>
                        You don&apos;t have:
                    </Text>

                    <SwipeListView
                        useFlatList
                        data={this.state.dontHaveIngredients}
                        keyExtractor={(item, index) => item[0].key}
                        extraData={this.state}
                        style={[styles.list, {height: 50 * this.state.dontHaveIngredients.length}]}
                        renderItem={({item, index}) =>
                            <View key={item.key} style={[styles.listItem]}>
                                <Text
                                    style={[styles.ingredientName]}
                                    key={"Ingredient Name " + index}
                                    data={{surplus: item[1]}}>
                                    {item[0].originalQuantity} {item[0].originalText}
                                </Text>
                                <Text
                                    style={[styles.ingredientSubtext]}
                                    key={"Ingredient subtext " + index}>
                                    {
                                        (Math.round(item[0].standardQuantity*100) / 100) +
                                        " " + item[0].standardUnit + " " + item[0].ingredient
                                    }
                                </Text>
                            </View>
                        }
                        renderHiddenItem={ (data, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity
                                    style={[styles.backRightBtn, styles.backRightBtnRight,
                                        {
                                            backgroundColor: this.state.addToGlIsClicked[data.item[0].ingredient] ? "gray" : "purple"
                                        }]}
                                    onPress={ _ => {
                                        this.addIngrToGroceryList(data.index);
                                    }}>
                                    <Text style={styles.text}>{
                                        this.state.addToGlIsClicked[data.item[0].ingredient] ?
                                            "Added to\nGL" : "Add to\nGL"
                                    }</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.backRightBtn, styles.backLeftBtnRight]}
                                    onPress={ _ => {
                                        this.indicateHave(data.index);
                                    }}>
                                    <Text style={styles.text}>
                                        Have
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        leftOpenValue={150}
                    />

                    <Text style={[styles.ingredientsLabel, {marginTop: 10}]}>
                        You have:
                    </Text>

                    <SwipeListView
                        useFlatList
                        data={this.state.haveIngredients}
                        keyExtractor={(item, index) => item[0].key}
                        extraData={this.state}
                        style={[styles.list]}
                        renderItem={({item, index}) =>
                            <View key={item.key} style={[styles.listItem]}>
                                <Text
                                    style={[styles.ingredientName]}
                                    key={"Ingredient Name " + index}
                                    data={{surplus: item[1]}}>
                                    {item[0].originalQuantity} {item[0].originalText}
                                </Text>
                                <Text
                                    style={[styles.ingredientSubtext]}
                                    key={"Ingredient subtext " + index}>
                                    {
                                        (Math.round(item[0].standardQuantity*100) / 100) +
                                        " " + item[0].standardUnit + " " + item[0].ingredient
                                    }
                                </Text>
                            </View>
                        }
                        renderHiddenItem={ (data, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity
                                    style={[styles.backRightBtn, styles.backRightBtnRight]}
                                    onPress={ _ => {
                                        this.indicateHave(data.index, false);
                                    }}>
                                    <Text style={styles.text}>
                                        {"Don't\nHave"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        leftOpenValue={75}
                    />

                    <View style={[styles.buttons]}>
                        <Button
                            style={[styles.button]}
                            title="Add All to Grocery List"
                            disabled={this.state.addAllToGlDisabled}
                            onPress={() => this.addAllToGroceryList()}
                        ></Button>
                        <View style={{width: 30}}></View>
                        <Button
                            style={[styles.button]}
                            title="Make right now"
                            onPress={() => this.cookNow()}
                        ></Button>
                    </View>
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
        paddingBottom: 25,
        alignItems: "center",
        justifyContent: "center"
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
    ingredientQuantity: {
        fontWeight: "bold",
        fontSize: 10
    },
    ingredientName: {
    },
    ingredientSubtext: {
        fontSize: 11
    },
    ingredientsLabel: {
        fontWeight: "bold",
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    ingredientFlatList: {
        height: 500
    },

    list: {
        flex: 1,
        flexDirection: "column",
        width: "100%"
    },
    listItem: {
        flex: 1,
        height: 50,
        backgroundColor: BACKGROUND_COLOR,
        paddingLeft: 4
    },
    text: {
        fontFamily: DEFAULT_FONT,
        fontSize: 15,
        color: BACKGROUND_COLOR,
        padding: 4
    },
    backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75
	},
    backRightBtnRight: {
        backgroundColor: 'purple',
        left: 0
    },
	backRightBtnLeft: {
		backgroundColor: 'purple',
		right: 0
	},
    backLeftBtnRight: {
        backgroundColor: 'green',
		left: 75
    },
    backLeftBtnLeft: {
        backgroundColor: 'green',
        right: 75
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    buttons: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        color: ACTION_BUTTON_COLOR,
        fontFamily: DEFAULT_FONT,
        margin: 15,
    },
    servings: {
    }
});
