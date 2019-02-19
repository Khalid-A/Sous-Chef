// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Number of ready-to-go recipes to store for the user
const MAX_NUM_READY_TO_GO = 20;

// Number of recipes to query at a time
const DOCS_PER_PAGE = 50;

// Number of seconds in an hour
const SECONDS_IN_HOUR = 3600;

/**
 * Firebase collections
 */
const recipes = firebase.firestore().collection('recipes');
const relevantRecipes = firebase.firestore().collection('relevantrecipes');
const pantry = firebase.firestore().collection('pantrylists');
const taskData = firebase.firestore().collection('taskdata').doc('ReadyToGo');

/**
 * DEPRECATED: gets userID using pantryListID
 * @param {string} pantryListID
 * @return {string} userID
 */
var getUserID = (pantryListID) => {
	var userID;

	firebase.firestore().collection('pantrylists').doc(pantryListID).get()
		.then(function(doc) {
			userID = doc.data().userID;
		});

	return userID;
}

/**
 * Determines whether a recipe is ready to go.
 * @param {Array} needs Ingredients required by the recipe
 * @param {Array} haves Ingredients the user has
 * @return {bool} Whether the recipe is ready to go.
 */
var isReadyToGo = (needs, haves) => {
	for (var needIndex = 0; needIndex < needs.length; needIndex++) {
		const need = needs[needIndex];

		var haveAny = false;
		for (var haveIndex = 0; haveIndex < haves.length; haveIndex++) {
			const have = haves[haveIndex];

			if (need.ingredient == have.ingredient) {
				haveAny = true;

				if (need.amount > have.amount) {
					// We don't have enough
					return false;
				}

				// Found ingredient in pantry, stop searching
				break;
			}
		}

		if (!haveAny) {
			// Required ingredient not found in pantry
			return false;
		}
	}

	// Search completed without failure
	return true;
}

/**
 * Deletes any recipes from relevantrecipes that are no longer ready
 * @param {string} userID The user whose list this is
 * @param {Array} ingredients A list of ingredients the user has in pantry
 * @return {int} Number of remaining recipes that are ready to go
 */
var filterPrevReadyRecipes = (userID, ingredients) => {
	var numReadyToGo = 0;
	var irrelevantRecipes = [];
	relevantRecipes.doc(userID).collection('recipes').get()
		.then(function(docs) {
			docs.forEach(function(doc) {
				const recipe = doc.data();
				const recipeID = recipe.id;
				const ingredientsNeeded = recipe.ingredients;
				if (!isReadyToGo(ingredientsNeeded, ingredients)) {
					// We can't make this recipe anymore--remove flag
					irrelevantRecipes.push(doc.ref);
				}
				else {
					numReadyToGo++;
				}
			});
		});

	// Mark no longer relevant recipes as such
	// TODO: remove from list if no interesting flags
	irrelevantRecipes.forEach((ref, index) => {
		firebase.firestore().runTransaction(function(transaction) {
			transaction.get(ref).then(function(doc) {
				transaction.update(ref, { "isReadyToGo": false });
			});
		});
	});

	return numReadyToGo;
}

/**
 * Finds new recipes that are ready-to-go and adds them to relevantrecipes
 * @param {string} userID The user whose list this is
 * @param {Object} ingredients A list of ingredients the user has in pantry
 * @param {int} numReadyToGo The number of recipes currently marked ready
 */
var addNewReadyRecipes = (userID, ingredients, numReadyToGo) => {
    // TODO: order recipes to retrieve in any particular way? Cooktime?
	var firstPage = recipes.limit(DOCS_PER_PAGE);
	var lastVisible;

	while (true) {
		// Retrieve recipes page-by-page in order to find enough that are ready
		var page = lastVisible ?
			recipes.startAfter(lastVisible).limit(DOCS_PER_PAGE) :
			recipes.limit(DOCS_PER_PAGE);

		page.get().then(function(docs) {
			// Get the last visible document
			lastVisible = docs.docs[docs.docs.length - 1];

			for (var docsIndex = 0; docsIndex < DOCS_PER_PAGE; docsIndex++) {
				const recipe = docs[docsIndex].data();
				const recipeID = recipe.id;
				const ingredientsNeeded = recipe.ingredients;
				if (isReadyToGo(ingredientsNeeded, ingredients)) {
					// We can make this recipe! Add it to our list
					relevantRecipes.doc(userID).collection('recipes')
						.doc(recipeID).set({
							...recipe,
							"isReadyToGo": true
						});

					numReadyToGo++;
				}

				if (numReadyToGo == MAX_NUM_READY_TO_GO) {
					break;
				}
			}
		});

		if (numReadyToGo == MAX_NUM_READY_TO_GO) {
			break;
		}
	}
}

var isTooSoon = (taskObject) => {
	if (taskObject.lastEnded.compareTo(taskObject.lastStarted) < 0) {
		return true; // Last task has not ended
	}
	if (taskObject.lastEnded.getSeconds() <
		taskObject.lastStarted.getSeconds() + SECONDS_IN_HOUR) {
		return true; // Not long enough since last task ended
	}
	return false;
}

/**
 * Any change to a pantry triggers recalculation of ready-to-go recipes.
 */
exports.updateReadyToGoRecipes = functions.firestore
	.document('pantrylists/{userID}').onWrite((change, context) => {
		// Read transaction data with the intention of modifying
		firebase.firestore().runTransaction(function(transaction) {
			transaction.get(taskData).then(function(doc) {
				var timestamp = firebase.firestore.Timestamp.fromDate(Date.now());

				// Figure out whether to start job
				var exit = true;
				exit = isTooSoon(doc.data());
				if (exit) return;

				 // Update start time for the job about to start
				transaction.update(taskData, { "lastStarted": timestamp });
			});
		});

		// Begin job
		const userID = context.params.userID;
		const updatedIngredients = change.after.data().ingredients;

		// First filter out any ready-to-go recipes that are no longer ready
		var numReadyToGo = filterPrevReadyRecipes(userID, updatedIngredients);

		// Now add other recipes that are ready to go
		addNewReadyRecipes(userID, updatedIngredients, numReadyToGo);

		// Modify transaction data to update end time
		firebase.firestore().runTransaction(function(transaction) {
			transaction.get(taskData).then(function(doc) {
				var timestamp = firebase.firestore.Timestamp.fromDate(Date.now());
				transaction.update(taskData, { "lastEnded": timestamp });
			});
		});
	});
