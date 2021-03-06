import React from 'react';
import { BUTTON_BACKGROUND_COLOR, DEFAULT_FONT} from '../common/SousChefColors';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import SousChefCardSearch from '../components/SousChefCardSearch';
import {
    beginSearchRecipesFetch,
    beginRandomRecipesFetch,
} from '../redux/actions/RecipeAction';
import { connect } from 'react-redux';
import { RkTextInput } from 'react-native-ui-kitten';
import globalStyle from '../common/SousChefTheme';

class SearchRecipes extends React.Component {
    static navigationOptions = {
        title: "Search",
        headerVisible: true,
        headerTintColor: "white",
        headerStyle: {
            backgroundColor: BUTTON_BACKGROUND_COLOR,
        },
        headerTitleStyle: {
            fontFamily: DEFAULT_FONT,
            fontSize: 35
        },
    }
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            displaySearchText: '',
            searchRecipes: [],
        };
    }

    componentWillMount() {
        var searchText = this.props.navigation.getParam("searchQuery")
        this.props.beginSearchRecipesFetch(searchText)
        this.props.beginRandomRecipesFetch()

        this.setState({
            searchQuery: searchText,
            displaySearchText: 'Results: \"' + searchText.trim() + '\"'
        })
    }

    searchPressed = () => {
        var searchQuery = this.state.searchQuery.trim()
        if (searchQuery != '') {
            this.props.beginSearchRecipesFetch(searchQuery)
        }
    }

    componentWillReceiveProps = (nextProps, nextState) => {
        if (nextProps.searchRecipes.length == 0) {
            this.setState({
                searchRecipes: this.props.randomRecipes,
                displaySearchText: 'No Results: \"' + this.state.searchQuery.trim() + '\"'
            })
        } else {
            this.setState({
                searchRecipes: this.props.searchRecipes,
                displaySearchText: 'Results: \"' + this.state.searchQuery.trim() + '\"'
            })
        }
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View 
                    style={{
                        margin: 5,
                        alignItems: 'center',
                        flexDirection: 'row',
                        width: Dimensions.get('window').width - 70
                    }}
                >
                    <RkTextInput
                        rkType="clear"
                        placeholder={'cookies'}
                        label={'Search:'}
                        onChangeText={searchQuery => this.setState({
                            searchQuery: searchQuery
                        })}
                        labelStyle={globalStyle.textInputLabelSearch}
                        style={globalStyle.textInputSearch}
                        autoCapitalize="none"
                        value={this.props.value}
                    />
                    <Icon
                        name="search"
                        style={globalStyle.actionButtonIconSearch}
                        onPress={() => {this.searchPressed()}}
                        raised = {true}
                        color={BUTTON_BACKGROUND_COLOR}
                        reverseColor={'white'}
                    />
                </View>
                <View style={[styles.sectionContainer]}>
                    <Text style={[styles.sectionHeader]}>
                        {this.state.displaySearchText}
                    </Text>
                    <FlatList
                        style={[styles.section]}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.searchRecipes}
                        renderItem={({item}) => {
                            return (
                                <TouchableOpacity 
                                    onPress={() => {
                                        this.props.navigation.navigate(
                                            "PreviewRecipe", 
                                            {recipeID: item.id}
                                        );
                                    }}
                                >
                                    <SousChefCardSearch
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
                                </TouchableOpacity>
                            );
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
        paddingBottom: 10
    },
    section: {
        flex: 1,
        flexDirection: "column"
    },
    sectionHeader: {
        fontFamily: DEFAULT_FONT,
        fontSize: 20,
        margin: 10
    },
    sectionContainer: {
        flex: 1,
    },
})

const mapStateToProps = state => {
    return {
        searchRecipes: state.searchRecipes,
        randomRecipes: state.randomRecipes,
        userID: state.userInfo.userID,
    }
}

export default connect(
    mapStateToProps,
    {
        beginSearchRecipesFetch: beginSearchRecipesFetch,
        beginRandomRecipesFetch: beginRandomRecipesFetch,
    }
)(SearchRecipes);
