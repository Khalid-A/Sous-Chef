import React from 'react';
import {
    BUTTON_BACKGROUND_COLOR, 
    BACKGROUND_COLOR,
    ACTION_BUTTON_COLOR
} from '../common/SousChefColors'
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { beginGroceryListFetch, addGroceryListItem } from '../redux/actions/GroceryListAction';
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

const defaultState = {
    addDialogVisible : false, 
    newIngredient: "", 
    pickedValue: ["1", ""],
    pickerVisible: false
};

class GroceryList extends React.Component {
    static navigationOptions = {
        title:"Grocery List",
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
        drawerLabel: 'Grocery List'
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
        ["", "cups", "tablespoons", "oz", "grams", "kg", "teaspoons"]
    ];

    addItem = () => {
        addGroceryListItem(
            this.state.newIngredient, 
            parseInt(this.state.pickedValue[0]),
            this.state.pickedValue[1], 
            this.props.userID
        );
        this.setState({
            addDialogVisible: false
        })
    }

    componentWillMount() {
        this.props.beginGroceryListFetch(this.props.userID);
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
                    data={this.props.groceryList}
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
                                ingredient => this.setState(
                                    { newIngredient: ingredient }
                                )
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
                            {this.state.pickedValue[0]}{" "}
                            {this.state.pickedValue[1]}
                        </RkButton>
                    </DialogContent>
                </Dialog>
                <RkPicker
                    title='Select Amount'
                    data={this.measurementData}
                    visible={this.state.pickerVisible}
                    selectedOptions={this.state.pickedValue}
                    onConfirm={(data) => {
                        this.setState(
                            {
                                pickedValue: [data[0].value, data[1]]
                            }
                        )
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
        groceryList: state.groceryList,
        userID: state.userInfo.userID
    }
}

export default connect(
    mapStateToProps,
    {
        beginGroceryListFetch: beginGroceryListFetch
    }
)(GroceryList);