import React from 'react';
import { BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR } from '../common/SousChefColors';
import { StyleSheet, Button, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import SousChefCard from '../components/SousChefCard';
import SousChefTextInput from './../components/SousChefTextInput';
import { beginSearchRecipesFetch } from '../redux/actions/RecipeAction';
import { connect } from 'react-redux';

class SearchRecipes extends React.Component {
    static navigationOptions = {
        title: "Search",
        headerVisible: true,
        headerTintColor: "white",
        headerStyle: {
            backgroundColor: BUTTON_BACKGROUND_COLOR,
        },
        headerTitleStyle: {
            fontFamily: "Avenir Next",
            fontSize: 35
        },
    }
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            displaySearchText: '',
        };
    }

    componentWillMount() {
        var searchText = this.props.navigation.getParam("searchQuery")
        this.props.beginSearchRecipesFetch(searchText)
        this.setState({
            searchQuery: searchText,
            displaySearchText: 'Results: \"' + searchText + '\"'
        })
    }

    searchPressed = () => {
        var searchQuery = this.state.searchQuery
        if (searchQuery != '') {
            this.props.beginSearchRecipesFetch(searchQuery)
        }
    }

    componentWillReceiveProps = (prevProps, prevState) => {
        if (prevProps.searchRecipesFound) {
            this.setState({
                displaySearchText: 'Results: \"' + this.state.searchQuery + '\"'
            })
        } else {
            this.setState({
                displaySearchText: 'No Results: \"' + this.state.searchQuery + '\"'
            })
        }
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View>
                    <SousChefTextInput
                        placeholder={'bread'}
                        label={'Search:'}
                        onChangeText={searchQuery => this.setState({ 
                            searchQuery: searchQuery
                        })}
                        value={this.state.searchQuery}
                    />
                    <ActionButton 
                        buttonColor={BUTTON_BACKGROUND_COLOR} 
                        onPress={() => {this.searchPressed()}}
                        renderIcon={active => {
                            return (
                                <Icon 
                                    name="md-search" 
                                    style={styles.actionButtonIcon}
                                />
                            );
                        }}
                    />
                </View>
                <View style={[styles.sectionContainer]}>
                    <Text style={[styles.sectionHeader]}>
                        {this.state.displaySearchText} 
                    </Text>
                    <FlatList
                        style={[styles.section]}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.props.searchRecipes}
                        renderItem={({item}) => {
                            return (<TouchableOpacity onPress={() => {
                                this.props.navigation.navigate("PreviewRecipe", {recipeID: item.id, userID: this.props.userID});
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
        flexDirection: "column"
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
        searchRecipesFound: state.searchRecipesFound[0],
        searchRecipes: state.searchRecipes,
        userID: state.userInfo.userID,
    }
}

export default connect(
    mapStateToProps,
    {
        beginSearchRecipesFetch: beginSearchRecipesFetch,
    }
)(SearchRecipes);
