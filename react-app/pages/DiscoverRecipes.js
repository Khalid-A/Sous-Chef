import React from 'react';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors'
import { StyleSheet, Image, Text, View, ScrollView, FlatList } from 'react-native';
import SousChefCard from '../components/SousChefCard';
import { beginReadyToGoFetch, beginRecentRecipesFetch, beginRecommendedRecipesFetch } from '../redux/actions/RecipeAction';
import { connect } from 'react-redux';

class DiscoverRecipes extends React.Component {
    static navigationOptions = {
        title:"Find A Recipe",
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
            readyToGo: [
                {
                    title: "Avocado Toast",
                    time: "10m",
                    servings: "1",
                    image: "https://img1.cookinglight.timeinc.net/sites/default/files/styles/medium_2x/public/image/2018/07/main/1807w-avocado-toast-recipe.jpg?itok=_dDi7ZQQ"
                },
                {
                    title: "Bananas Foster",
                    time: "40m",
                    servings: "4",
                    image: "https://static01.nyt.com/images/2017/01/20/dining/20COOKING-BANANAS-FOSTER2/20COOKING-BANANAS-FOSTER2-articleLarge.jpg"
                },
                {
                    title: "Bananas Foster",
                    time: "40m",
                    servings: "4",
                    image: "https://static01.nyt.com/images/2017/01/20/dining/20COOKING-BANANAS-FOSTER2/20COOKING-BANANAS-FOSTER2-articleLarge.jpg"
                }
            ],
            recent: [
                {
                    title: "Just Poop",
                    time: "5m",
                    servings: "0",
                    image: "https://cdn.shopify.com/s/files/1/1061/1924/products/Poop_Emoji_7b204f05-eec6-4496-91b1-351acc03d2c7_large.png?v=1480481059"
                }
            ],
            recommended: [
                {
                    title: "Just Poop - Eat It Already",
                    time: "5m",
                    servings: "0",
                    image: "https://cdn.shopify.com/s/files/1/1061/1924/products/Poop_Emoji_7b204f05-eec6-4496-91b1-351acc03d2c7_large.png?v=1480481059"
                }
            ]
        };
    }

    componentWillMount() {
        this.props.beginReadyToGoFetch();
        this.props.beginRecentRecipesFetch();
        this.props.beginRecommendedRecipesFetch();
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View style={[styles.sectionContainer]}>
                    <Text style={[styles.sectionHeader]}>Ready To Go</Text>
                    <FlatList 
                        style={[styles.section]}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal= {true}
                        data={this.state.readyToGo}
                        renderItem={({item}) => {
                            return <SousChefCard 
                                headerText={item.title} 
                                bodyText={
                                    "Time: " + 
                                    item.time + 
                                    "\n" + 
                                    "Serving Size: " + 
                                    item.servings
                                }
                                imagePath={item.image}
                            />
                        }}
                    />
                </View>
                <View style={[styles.sectionContainer]}>
                    <Text style={[styles.sectionHeader]}>Recent</Text>
                    <FlatList 
                        style={[styles.section]}
                        horizontal= {true}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.recent}
                        renderItem={({item}) => {
                            return <SousChefCard 
                                headerText={item.title} 
                                bodyText={
                                    "Time: " + 
                                    item.time + 
                                    "\n" + 
                                    "Serving Size: " + 
                                    item.servings
                                }
                                imagePath={item.image}
                            />
                        }}
                    />
                </View>
                <View style={[styles.sectionContainer]}>
                    <Text style={[styles.sectionHeader]}>Recommended</Text>
                    <FlatList 
                        style={[styles.section]}
                        horizontal= {true}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.recommended}
                        renderItem={({item}) => {
                            return <SousChefCard 
                                headerText={item.title} 
                                bodyText={
                                    "Time: " + 
                                    item.time + 
                                    "\n" + 
                                    "Serving Size: " + 
                                    item.servings
                                }
                                imagePath={item.image}
                            />
                        }}
                    />
                </View>
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
    }
})

const mapStateToProps = state => {
    return {
        readyToGo: state.readyToGoRecipes,
        recommended: state.recommendedRecipes,
        recent: state.recentRecipes
    }
}

export default connect(
    mapStateToProps,
    {
        beginReadyToGoFetch: beginReadyToGoFetch,
        beginRecentRecipesFetch: beginRecentRecipesFetch,
        beginRecommendedRecipesFetch: beginRecommendedRecipesFetch
    }
)(DiscoverRecipes);