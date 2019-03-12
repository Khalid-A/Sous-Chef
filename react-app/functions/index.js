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

var markNotRelevant = (self, irrelevantRecipes, index) => {
	var ref = irrelevantRecipes[index];
	admin.firestore().runTransaction((transaction) => {
		return transaction.get(ref).then((doc) => {
			transaction.update(ref, { "isReadyToGo": false });
		});
	}).then(() => {
		if (index + 1 < irrelevantRecipes.length) {
			self(self, irrelevantRecipes, index + 1);
		}
	});
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
	return relevantRecipes.doc(userID).collection('recipes').get()
		.then((querySnapshot) => {
			console.log("Filtering through", querySnapshot.docs.length,
				"existing relevant recipes.");

			var promises = [];
			var relevantRecipes = [];
			var recipeIDs = [];

			querySnapshot.forEach((doc) => {
				var data = doc.data();
				var recipeID = data.recipID;
				var promise = recipes.get(recipeID);
				relevantRecipes.push(data);
				recipeIDs.push(recipeID);
				promises.push(promise);
			});

			return Promise.all(promises).then((docs) => {
				for (var i = 0; i < docs.length; i++) {
	                var recipeDoc = docs[i];
					if (!recipeDoc.exists) {
						console.log("Current relevant recipe " + recipeIDs[i] +
							" not found in recipe DB.");
						continue;
					}
					const recipeData = recipeDoc.data();
					const ingredientsNeeded =
						Object.values(recipeData.ingredients);
					if (relevantRecipes[i].isReadyToGo &&
						!isReadyToGo(ingredientsNeeded, ingredients)) {
						// We can't make this recipe anymore--remove flag
						irrelevantRecipes.push(doc.ref);
						console.log("Recipe", recipeIDs[i],
							"can't be made anymore, remove flag.");
					}
					else {
						numReadyToGo++;
					}
				}

				return numReadyToGo;
			});
		}).then((num) => {
			// Mark no longer relevant recipes as such
			markNotRelevant(markNotRelevant, irrelevantRecipes, 0);

			return num;
		});
}

var retrieveNewRecipes = (self, lastVisible, isEndOfData, userID, ingredients, numReadyToGo) => {
	var page = lastVisible ?
		recipes.startAfter(lastVisible).limit(DOCS_PER_PAGE) :
		recipes.limit(DOCS_PER_PAGE);

	console.log("Request for", MAX_NUM_READY_TO_GO, "recipes.");

	return page.get().then((querySnapshot) => {
		console.log(querySnapshot.docs.length + " recipe docs retrieved.");
		if (querySnapshot.docs.length == 0) {
			throw "No more docs to retrieve.";
		}
		// Get the last visible document
		lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

		try {
			querySnapshot.forEach((doc) => {
				const recipe = doc.data();
				const recipeID = recipe.id;
				console.log("Received data for DB recipe", recipeID);
				const ingredientsNeeded = Object.values(recipe.ingredients);
				if (isReadyToGo(ingredientsNeeded, ingredients)) {
					// We can make this recipe! Add it to our list
					relevantRecipes.doc(userID).collection('recipes')
						.doc(recipeID).update({ "isReadyToGo": true });
					numReadyToGo++;
					console.log("Recipe", recipeID, "is ready to go!");
				}

				if (numReadyToGo == MAX_NUM_READY_TO_GO) {
					throw "Found " + MAX_NUM_READY_TO_GO + " ready to go!";
				}
			});
		}
		catch (error) {
			console.log(error);
			isEndOfData = true;
			return MAX_NUM_READY_TO_GO;
		}

		return numReadyToGo;
	}).then((num) => {
		if (!isEndOfData) {
			return self(self, lastVisible, false, userID, ingredients, num);
		}
	});
}

/**
 * Finds new recipes that are ready-to-go and adds them to relevantrecipes
 * @param {string} userID The user whose list this is
 * @param {Object} ingredients A list of ingredients the user has in pantry
 * @param {int} numReadyToGo The number of recipes currently marked ready
 */
var addNewReadyRecipes = (userID, ingredients, numReadyToGo) => {
    // TODO: order recipes to retrieve in any particular way? Cooktime?
	var lastVisible;
	var isEndOfData = false;
	return retrieveNewRecipes(retrieveNewRecipes, lastVisible, isEndOfData, userID, ingredients, numReadyToGo);
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
	.document('pantrylists/{userID}/ingredients/{ingredientID}').onWrite((change, context) => {
		// Read transaction data with the intention of modifying
		return admin.firestore().runTransaction((transaction) => {
			return transaction.get(taskData).then((doc) => {
				var timestamp = Date.now();
				// console.log("Pantry write event triggered at time", timestamp);
				// // Figure out whether to start job
				// var exit = true;
				// exit = isTooSoon(doc.data(), timestamp);
				// if (exit) {
				// 	throw "Too soon to start job.";
				// }

				transaction.update(taskData, { "lastStarted": timestamp });
				console.log("Updated start time for the job about to start.");
			}).then(() => {
				// Begin job
				const userID = context.params.userID;
				var updatedIngredients = [];

				change.after.ref.parent.get().then((docs) => {
					docs.forEach((doc) => {
						var data = doc.data();
						data.ingredient = doc.id;
						updatedIngredients.push(data);
					});
					return updatedIngredients;
				}).then((updatedIngredients) => {
					console.log(updatedIngredients.length + " ingredients in pantry.");

					// First filter out any ready-to-go recipes that are no longer ready
					var numReadyToGo;
					return filterPrevReadyRecipes(userID, updatedIngredients).then((num) => {
						console.log("Filtered through previously ready recipes. Now there are", num, "ready recipes.");

						// Now add other recipes that are ready to go
						return addNewReadyRecipes(userID, updatedIngredients, num).then((num2) => {
							console.log("Added newly ready recipes. Now there are", num2, "ready recipes.");
						});

					}).then(() => {
						// Modify transaction data to update end time
						return admin.firestore().runTransaction((transaction) => {
							return transaction.get(taskData).then((doc) => {
								transaction.update(taskData, { "lastEnded": Date.now() });
							});
						});
					});
				});
			}).catch((error) => {
				console.warn(error);
			});
		}).catch((error) => {
			console.warn(error);
		});
	});
