import React from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import {
    BUTTON_BACKGROUND_COLOR,
    BACKGROUND_COLOR
} from '../common/SousChefColors';
import globalStyle, { DEFAULT_FONT } from '../common/SousChefTheme';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Icon } from 'react-native-elements';
import {
    getIsFavorited,
    saveIsFavorited,
    saveIsRecent,
} from '../redux/actions/FavoritedAction';

class CookNow extends React.Component {
    static navigationOptions = {
        title: "Cook Now",
        headerVisible: true,
        headerTintColor: "white",
        headerTransparent:false,
        headerBackground:(
            <LinearGradient 
                colors={['#17ba6b', '#1d945b']} 
                locations={[0.3, 1]} 
                style={{height: 90}}
            >
                <SafeAreaView style={{flex: 1}}>
                    <StatusBar barStyle="light-content"/>
                </SafeAreaView>
            </LinearGradient>
        ),
        headerTitleStyle: {
            fontFamily: DEFAULT_FONT,
            fontSize: 25,
            textAlign: 'left',
        },
    }

    constructor(props) {
        super(props);
        this.state = {
            recipe: this.props.navigation.getParam("recipe"),
            recipeID: this.props.navigation.getParam("recipe").id,
            index: 0,
            routes: [
                { key: 'Ingredients', title: 'INGREDIENTS' },
                { key: 'Directions', title: 'DIRECTIONS' },
            ],
            isFavorited: null,
        };
        this.listIngredients = this.listIngredients.bind(this);
        this.listDirections = this.listDirections.bind(this);
        this.finishCooking = this.finishCooking.bind(this);
    }

