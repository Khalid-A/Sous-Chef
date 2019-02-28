import React from 'react';
import { BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR } from '../common/SousChefColors'
import { StyleSheet, Button, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import SousChefCard from '../components/SousChefCard';
import { beginReadyToGoFetch, beginRecentRecipesFetch, beginRecommendedRecipesFetch } from '../redux/actions/RecipeAction';
import { connect } from 'react-redux';

class DiscoverRecipes extends React.Component {
    static navigationOptions = {
        title: "Discover",
        headerVisible: true,
        headerTintColor: "white",
        headerStyle: {
            backgroundColor: BUTTON_BACKGROUND_COLOR,
        },
        headerTitleStyle: {
            fontFamily: "Avenir Next",
            fontSize: 35
        },
        drawerLabel: 'Discover'
    }
    constructor(props) {
        super(props);
        this.state = {};
    }

    drawerOpen = () => {this.props.navigation.openDrawer();}

    componentWillMount() {
        this.props.beginReadyToGoFetch(this.props.userID);
        this.props.beginRecentRecipesFetch(this.props.userID);
        this.props.beginRecommendedRecipesFetch(this.props.userID);
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
                        data={this.props.readyToGo}
                        renderItem={({item}) => {
                            return (<TouchableOpacity onPress={() => {
                                this.props.navigation.navigate("CookNow", {recipeID: item.id});
                            }}>
                                <SousChefCard
                                    headerText={item.title}
                                    bodyText={
                                        "Time: " +
                                        (item.timeHour == "0" ? "" : item.timeHour + "h") +
                                        (item.timeMinute == "0" ? "" : item.timeMinute + "m") +
                                        "\n" +
                                        "Serving Size: " +
                                        item.servings
                                    }
                                    imagePath={item.images}
                                    onPress={() => navigate('PreviewRecipe', {id: item.id})}
                                />
                            </TouchableOpacity>);
                        }}
                    />
                </View>
                <View style={[styles.sectionContainer]}>
                    <Text style={[styles.sectionHeader]}>Recent</Text>
                    <FlatList
                        style={[styles.section]}
                        horizontal= {true}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.props.recent}
                        renderItem={({item}) => {
                            return (<TouchableOpacity onPress={() => {
                                this.props.navigation.navigate("CookNow", {recipeID: item.id});
                            }}>
                                <SousChefCard
                                    headerText={item.title}
                                    bodyText={
                                        "Time: " +
                                        (item.timeHour == "0" ? "" : item.timeHour + "h") +
                                        (item.timeMinute == "0" ? "" : item.timeMinute + "m") +
                                        "\n" +
                                        "Serving Size: " +
                                        item.servings
                                    }
                                    imagePath={item.images}
                                    onPress={() => navigate('PreviewRecipe', {id: item.id})}
                                />
                            </TouchableOpacity>);
                        }}
                    />
                </View>
                <View style={[styles.sectionContainer]}>
                    <Text style={[styles.sectionHeader]}>Recommended</Text>
                    <FlatList
                        style={[styles.section]}
                        horizontal= {true}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.props.recommended}
                        renderItem={({item}) => {
                            return (<TouchableOpacity onPress={() => {
                                this.props.navigation.navigate("CookNow", {recipeID: item.id});
                            }}>
                                <SousChefCard
                                    headerText={item.title}
                                    bodyText={
                                        "Time: " +
                                        (item.timeHour == "0" ? "" : item.timeHour + "h") +
                                        (item.timeMinute == "0" ? "" : item.timeMinute + "m") +
                                        "\n" +
                                        "Serving Size: " +
                                        item.servings
                                    }
                                    imagePath={item.images}
                                    onPress={() => navigate('PreviewRecipe', {id: item.id})}
                                />
                            </TouchableOpacity>);
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
        recent: state.recentRecipes,
        userID: state.userInfo.userID,
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
