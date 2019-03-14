import React from 'react';
import { BUTTON_BACKGROUND_COLOR, BACKGROUND_COLOR, DEFAULT_FONT} from '../common/SousChefColors';
import { StyleSheet, Button, Text, View, ScrollView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import ActionButton from 'react-native-action-button';
import { Icon } from 'react-native-elements';
import SousChefCardSearch from '../components/SousChefCardSearch';
import SousChefTextInput from './../components/SousChefTextInput';
import { beginSearchRecipesFetch, beginRandomRecipesFetch } from '../redux/actions/RecipeAction';
import { connect } from 'react-redux';
import { RkTextInput } from 'react-native-ui-kitten';

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
            return
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
              <View style={{margin:5, alignItems:'center', flexDirection:'row', width: Dimensions.get('window').width - 70}}>
                <RkTextInput
                        rkType="clear"
                        placeholder={'chicken'}
                        label={'Search:'}
                        onChangeText={searchQuery => this.setState({
                            searchQuery: searchQuery
                        })}
                        labelStyle={styles.textInputLabel}
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={this.props.value}
                        inputStyle={{
                          color: '#1d945b',
                          fontSize: 20,
                        }}
                />
                <Icon
                    name="search"
                    style={styles.actionButtonIcon}
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
                            return (<TouchableOpacity onPress={() => {
                                this.props.navigation.navigate("PreviewRecipe", {recipeID: item.id});
                            }}>
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
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: BUTTON_BACKGROUND_COLOR,
        flex: 2,
    },
    textInputLabel: {
      fontSize: 20,
      fontFamily: DEFAULT_FONT,
      // margin: 5,
      fontWeight: 'bold',
      color: BUTTON_BACKGROUND_COLOR,
    },
    textInput: {
        borderBottomColor: BACKGROUND_COLOR,
        borderBottomWidth: 1,
        // color: 'red',
        fontSize: 20,
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
