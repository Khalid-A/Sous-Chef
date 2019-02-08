import React from 'react';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors'
import { StyleSheet, Image, Text, View, ScrollView, FlatList } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { beginRecipePreviewFetch } from '../redux/actions/RecipeAction';
import { connect } from 'react-redux';

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
        this.state = { recipeID: this.props.navigation.state.id };
    }

    componentDidMount() {
        var data = beginRecipePreviewFetch();
        this.setState({
            image: data.images ? data.images.trim() : "",
            ingredients: data.ingredients,
            servings: data.servings,
            time: data.time,
            title: data.title
        });
    }

    render() {
        return (
            <View style={[styles.container]}>
                // Page header
                <Text style={[styles.sectionHeader]}>{this.state.title}</Text>

                // image
                <Image source={this.state.image}
                    style={[styles.image]}/>

                // List of ingredients
                // TODO: https://www.npmjs.com/package/react-native-swipe-list-view
                <FlatList
                    style={[styles.section]}
                    data={this.state.ingredients}
                    renderItem={({item}) => {
                        return (
                            <View style={[styles.listItem]}>
                                <View style={[styles.ingredientQuantity]}>
                                    <Text>{item.quantity} {item.unit}</Text>
                                </View>
                                <View style={[styles.ingredientName]}>
                                    <Text>{item.ingredient}</Text>
                                </View>
                            </View>
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
        fontFamily: "Avenir Next",
        fontSize: 15,
        margin: 3
    },
    ingredientQuantity: {
        fontWeight: bold,
        fontSize: 10
    },
    ingredientName: {
    }
});
