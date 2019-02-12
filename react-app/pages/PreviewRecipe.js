import React from 'react';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors'
import { StyleSheet, Image, Text, View, ScrollView, FlatList } from 'react-native';
import firebase from 'react-native-firebase';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { beginRecipePreviewFetch } from '../redux/actions/RecipeAction';
import { connect } from 'react-redux';

const recipesRef = firebase.firestore().collection('recipes');

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
            recipe: null
        };
    }

    componentWillMount() {
        var recipeID = "0063ec25-5e33-4a59-9a52-ecd090c3fcad";

        recipesRef.doc(recipeID).get().then((doc) => {
            this.setState({recipe: doc.data()});
            console.log("----------INGREDIENTS-------------");
            console.log(doc.data());
        })
        .catch(function(error) {
            console.warn("Error getting documents: ", error);
        });
    }
    // TODO: https://www.npmjs.com/package/react-native-swipe-list-view
    render() {
        if (this.state.recipe) {
            return (
                <View style={[styles.container]}>
                    <Text style={[styles.sectionHeader]}>{this.state.title ? this.state.title : "unknown"}</Text>
                    <Image source={this.state.image}
                        style={[styles.image]}/>
                    <FlatList
                        style={[styles.section]}
                        data={this.state.recipe.ingredients}
                        renderItem={({item}) => {
                            return (
                                <View style={[styles.listItem]}>
                                    <View style={[styles.ingredientQuantity]}>
                                        <Text>{item.quantity + " " + item.unit}</Text>
                                    </View>
                                    <View style={[styles.ingredientName]}>
                                        <Text>{item.ingredient ? item.ingredient : "unknown"}</Text>
                                    </View>
                                </View>
                            );
                        }}
                    />

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
        fontFamily: "Avenir Next",
        fontSize: 15,
        margin: 3
    },
    ingredientQuantity: {
        fontWeight: "bold",
        fontSize: 10
    },
    ingredientName: {
    }
});
