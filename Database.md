# Database Architecture
This documents describes the data layout of our tables in Firebase. This document should be updated if the data in Firebase will be restructured.

<span style="color:lightgreen"> Green objects are collections. <span>
<span style="color:lightblue"> Blue objects are fields <span>

## users
This table stores all IDs associated with a particular user along with the user's email address.<br>
Document1 is indexed by <span style="color:pink">userID<span>.
| Document1 | Document1.data |
| --------- | --------------------------------------------- |
| 'userID'  | <span style="color:lightblue"> email: 'exampleEmail@stanford.edu' <br> groceryID: 'gID' <br> pantryID: 'pID' <br> relevantRecipesID: 'rrID' <br> userID: 'userID' </span>

## relevantrecipes 
This table stores information about which recipes are to be associated with a specific user.<br>
Document1 is indexed by <span style="color:pink">userID</span>. <br>
Document2 is indexed by <span style="color:pink">recipeID</span>.
| Document1 | Document1.data | Document2 | Document2.data |
| --------- | -------------- | --------- | ---------------|
| 'userID'  | <span style="color:lightblue">userID: 'exampleID'</span>
| | <br> <span style="color:lightgreen"> recipes <span> | 'recipeID' | <span style="color:lightblue">recipeID: 'rID'</span> <br> <span style="color:lightblue">isReadyToGo: 'true'</span>  <br> <span style="color:lightblue">isRecent: 'true'</span> <br>
| | | 'recipeID2' | <span style="color:lightblue">recipeID: 'rID2'</span> <br> <span style="color:lightblue">isReadyToGo: 'true'</span>  <br> <span style="color:lightblue">isRecent: 'true'</span> <br>


## recipes

## groceryLists / pantryLists

## IDToIngredient

## ingredientToID