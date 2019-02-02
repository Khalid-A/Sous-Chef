import React from 'react';
import {BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR} from '../common/SousChefColors'
import { StyleSheet, Image, Text, View, ScrollView } from 'react-native';
import SousChefCard from '../components/SousChefCard';

export default class DiscoverRecipes extends React.Component {
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

    render() {
        return (
            <View style={[styles.container]}>
                <View style={[styles.sectionContainer]}>
                    <Text style={[styles.sectionHeader]}>Ready To Go</Text>
                    <View style={[styles.section]}>
                        {
                            this.state.readyToGo.map((recipe, i) => (
                                <SousChefCard key={i} headerText={recipe.title} bodyText={"Time: " + recipe.time + "\n" + "Serving Size: " + recipe.servings} imagePath={recipe.image}/>
                            ))
                        }
                    </View>
                </View>
                <View style={[styles.sectionContainer]}>
                    <Text style={[styles.sectionHeader]}>Recent</Text>
                    <View style={[styles.section]}>
                        {
                            this.state.recent.map((recipe, i) => (
                                <SousChefCard key={i} headerText={recipe.title} bodyText={"Time: " + recipe.time + "\n" + "Serving Size: " + recipe.servings} imagePath={recipe.image}/>
                            ))
                        }
                    </View>
                </View>
                <View style={[styles.sectionContainer]}>
                    <Text style={[styles.sectionHeader]}>Recommended</Text>
                    <View style={[styles.section]}>
                        {
                            this.state.recommended.map((recipe, i) => (
                                <SousChefCard key={i} headerText={recipe.title} bodyText={"Time: " + recipe.time + "\n" + "Serving Size: " + recipe.servings} imagePath={recipe.image}/>
                            ))
                        }
                    </View>
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