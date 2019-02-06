export const CLEAR_READY_TO_GO = "CLEAR_READY_TO_GO";
export const READY_TO_GO_ADD = "READY_TO_GO_ADD";

export const CLEAR_RECOMMENDED = "CLEAR_RECOMMENDED";
export const ADD_RECOMMENDED = "ADD_RECOMMENDED";

export const CLEAR_RECENT = "CLEAR_RECENT";
export const ADD_RECENT = "ADD_RECENT";

import firebase from 'react-native-firebase';

/**
 * recipesRef Reference to the all recipes collection in firestore.
 */
const recipesRef = firebase.firestore().collection('recipes');

/**
 * relevantRecipesRef Collection reference to the relevant recipes collection
 * in firestore.
 */
const relevantRecipesRef = firebase.firestore().collection('relevantrecipes');

/**
 * relevantRecipesQuery The query that will match against the user to get their
 * relevant recipe list.
 * ! NOTE: This needs to be updated to be contained within the listen functions
 * ! below and to take in the active user id. This requires merging with
 * ! Sarah's work on authentication.
 */
const relevantRecipesQuery = relevantRecipesRef.where("userID", "=", "test-user");

/**
 * Query that will retrieve a recipe
 */
const recipePreviewQuery = (id) => recipesRef.where("id", "=", id).limit(1)

/**
 * relevantRecipeUpdate is a general purpose thunk that given a snapshot from
 * relevantrecipes collection in firestore, will check if that snapshot has
 * recipes that have recipeFieldToCheck field set to true, and then grabbing
 * the respective recipes from the recipe collection and updating the store.
 *
 * @param {string} recipeFieldToCheck The field inside the relevant recipes
 * document to check against to see if the recipe is a match for the desired
 * category.
 * @param {function} dispatch dispatch function for redux
 * @param {string} clear_type The clear action type for the desired category
 * in redux.
 * @param {string} add_type The add action type for the desired category in
 * redux.
 */
const relevantRecipeUpdate = (
    recipeFieldToCheck,
    dispatch,
    clear_type,
    add_type
) => snapshot => {
    snapshot.docs[0].ref.collection("recipes").onSnapshot(snapshot => {
        var index;
        var firstRecipeThrough = true;
        for (index = 0; index < snapshot.docs.length; ++index) {
            var fieldValue = snapshot.docs[index].get(recipeFieldToCheck);
            if (fieldValue == undefined || !fieldValue) {
                continue;
            }
            var callback = ((firstRecipeThrough) => (snapshot) => {
                if (firstRecipeThrough) {
                    dispatch({
                        type: clear_type
                    });
                }
                dispatch({
                    type: add_type,
                    payload: {
                        images: snapshot.docs[0].get("images"),
                        servings: snapshot.docs[0].get("servings"),
                        timeHour: snapshot.docs[0].get("time.hour"),
                        timeMinute: snapshot.docs[0].get("time.minute"),
                        title: snapshot.docs[0].get("title"),
                        recipeID: snapshot.docs[0].get("id")
                    }
                });
            })(firstRecipeThrough);
            recipesRef.where(
                "id",
                "=",
                snapshot.docs[index].get("recipeID")
            ).get().then(callback);
            firstRecipeThrough = false;
        }
        if (firstRecipeThrough) {
            dispatch({
                type: clear_type
            });
        }
    })
}

/**
 * beginReadyToGo function that listens on ready to go recipes
 * to get the recipes that a user has all of the ingredients for.
 */
export const beginReadyToGoFetch = () => async dispatch => {
    relevantRecipesQuery.onSnapshot(
        relevantRecipeUpdate(
            "isReadyToGo", dispatch, CLEAR_READY_TO_GO, READY_TO_GO_ADD
        )
    );
}

/**
 * beginRecommendedRecipesFetch function that listens on recommended recipe
 * collection to get live updates on the users recommendations.
 */
export const beginRecommendedRecipesFetch = () => async dispatch => {
    relevantRecipesQuery.onSnapshot(
        relevantRecipeUpdate(
            "isRecommended", dispatch, CLEAR_RECOMMENDED, ADD_RECOMMENDED
        )
    );
}

/**
 * beginRecentRecipesFetch function that listens on recent recipe
 * collection to get the recipes that a user has interacted with recently.
 */
export const beginRecentRecipesFetch = () => async dispatch => {
    relevantRecipesQuery.onSnapshot(relevantRecipeUpdate(
        "isRecent", dispatch, CLEAR_RECENT, ADD_RECENT
    ));
}

/**
 * Begins retrieval of data related to previewing a recipe.
 * Note: This is not a redux function.
 * @param {string} id The recipe GUID.
 */
export const beginRecipePreviewFetch = (id) => async dispatch => {
    return recipePreviewQuery(id);
}
