import React from 'react';
import {
    BUTTON_BACKGROUND_COLOR,
    BACKGROUND_COLOR,
    ACTION_BUTTON_COLOR
} from '../common/SousChefColors'
import { StyleSheet, Text, View, FlatList } from 'react-native';
import {beginPantryFetch, addPantryItem} from '../redux/actions/PantryAction';
import { connect } from 'react-redux';
import {DEFAULT_FONT} from '../common/SousChefTheme';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    RkTextInput,
    RkPicker,
    RkButton
} from 'react-native-ui-kitten';
import Dialog, {
    DialogFooter,
    SlideAnimation,
    DialogButton,
    DialogTitle,
    DialogContent
} from 'react-native-popup-dialog';

const math = require('mathjs');

const defaultState = {
    addDialogVisible : false,
    newIngredient: "",
    pickedValue: ["1", ""],
    pickerVisible: false
};

const ingrMappings = firebase.firestore().collection('standardmappings');

class Pantry extends React.Component {
    static navigationOptions = {
        title:"Your Pantry",
        headerVisible: true,
        headerTintColor: "white",
        headerLeft: null,
        headerStyle: {
            backgroundColor: BUTTON_BACKGROUND_COLOR,
        },
        headerTitleStyle: {
            fontFamily: DEFAULT_FONT,
            fontSize: 35
        },
        drawerLabel: 'Pantry'
    }

    constructor(props) {
        super(props);
        this.state = defaultState;
    }

    volumeUnits = ['cup', 'tablespoon', 'teaspoon', 'liter', 'l', 'milliliter',
        'cups', 'tablespoons', 'teaspoons', 'liters', 'milliliters', 'ml',
        'pint', 'pints', 'quart', 'quarts', 'qt', 'gallon', 'gallons', 'gal'];
    weightUnits = ['oz', 'ounce', 'ounces', 'gram', 'grams', 'g', 'kg', 'kilo',
        'kilos', 'kilogram', 'kilograms', 'pound', 'pounds', 'lb', 'lbs'];
    itemUnits = ['carton', 'bag', 'package', 'container', 'whole',
        'box', 'loaf', 'dozen', 'bottle', 'jar', 'stick', 'cartons', 'bags',
        'packages', 'containers', 'boxes', 'loaves', 'bottles', 'jars',
        'sticks'];

    measurementUnits = volumeUnits.concat(weightUnits).concat(itemUnits);

    // Stop accepting words for numbers after and including "twenty-one"
    numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    numberNames = ['one', 'two', 'three', 'four', 'five', 'six', 'seven',
        'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
        'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

    disallowedPunctuation = [', ', '- ', '. ', '; ', ': ')]

    sanitize = (text) => {
        var result = text.trim().toLowerCase();
        disallowedPunctuation.forEach((item) => {
            result = result.replace(item, ' ');
        });
        return result;
    }

    parseQuantity = (tokens) => {
        var numberResult = null;
        for (var i = 0; i < numbers.length; i++) {
            var number = numbers[i];
            if (tokens[0].indexOf(number) != -1) {
                numberResult = parseFloat(tokens[0]);
                break;
            }
        }
        if (numberResult == null) {
            // Couldn't find an arabic numberal, try text up to "twenty"
            for (var i = 0; i < numberNames.length; i++) {
                var number = numberNames[i];
                if (tokens[0].indexOf(number) != -1) {
                    numberResult = parseInt(numbers[i]);
                    break;
                }
            }
        }
        if (numberResult == null) {
            // We couldn't find a number, assume it's 1
            numberResult = 1;
        }
        else {
            // We could find a number, remove it from tokens
            tokens.shift();
        }
        return numberResult;
    }

    parseUnits = (tokens) => {
        var unitIndex = -1;
        for (var i = 0; i < measurementUnits.length; i++) {
            var unit = measurementUnits[i];
            for (var j = 0; j < tokens.length; j++) {
                var token = tokens[j];
                if (token == unit) {
                    unitIndex = j;
                    break;
                }
            }
            if (unitIndex != -1) break;
        }

        if (unitIndex == -1) return "whole";

        var rawUnits = tokens[unitIndex];

        // Ignore text before units
        tokens.splice(0, unitIndex + 1);

        return rawUnits;
    }

