"""
This module scrapes recipe information from allrecipes.com
"""
import requests
import utils
import uuid
import json
from bs4 import BeautifulSoup

def getTitle(htmlDocument):
    titleHdrAttrs = {"class": "recipe-summary__h1"}
    title = htmlDocument.find("h1", titleHdrAttrs).next
    # may need to deal with linguini vs linguine? or genoese vs genoise
    return title
    

def getIngredients(htmlDocument):
    # search for properties of element
    ingredients = []
    ingredientSpanAttrs = {"itemprop": "recipeIngredient"}
    htmlLines = htmlDocument.findAll("span", ingredientSpanAttrs)
    for htmlLine in htmlLines:
        ingredient = {}
        ingredientLine = htmlLine.next
        ingredient["quantity"] = utils.parseQuantity(ingredientLine)
        if ingredient["quantity"] == None:
            continue
        unit, description, item = utils.parseIngredientInfo(ingredientLine)
        ingredient["unit"] = unit
        ingredient["description"] = description
        ingredient["item"] = item
        ingredients.append(ingredient)
    return ingredients

def getDirections(htmlDocument):
    directionSpanAttrs = {"class": "recipe-directions__list--item"}
    directionSpan = htmlDocument.find_all("span", directionSpanAttrs)
    directions = []
    for direction in directionSpan:
        direction = utils.cleanString(direction.text)
        if direction != "":
            directions.append(direction)
    return directions

def getImage(htmlDocument):
    imageSpanAttrs = {"class": "rec-photo"}
    imageSpan = htmlDocument.find("img", imageSpanAttrs)
    return imageSpan["src"]

def getServingSize(htmlDocument):
    servingSpan = htmlDocument.find("div", class_="subtext")
    return utils.parseServings(servingSpan.next)

def getCookingTime(htmlDocument):
    timeSpan = htmlDocument.find("span", class_="ready-in-time")
    hour, minute = utils.parseTime(timeSpan.next)
    timeInfo = {
        "hour": hour,
        "minute": minute
    }
    return timeInfo

def scrapeWebsite(url):
    htmlDocument = BeautifulSoup(requests.get(url).content, "html.parser")
    recipeInfo = {
        "id": str(uuid.uuid4()),
        "title" : getTitle(htmlDocument),
        "ingredients": getIngredients(htmlDocument),
        "directions": getDirections(htmlDocument),
        "images": getImage(htmlDocument),
        "servings": getServingSize(htmlDocument),
        "time": getCookingTime(htmlDocument)
    }
    print(recipeInfo)
    return recipeInfo

def main():
    # find recipe web pages
    # iterate over recipe webpages
    recipeInfo = scrapeWebsite("https://www.allrecipes.com/recipe/185896")
    with open('recipes/185896.json', 'w') as outfile:  
        json.dump(recipeInfo, outfile)

if __name__ == "__main__":
    main()
