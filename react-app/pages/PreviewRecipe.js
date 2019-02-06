import React from 'react';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors'
import { StyleSheet, Image, Text, View, ScrollView, FlatList } from 'react-native';
import { beginRecipePreviewFetch } from '../redux/actions/RecipeAction';
import { connect } from 'react-redux';

class PreviewRecipe extends React.Component {
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
        this.state = { recipeID: this.props.navigation.state.recipeID };
    }

    render() {
        return (

        )
    }

    componentDidMount() {
        var data = beginRecipePreviewFetch();
        var data = this.getData();
        this.setState({
            images: data.images,
            ingredients: data.ingredients,
            servings: data.servings,
            time: data.time,
            title: data.title
        });
    }
}
