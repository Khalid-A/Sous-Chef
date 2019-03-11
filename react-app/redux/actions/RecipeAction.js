export const CLEAR_READY_TO_GO = "CLEAR_READY_TO_GO";
export const READY_TO_GO_ADD = "READY_TO_GO_ADD";

export const CLEAR_RECOMMENDED = "CLEAR_RECOMMENDED";
export const ADD_RECOMMENDED = "ADD_RECOMMENDED";

export const CLEAR_RECENT = "CLEAR_RECENT";
export const ADD_RECENT = "ADD_RECENT";

export const CLEAR_SEARCH = "CLEAR_SEARCH";
export const ADD_SEARCH = "ADD_SEARCH";

export const CLEAR_RANDOM = "CLEAR_RANDOM";
export const ADD_RANDOM = "ADD_RANDOM";

export const SET_INGREDIENTS_TO_REMOVE = "SET_INGREDIENTS_TO_REMOVE";

export const IS_NOT_FAVORITED = "IS_NOT_FAVORITED";
export const IS_FAVORITED = "IS_FAVORITED";
export const FLIP_FAVORITED = "FLIP_FAVORITED";

import firebase from 'react-native-firebase';

/**
 * recipesRef Reference to the all recipes collection in firestore.
 */
const recipesRef = firebase.firestore().collection('test_recipes');

/**
 * relevantRecipesRef Collection reference to the relevant recipes collection
 * in firestore.
 */
const relevantRecipesRef = firebase.firestore().collection('relevantrecipes');

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
    snapshot.ref.collection("recipes").onSnapshot(snapshot => {
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
                        recipeID: snapshot.docs[0].get("id"),
                        id: snapshot.docs[0].id
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
export const beginReadyToGoFetch = (userID) => async dispatch => {
    relevantRecipesRef.doc(userID).onSnapshot(
        relevantRecipeUpdate(
            "isReadyToGo", dispatch, CLEAR_READY_TO_GO, READY_TO_GO_ADD
        )
    );
}

/**
 * beginRecommendedRecipesFetch function that listens on recommended recipe
 * collection to get live updates on the users recommendations.
 */
export const beginRecommendedRecipesFetch = (userID) => async dispatch => {
    relevantRecipesRef.doc(userID).onSnapshot(
        relevantRecipeUpdate(
            "isRecommended", dispatch, CLEAR_RECOMMENDED, ADD_RECOMMENDED
        )
    );
}

/**
 * Retrieves data related to previewing a recipe.
 * Note: This is not a redux function.
 * @param {string} id The recipe id.
 */
export function beginRecipePreviewFetch(id) {
    var results = {};

    recipesRef.doc(id).get().then(function(doc) {
        results = {
            ...doc.data()
        };
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    return results;
}

/**
 * beginRecentRecipesFetch function that listens on recent recipe
 * collection to get the recipes that a user has interacted with recently.
 */
export const beginRecentRecipesFetch = (userID) => async dispatch => {
    relevantRecipesRef.doc(userID).onSnapshot(
        relevantRecipeUpdate(
            "isRecent", dispatch, CLEAR_RECENT, ADD_RECENT
        )
    );
}

/**
 * addSearchRecipesFromResult function that dispatches an action to 
 * add all documents retrieved from the passed in query to the redux store
 */
const addSearchRecipesFromResult = (searchResults, dispatch, addType) => {
    searchResults.get().then(function(querySnapshot){
        if (querySnapshot.size == 0) {
            return;
        }
        querySnapshot.forEach(doc => {
            var data = doc.data();
            dispatch({
                type: addType,
                payload: {
                    images: data["images"],
                    servings: data["servings"],
                    timeHour: data["time"]["hour"],
                    timeMinute: data["time"]["minute"],
                    title: data["title"],
                    recipeID: data["id"],
                    id: doc.id
                }
            })
        });
    }).catch(err => {
        console.log('Error getting documents', err);
    });
}

/**
 * beginSearchRecipesFetch function that dispatches an action to add
 * all documents that match the search query to the redux store
 */
export const beginSearchRecipesFetch = (searchQuery) => async dispatch => {
    dispatch({
        type: CLEAR_SEARCH
    });
    searchQuery = searchQuery.toLowerCase().trim()
    // Search by prefix
    var searchLength = searchQuery.length;
    var prefix = searchQuery.slice(0, searchLength-1);
    var lastLetter = searchQuery.slice(searchLength-1, searchLength);

    var searchStart = searchQuery;
    var searchEnd = prefix + String.fromCharCode(lastLetter.charCodeAt(0) + 1);

    var searchPrefixResults = recipesRef.where(
        'lowercaseTitle',
        '>=',
        searchStart
    ).where(
        'lowercaseTitle',
        '<',
        searchEnd
    )
    addSearchRecipesFromResult(searchPrefixResults, dispatch, ADD_SEARCH)

    // Search by category
    var searchCategoryResults = recipesRef.where(
        'categories',
        'array-contains',
        searchQuery
    )
    addSearchRecipesFromResult(searchCategoryResults, dispatch, ADD_SEARCH)
    
}

/**
 * beginRandomRecipesFetch function that dispatches an action to add
 * random recipes to the redux store. Random recipes are recipes that
 * have minimal reviews.
 */
export const beginRandomRecipesFetch = ()  => async dispatch => {
    dispatch({
        type: CLEAR_RANDOM
    })
    var searchResults = recipesRef.orderBy("rating.reviewCount", "desc").limit(10);
    addSearchRecipesFromResult(searchResults, dispatch, ADD_RANDOM)
}

/**
 * getIsFavorited function that updates the redux store to indicate
 * if the current user has favorited the current recipe.
 */
export const getIsFavorited = (userID, recipeID) => {
    return (dispatch) => {
        var recipeDocRef = relevantRecipesRef.doc(userID)
            .collection('recipes').doc(recipeID)

        recipeDocRef.get().then(doc => {
            if (!doc.exists) {
                dispatch({
                    type: IS_NOT_FAVORITED,
                    payload: {
                        isFavorited: false,
                    }
                })
            } else {
                var data = doc.data()
                if ('isFavorited' in data && data['isFavorited']) {
                    return dispatch({
                        type: IS_FAVORITED,
                        payload: {
                            isFavorited: true,
                        }
                    })
                } else {
                    return dispatch({
                        type: IS_NOT_FAVORITED,
                        payload: {
                            isFavorited: false,
                        }
                    })
                }
            }
        }).catch(err => {
            console.log('Error getting document', err);
        });
    }
}

/**
 * flipIsFavorited function that updates the redux store to indicate
 * the opposite of whether or not the favorited flag is set.
 */
export const flipIsFavorited = (isFavorited) => {
    return (dispatch) => {
        return dispatch({
            type: FLIP_FAVORITED,
            payload: {
                isFavorited: !isFavorited
            }
        })
    }
}

export const addRatingForRecipe = (recipeID, rating, userID) => {
    recipesRef.doc(recipeID).get().then(recipeSnapshot => {
        var oldRating = parseFloat(recipeSnapshot.get("rating.rating"));
        var ratingCount = parseInt(recipeSnapshot.get("rating.reviewCount"));
        var newRating = ((oldRating * ratingCount) + rating) / (ratingCount + 1);
        recipesRef.doc(recipeID).set({rating: newRating, ratingCount: ratingCount + 1}, {merge: true});
    });
    relevantRecipesRef.doc(userID).collection("recipes").doc(recipeID).set(
        {rating: rating},
        {merge: true}
    );
}