    componentWillMount(){
        this.props.getIsFavorited(
            this.props.userID, 
            this.props.navigation.getParam("recipe").id
        )
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.isFavorited !== this.props.isFavorited) {
            this.setState({isFavorited: nextProps.isFavorited})
        }
    }

    /*
        When finished button is pressed function saves the recipe as favorited 
        if the heart justifyContent was pressed. It adds the recepe to recent 
        recipes. Finally it navigates to the finished page. 
    */
    finishCooking(){
        this.props.saveIsFavorited(
            this.props.userID,
            this.state.recipeID,
            this.state.isFavorited
        )
        this.props.saveIsRecent(this.props.userID, this.state.recipeID)

        this.props.navigation.navigate('Finished', {
            recipeID: this.state.recipe.id,
            ingredientsToRemove: this.props.navigation.getParam("ingredientsToRemove")
        });
    }

    /* 
        The function iterates through the directions and returns each one with 
        its number and then the direction. The result is a numbered list of 
        DIRECTIONS in order. 
    */
    listDirections(){
        if(this.state.recipe.ingredients == null){
            console.warn("ingredients are null");
        }
        return this.state.recipe.directions.map((direction, index) => {
            if(!direction){
                return null;
            }
            return (
                <Text style={styles.detail}>{index+1}. {direction}</Text>
            );
        });
    }

    /* 
        The function iterates through the indredients and outputs a list of 
        ingredients with icons that are bullet points.
    */
    listIngredients(){
        if(!this.state.recipe || !this.state.recipe.ingredients){
            console.warn("null");
        }
        return this.state.recipe.ingredients.map((ingredient) => {
            if(!ingredient.originalText){
                return null;
            }
            return (
                <View 
                    style={{
                        flexDirection: 'row', 
                        justifyContent: 'flex-start', 
                        alignItems: 'center', 
                        marginLeft: 10,
                    }}
                >
                    <Icon
                        name='album'
                        color={BUTTON_BACKGROUND_COLOR}
                        size={10}
                    />
                    <Text style={styles.detail}>
                        {ingredient.originalQuantity} {ingredient.originalText}
                    </Text>
                </View>

            );
        });
    }

    /* Function for tab navigator to render the ingredients. */
    FirstRoute = () => (
        <ScrollView style={{flex: 1, marginBottom: 0,}}>
            {this.listIngredients()}
        </ScrollView>
    );

    /* Function for tab navigator to render the directions. */
    SecondRoute = () => (
        <ScrollView style={{flex: 1, marginBottom: 0,}}>
            {this.listDirections()}
        </ScrollView>
    );

    render() {
        if(this.state.recipe){
            return (
                <View style={styles.container}>
                    <Image
                        source={
                            this.state.recipe.images.trim() == "" ?
                            require("../assets/sousChefLogo.png") :
                            {uri: this.state.recipe.images}
                        }
                        style={[styles.image]}
                        />
                    <Text style={styles.title}>{this.state.recipe.title}</Text>
                    <View style={styles.recipeStats}>
                        <View style={styles.servings}>
                            <Icon
                                name='restaurant'
                                color={BUTTON_BACKGROUND_COLOR}
                            />
                            <Text style={styles.subtitle}>
                                Servings: {"\n"}{this.state.recipe.servings}
                            </Text>
                        </View>
                        <View style={styles.cookTime} >
                            <Icon
                                name='timer'
                                color={BUTTON_BACKGROUND_COLOR}
                            />
                            <Text style={styles.subtitle}>
                                {"Cook Time: \n"}
                                {this.state.recipe.time.hour}
                                {" hours "}
                                {this.state.recipe.time.minute}
                                {" minutes"}
                            </Text>
                        </View>
                        <View style={styles.favorite}>
                            <Icon
                                name={
                                    (this.state.isFavorited) ? 
                                    'favorite' : 
                                    'favorite-border'
                                }
                                color='#17ba6b'
                                onPress={()=>{
                                    this.setState({
                                        isFavorited: !this.state.isFavorited
                                    })
                                }}
                            />
                        </View>
                    </View>

                    <TabView
                        style={{flex: 1,}}
                        navigationState={this.state}
                        renderScene={SceneMap({
                            Ingredients: this.FirstRoute,
                            Directions: this.SecondRoute,
                        })}
                        renderTabBar={props =>
                            <TabBar
                                {...props}
                                indicatorStyle={{
                                    backgroundColor: BUTTON_BACKGROUND_COLOR 
                                }}
                                style={{
                                    backgroundColor: 'white',
                                    color: BUTTON_BACKGROUND_COLOR,
                                }}
                                activeColor = {{
                                    color: BUTTON_BACKGROUND_COLOR,
                                    textColor: BUTTON_BACKGROUND_COLOR,
                                }}
                                inactiveColor = {{}}
                                labelStyle = {{
                                    color: BUTTON_BACKGROUND_COLOR,
                                    fontWeight: 'bold',
                                    fontFamily: 'Avenir',
                                }}
                            />
                        }
                        onIndexChange={index => this.setState({ index })}
                        initialLayout={{ width: Dimensions.get('window').width }}
                    />
                    <LinearGradient 
                        colors={['#17ba6b', '#1d945b']} 
                        locations={[0.3, 1]} 
                        style = {globalStyle.gradientButton}
                    >
                        <TouchableOpacity>
                            <Text 
                                style = {globalStyle.gradientButtonText} 
                                onPress={this.finishCooking}
                            >
                                FINISHED!
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            );
        }
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    detail:{
        fontSize: 15,
        fontFamily: DEFAULT_FONT,
        marginLeft:10,
        marginTop: 5,
        marginBottom:5,

    },
    title: {
        fontSize: 20,
        fontFamily: DEFAULT_FONT,
        margin: 5,
        fontWeight: 'bold',
        color: BUTTON_BACKGROUND_COLOR,

    },
    subtitle: {
        fontSize: 14,
        marginLeft: 5,
        color: 'grey',
    },
    image: {
        height: Dimensions.get('window').height/3.85,
        width: Dimensions.get('window').width,
    },
    recipeStats: {
        flexDirection: 'row',
        paddingBottom: 0,
        marginBottom: 0,
        borderBottomColor: BACKGROUND_COLOR,
        borderBottomWidth: 0.25,
        height: 60,
    },
    servings: {
        width: Dimensions.get('window').width/4,
        height: 60,
        padding:10,
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    cookTime: {
        width: Dimensions.get('window').width/2,
        height: 60,
        padding:10,
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginLeft: 10,
    },
    favorite: {
        width: Dimensions.get('window').width/4,
        height: 60,
        alignItems: 'flex-start',
        flexDirection: 'row',
        paddingTop:10
    },
});

const mapStateToProps = state => {
    return {
        userID: state.userInfo.userID,
        isFavorited: state.favoritedTracker.isFavorited
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getIsFavorited: (userID, recipeID) => {
            dispatch(getIsFavorited(userID, recipeID))
        },
        saveIsFavorited: (userID, recipeID, isFavorited) => {
            saveIsFavorited(userID, recipeID, isFavorited)
        },
        saveIsRecent: (userID, recipeID) => {
            saveIsRecent(userID, recipeID)
        },
    }
}

export default connect(mapStateToProps,  mapDispatchToProps)(CookNow)