    addItem = () => {
        var text = sanitize(this.state.newIngredient);
        var tokens = text.split(" ");

        // First parse out the number on the left side, if any
        var number = parseQuantity(tokens);

        // Now find raw units, if any
        var rawUnits = parseUnits(tokens);

        // Now assume the rest of the tokens are the ingredient
        var ingredient;
        if (tokens.length) ingredient = tokens.join(" ");
        else ingredient = null;

        // If we missed a unit, we can see if the first word after the number
        // is the units, not part of the ingredient
        var backupUnits, backupIngredient;
        if (tokens.length >= 2) {
            backupUnits = tokens[0];
            tokens.shift();
            backupIngredient = tokens.join(" ");
        }

        if (ingredient == null) {
            console.warn("Didn't recognize this as a pantry item.");
            this.setState({
                addDialogVisible: false
            });
            return;
        }

        // Find ingredient in DB and figure out which units to store it in
        // Start with assuming the user tried units we're familiar with
        var standardUnits = null;
        ingrMappings.doc(ingredient).get().then(function(doc) {
            if (!doc.exists) {
                console.warn("Ingredient " + ingredient + " not found.");
            }
            else {
                standardUnits = doc.data().unit;
            }
        });

        var standardQuantity = null;
        try {
            if (standardUnits == null) {
                throw "Ingredient not found";
            }
            // Perform the unit conversion assuming we know the units
            if (rawUnits == standardUnits) {
                standardQuantity = number;
            }
            else {
                // We might have to do a conversion. See if we can.
                var conversion = math.unit(number + " " + rawUnits)
                    .toNumber(standardUnits);
                standardQuantity = conversion;
            }
        }
        catch (err) {
            // These units aren't standard for pantries (e.g. clove).
            // We know we failed to recognize this unit of measurement.
            // Use backups and hope this random word is appropriate.
            if (backupUnits) {
                ingrMappings.doc(backupIngredient).get().then(function(doc) {
                    if (!doc.exists) {
                        console.warn("Ingredient " + ingredient +
                            " not found.");
                    }
                    else {
                        standardUnits = doc.data().unit;
                    }
                });

                // The units match (e.g. clove)
                if (backupUnits == standardUnits) {
                    standardQuantity = number;
                    ingredient = backupIngredient;
                }
                else {
                    console.warn("Can't compare " + backupUnits +
                        " to " + standardUnits);
                }
            }
        }

        if (standardQuantity) {
            // We successfully identified units for this ingredient
            addPantryItem(
                ingredient,
                standardQuantity,
                standardUnits,
                this.props.userID
            );
        }

        this.setState({
            addDialogVisible: false
        });
    }

    componentWillMount() {
        this.props.beginPantryFetch(this.props.userID);
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View style={[styles.headerContainer]}>
                    <Text style={[styles.header]}>Items:</Text>
                </View>
                <FlatList
                    style={[styles.list]}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.props.pantry}
                    renderItem={({item}) => {
                        return <View style={[styles.listItem]}>
                            <Text style={{padding: 10}}>
                                {item.amount} {item.unit} {item.title}
                            </Text>
                        </View>
                    }}
                />
                <ActionButton
                    buttonColor={BUTTON_BACKGROUND_COLOR}
                    renderIcon={active => {
                        if (!active)
                            return (
                                <Icon
                                    name="md-create"
                                    style={styles.actionButtonIcon}
                                />
                            );
                        else
                            return (
                                <Icon
                                    name="md-add"
                                    style={styles.actionButtonIcon}
                                />
                            );
                    }}
                >
                    <ActionButton.Item
                        buttonColor={ACTION_BUTTON_COLOR}
                        title="New Item"
                        onPress={
                        () => this.setState(
                            {addDialogVisible: true}
                        )
                    }>
                        <Icon
                            name="md-add"
                            style={styles.actionButtonIcon}
                        />
                    </ActionButton.Item>
                    <ActionButton.Item
                        buttonColor={ACTION_BUTTON_COLOR}
                        title="Edit Items"
                        onPress={() => console.warn("edit tapped!")}
                    >
                        <Icon
                            name="md-create"
                            style={styles.actionButtonIcon}
                        />
                    </ActionButton.Item>
                </ActionButton>
                <Dialog
                    width={0.8}
                    visible={this.state.addDialogVisible}
                    onTouchOutside={() => {
                        this.setState({ addDialogVisible: false });
                    }}
                    dialogTitle={
                        <DialogTitle
                            style={[styles.dialogTitleContainer]}
                            textStyle={[styles.dialogTitleText]}
                            title="Add Item"
                        />
                    }
                    footer={
                    <DialogFooter>
                        <DialogButton
                            style={[styles.dialogButtonContainer]}
                            textStyle={[styles.dialogButtonText]}
                            text="Cancel"
                            onPress={() => {
                                this.setState({
                                    addDialogVisible: false
                                });
                            }}
                        />
                        <DialogButton
                            style={[styles.dialogButtonContainer]}
                            textStyle={[styles.dialogButtonText]}
                            text="Add Item"
                            onPress={
                                () => {
                                    this.addItem();
                                }
                            }
                        />
                    </DialogFooter>
                    }
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                        useNativeDriver: true
                    })}
                >
                    <DialogContent>
                        <RkTextInput
                            placeholder = "one carton of eggs"
                            labelStyle={styles.text}
                            style={styles.textInput}
                            onChangeText={
                                ingredient => this.setState(
                                    { newIngredient: ingredient }
                                )
                            }
                            value={this.state.newIngredient}
                        />
                    </DialogContent>
                </Dialog>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: BACKGROUND_COLOR,
        paddingBottom: 25
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    list: {
        flex: 1,
        flexDirection: "column",
    },
    popupHeader: {
        fontFamily: DEFAULT_FONT,
        fontSize: 20,
    },
    header: {
        fontFamily: DEFAULT_FONT,
        fontSize: 25,
        margin: 10,
    },
    headerContainer: {
        borderColor: "lightgrey",
        borderBottomWidth: 2
    },
    listItem: {
        flex: 1,
        height: 50,
        borderColor: "lightgrey",
        borderBottomWidth: 2
    },
    dialogButtonContainer: {
        backgroundColor: BUTTON_BACKGROUND_COLOR,
    },
    dialogButtonText: {
        color: "white",
        fontFamily: DEFAULT_FONT
    },
    dialogTitleContainer: {
        backgroundColor: BUTTON_BACKGROUND_COLOR
    },
    dialogTitleText: {
        color: "white",
        fontFamily: DEFAULT_FONT,
        fontSize: 25
    }
})

const mapStateToProps = state => {
    return {
        pantry: state.pantry,
        userID: state.userInfo.userID
    }
}

export default connect(
    mapStateToProps,
    {
        beginPantryFetch: beginPantryFetch
    }
)(Pantry);
