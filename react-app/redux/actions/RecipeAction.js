export const READY_TO_GO_UPDATED = "READY_TO_GO_UPDATED";
export const RECOMMENDED_UPDATED = "RECOMMENDED_UPDATED";
export const RECENT_UPDATED = "RECENT_UPDATED";
import firebase from 'react-native-firebase';

/**
 * readyToGoRef Reference to the ready to go recipes collection in firestore.
 * 
 * ! Note: Currently pointing at all recipes as discover has not been setup
 */
const readyToGoRef = firebase.firestore().collection('recipes');
/**
 * recommendedRecipesRef Reference to the recommended recipes collection in firestore.
 * 
 * ! Note: Currently pointing at all recipes as recommended has not been setup
 */
const recommendedRecipesRef = firebase.firestore().collection('recipes');
/**
 * recentRecipesRef Reference to the recent recipes collection in firestore.
 * 
 * ! Note: Currently pointing at all recipes as recent has not been setup
 */
const recentRecipesRef = firebase.firestore().collection('recipes');


/**
 * beginReadyToGo function that listens on ready to go recipe collection
 * to get the recipes that a user has all of the ingredients for and
 * returns them all as an array everytime they are updated.
 */
export const beginReadyToGoFetch = () => async dispatch => {
    readyToGoRef.onSnapshot(snapshot => {
        var recipes = [];
        var index;
        var allDocs = snapshot.docs;
        for (index = 0; index < allDocs.length; ++index) {
            recipes.push({
                images: allDocs[index].get("images"), 
                servings: allDocs[index].get("servings"), 
                timeHour: allDocs[index].get("time.hour"),
                timeMinute: allDocs[index].get("time.minute"),
                title: allDocs[index].get("title")
            })
        }
        dispatch({
            type: READY_TO_GO_UPDATED,
            payload: recipes
        });
    })
}

/**
 * beginRecommendedRecipesFetch function that listens on recommended recipe
 * collection to get the recipes that are recommended for the user.
 * 
 * ! Note: Currently is reading from a 'recommended' reference,
 * ! but needs to be updated to be pointing to the shortlist and querying.
 */
export const beginRecommendedRecipesFetch = () => async dispatch => {
    recommendedRecipesRef.onSnapshot(snapshot => {
        var recipes = [];
        var index;
        var allDocs = snapshot.docs;
        for (index = 0; index < allDocs.length; ++index) {
            recipes.push({
                images: allDocs[index].get("images"), 
                servings: allDocs[index].get("servings"), 
                timeHour: allDocs[index].get("time.hour"),
                timeMinute: allDocs[index].get("time.minute"),
                title: allDocs[index].get("title")
            })
        }
        dispatch({
            type: RECOMMENDED_UPDATED,
            payload: recipes
        });
    })
}

/**
 * beginRecentRecipesFetch function that listens on recent recipe
 * collection to get the recipes that a user has interacted with recently.
 * ! Note: Currently is reading from a 'recent' reference,
 * ! but needs to be updated to be pointing to the shortlist and querying.
 */
export const beginRecentRecipesFetch = () => async dispatch => {
    recentRecipesRef.onSnapshot(snapshot => {
        var recipes = [];
        var index;
        var allDocs = snapshot.docs;
        for (index = 0; index < allDocs.length; ++index) {
            recipes.push({
                images: allDocs[index].get("images"), 
                servings: allDocs[index].get("servings"), 
                timeHour: allDocs[index].get("time.hour"),
                timeMinute: allDocs[index].get("time.minute"),
                title: allDocs[index].get("title")
            })
        }
        console.warn(recipes);
        dispatch({
            type: RECENT_UPDATED,
            payload: recipes
        });
    })
}