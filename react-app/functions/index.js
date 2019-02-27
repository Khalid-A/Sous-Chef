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
const MS_IN_HOUR = 1000 * 60 * 60;

/**
 * Firebase collections
 */
const recipes = admin.firestore().collection('test_recipes');
const relevantRecipes = admin.firestore().collection('relevantrecipes');
const pantry = admin.firestore().collection('pantrylists');
const taskData = admin.firestore().collection('taskdata').doc('ReadyToGo');

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
var filterPrevReadyRecipes = async (userID, ingredients) => {
	var numReadyToGo = 0;
	var irrelevantRecipes = [];
	await relevantRecipes.doc(userID).collection('recipes').get()
		.then(async (docs) => {
			console.log("Filtering through", docs.docs.length,
				"existing relevant recipes.");
			docs.forEach(async (doc) => {
				const recipe = doc.data();
				const recipeID = recipe.id;
				await recipes.get(recipeID).then((recipeDoc) => {
					if (!recipeDoc.exists) {
						throw "Current relevant recipe " + recipeID +
							" not found in recipe DB.";
					}
					const recipeData = recipeDoc.data();
					const ingredientsNeeded =
						Object.values(recipeData.ingredients);
					if (recipe.isReadyToGo &&
						!isReadyToGo(ingredientsNeeded, ingredients)) {
						// We can't make this recipe anymore--remove flag
						irrelevantRecipes.push(doc.ref);
						console.log("Recipe", recipeID,
							"can't be made anymore, remove flag.");
					}
					else {
						numReadyToGo++;
					}
				});
			});
		}).catch((error) => {
			console.warn(error);
			return numReadyToGo;
		});

	// Mark no longer relevant recipes as such
	// TODO: remove from list if no interesting flags
	irrelevantRecipes.forEach(async (ref, index) => {
		await admin.firestore().runTransaction((transaction) => {
			return transaction.get(ref).then((doc) => {
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
var addNewReadyRecipes = async (userID, ingredients, numReadyToGo) => {
    // TODO: order recipes to retrieve in any particular way? Cooktime?
	var firstPage = recipes.limit(DOCS_PER_PAGE);
	var lastVisible;
	var isEndOfData = false;

	while (!isEndOfData && numReadyToGo < MAX_NUM_READY_TO_GO) {
		// Retrieve recipes page-by-page in order to find enough that are ready
		var page = lastVisible ?
			recipes.startAfter(lastVisible).limit(DOCS_PER_PAGE) :
			recipes.limit(DOCS_PER_PAGE);

		await page.get().then(async (docs) => {
			console.log("Request for", MAX_NUM_READY_TO_GO, "recipes.");
			if (docs.docs.length == 0) {
				throw "No more docs to retrieve.";
			}
			// Get the last visible document
			lastVisible = docs.docs[docs.docs.length - 1];

			for (var docsIndex = 0; docsIndex < docs.docs.length; docsIndex++) {
				const recipe = docs.docs[docsIndex].data();
				console.log("Received data for DB recipe", recipeID);
				const recipeID = recipe.id;
				const ingredientsNeeded = Object.values(recipe.ingredients);
				if (isReadyToGo(ingredientsNeeded, ingredients)) {
					// We can make this recipe! Add it to our list
					await relevantRecipes.doc(userID).collection('recipes')
						.doc(recipeID).update({ "isReadyToGo": true });
					numReadyToGo++;
					console.log("Recipe", recipeID, "is ready to go!");
				}

				if (numReadyToGo == MAX_NUM_READY_TO_GO) {
					console.log("Found", MAX_NUM_READY_TO_GO, "ready to go!");
					break;
				}
			}
		}).catch((error) => {
			isEndOfData = true;
			console.warn(error);
		});
	}
}

var isTooSoon = (taskObject, now) => {
	if (taskObject.lastEnded < taskObject.lastStarted) {
		return true; // Last task has not ended
	}
	if (now < taskObject.lastEnded + MS_IN_HOUR) {
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
		return admin.firestore().runTransaction((transaction) => {
			return transaction.get(taskData).then((doc) => {
				var timestamp = Date.now();
				console.log("Pantry write event triggered at time", timestamp);
				// Figure out whether to start job
				var exit = true;
				exit = isTooSoon(doc.data(), timestamp);
				if (exit) {
					throw "Too soon to start job.";
				}

				transaction.update(taskData, { "lastStarted": timestamp });
				console.log("Updated start time for the job about to start.");
			}).then(async () => {
				// Begin job
				const userID = context.params.userID;
				const updatedIngredients = change.after.data().ingredients;

				// First filter out any ready-to-go recipes that are no longer ready
				var numReadyToGo = await filterPrevReadyRecipes(userID, updatedIngredients);
				console.log("Filtered through previously ready recipes. Now there are", numReadyToGo, "ready recipes.");

				// Now add other recipes that are ready to go
				numReadyToGo = await addNewReadyRecipes(userID, updatedIngredients, numReadyToGo);
				console.log("Added newly ready recipes. Now there are", numReadyToGo, "ready recipes.");

				// Modify transaction data to update end time
				admin.firestore().runTransaction((transaction) => {
					return transaction.get(taskData).then((doc) => {
						transaction.update(taskData, { "lastEnded": Date.now() });
					});
				});
			}).catch((error) => {
				console.log(error);
			});
		});
	});
