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
import convert from 'convert-units';

import firebase from 'react-native-firebase';


const defaultState = {
    addDialogVisible : false, 
    newIngredient: "", 
    newIngredientUnit: "",
    pickedValue: [{value: "1", key: 1}, ""],
    pickerVisible: false,
    unconventionalUnits: false,
    units: [],
    standardUnit: ""
};

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

    measurementData = [
        [{key: 1, value: "1"},
        {key: 2, value: "2"},
        {key: 3, value: "3"},
        {key: 4, value: "4"},
        {key: 5, value: "5"},
        {key: 6, value: "6"},
        {key: 7, value: "7"},
        {key: 8, value: "8"},
        {key: 9, value: "9"},
        {key: 10, value: "10"},],
        convert().possibilities("mass").concat(convert().possibilities("volume"))
    ];

    addItem = () => {
        if (this.state.unconventionalUnits) {
            addPantryItem(
                this.state.newIngredient, 
                parseInt(this.state.pickedValue[0].value),
                this.state.standardUnit,
                this.props.userID
            );
        } else {
            var unitAbbreviation = convert().list().filter((unitEntry) => {
                return unitEntry.singular.toLowerCase() === this.state.pickedValue[1].toLowerCase()
            })[0].abbr;
            var standardUnitAbbreviation = convert().list().filter((unitEntry) => {
                return unitEntry.singular.toLowerCase() === this.state.standardUnit.toLowerCase()
            })[0].abbr;
            addPantryItem(
                this.state.newIngredient,
                convert(parseInt(this.state.pickedValue[0].value)).from(unitAbbreviation).to(standardUnitAbbreviation),
                this.props.userID
            );
        }
        
        this.setState({
            addDialogVisible: false
        })
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
                        <Text 
                            style={[styles.popupHeader]}
                        >
                            Item Name:
                        </Text>
                        <RkTextInput 
                            placeholder = "eggs"
                            labelStyle={styles.text}
                            style={styles.textInput}
                            onChangeText={
                                ingredient => {
                                    this.setState({
                                        newIngredient: ingredient
                                    });
                                    firebase.firestore().collection("standardmappings").doc(ingredient.toLowerCase()).get().then((snapshot) =>{
                                        var unit = snapshot.get("unit");
                                        if (unit == undefined) {
                                            return;
                                        }
                                        var unitList = convert().list().filter((unitEntry) => {
                                            return unitEntry.singular.toLowerCase() === unit.toLowerCase()
                                        });
                                        var units = [];
                                        if (unitList.length == 0) {
                                            units = [unit];
                                        } else {
                                            var unitsPossibility = convert().from(unitList[0].abbr).possibilities();
                                            units = convert().list().filter((unit) => {
                                                return unitsPossibility.includes(unit.abbr);
                                            }).map((value) => {
                                                return value.singular.toLowerCase();
                                            });
                                        }
                                        this.setState({
                                            standardUnit: unit,
                                            units: units,
                                            unconventionalUnits: units.length == 1,
                                            pickedValue: [{key: 1, value: "1"}, unit]
                                        });
                                    }).catch((reason) => {
                                        console.warn(reason);
                                    });
                                }
                            }
                            value={this.state.newIngredient}
                        />
                        <Text style={[styles.popupHeader]}>
                            Quantity:
                        </Text>
                        <RkButton 
                            onPress={
                                () => this.setState({
                                    pickerVisible: true
                                })
                            }
                        >
                            {this.state.pickedValue[0].value}{" "}
                            {this.state.pickedValue[1]}
                        </RkButton>
                    </DialogContent>
                </Dialog>
                <RkPicker
                    title='Select Amount'
                    data={(() => {
                        if (this.state.newIngredient == "" || this.state.units.length == 0) {
                            return this.measurementData
                        }
                        var arrayOfNumbers = new Array(100).fill(0).map(Number.call, Number);
                        var values = arrayOfNumbers.map((number) => {
                            return {key: number, value: number.toString()};
                        });
                        if (this.state.unconventionalUnits) {
                            return [
                                values
                            ];
                        } else {
                            return [
                                values,
                                this.state.units
                            ];
                        }
                    })()}
                    visible={this.state.pickerVisible}
                    selectedOptions={(() => {
                        return this.state.pickedValue
                    })()}
                    onConfirm={(data) => {
                        if (this.state.unconventionalUnits) {
                            var newValue = [data[0], this.state.pickedValue[1]];
                            this.setState({
                                pickedValue: newValue
                            });
                        } else {
                            this.setState({
                                pickedValue: data
                            })
                        }
                        this.setState(
                            {
                                pickerVisible: false
                            }
                        )
                    }}
                    onCancel={
                        () => this.setState({pickerVisible: false})
                    }
                />
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