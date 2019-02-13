export const CLEAR_GROCERY_LIST = "CLEAR_GROCERY_LIST";
export const ADD_GROCERY_LIST = "ADD_GROCERY_LIST";

import firebase from 'react-native-firebase';

/**
 * groceryListsRef Firestore collection reference to all pantry lists.
 */
const groceryListsRef = firebase.firestore().collection("grocerylists");
const ingredientsRef = firebase.firestore().collection("IDToIngredient");
const ingredientsIDLookupRef = firebase.firestore().collection("ingredientToID");

/**
 * beginGroceryListsFetch Creates a listener that updates the current user's
 * pantry list as updates are made to it.
 * @param {string} userid The ID of the currently logged in user
 */
export const beginGroceryListFetch = (userid) => async dispatch => {
    groceryListsRef.doc(userid).onSnapshot(groceryListSnapshot => {
        groceryListSnapshot.ref.collection(
            "ingredients"
        ).onSnapshot(snapshot => {
            var index;
            for (index = 0; index < snapshot.docs.length; index++) {
                if (index == 0) {
                    dispatch({
                        type: CLEAR_GROCERY_LIST
                    });
                }
                var amount = snapshot.docs[index].get("amount");
                var unit = snapshot.docs[index].get("unit");
                var callback = ((amount, unit) => (ingredientSnapshot) => {
                    dispatch({
                        type: ADD_GROCERY_LIST,
                        payload: {
                            title: ingredientSnapshot.get("name"),
                            amount: amount,
                            unit: unit
                        }
                    });
                })(amount, unit);

                ingredientsRef.doc(
                    snapshot.docs[index].id
                ).get().then(callback);
            }
        })
    })
}

export const addGroceryListItem = (name, amount, unit, userid) => {
    ingredientsIDLookupRef.doc(name).get().then(snapshot => {
        var ingredientID;
        if (!snapshot.exists) {
            var newIngredient = ingredientsRef.doc();
            newIngredient.set({name: name});
            ingredientsIDLookupRef.doc(name).set({id: newIngredient.id});
            ingredientID = newIngredient.id;
        } else {
            ingredientID = snapshot.get("id");
        }
        groceryListsRef.doc(userid).onSnapshot(groceryListSnapshot => {
            groceryListSnapshot.ref.collection(
                "ingredients"
            ).doc(ingredientID).set({amount: amount, unit: unit});
        });
    })
}