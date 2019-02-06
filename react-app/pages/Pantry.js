import React from 'react';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors'
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import {beginPantryFetch} from '../redux/actions/PantryAction';
import { connect } from 'react-redux';
import {DEFAULT_FONT} from '../common/SousChefTheme';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

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
        }
    }
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this.props.beginPantryFetch("test-userid");
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
                <ActionButton buttonColor={BUTTON_BACKGROUND_COLOR} renderIcon={active => {
                    if (!active)
                        return (
                            <Icon name="md-create" style={styles.actionButtonIcon}/>
                        );
                    else
                        return (
                            <Icon name="md-add" style={styles.actionButtonIcon}/>
                        );
                }}>
                    <ActionButton.Item buttonColor='#9b59b6' title="New Item" onPress={() => console.log("notes tapped!")}>
                        <Icon name="md-add" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#9b59b6' title="Edit Items" onPress={() => console.log("notes tapped!")}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
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
})

const mapStateToProps = state => {
    return {
        pantry: state.pantry
    }
}

export default connect(
    mapStateToProps,
    {
        beginPantryFetch: beginPantryFetch
    }
)(Pantry);