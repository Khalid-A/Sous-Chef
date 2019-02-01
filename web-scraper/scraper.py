""" 
This module scrapes recipe information from allrecipes.com.
The recipes are saved into a json.
"""
import json
import uuid

import requests
from bs4 import BeautifulSoup

import utils

def getTitle(htmlDocument):
    """ Parse BeautifulSoup html and return title of the recipe. """
    titleHdrAttrs = {"class": "recipe-summary__h1"}
    title = htmlDocument.find("h1", titleHdrAttrs).next
    # may need to deal with linguini vs linguine? or genoese vs genoise
    return title
    
def getIngredients(htmlDocument):
    """ Parse BS object and return dict of ingredient information. """
    ingredients = []
    ingredientSpanAttrs = {"itemprop": "recipeIngredient"}
    htmlLines = htmlDocument.findAll("span", ingredientSpanAttrs)
    for htmlLine in htmlLines:
        ingredient = utils.parseIngredientInfo(htmlLine.next)
        if ingredient is not None:
            ingredients.append(ingredient)
    return ingredients

def getDirections(htmlDocument):
    """ Parse BS object and return ordered list of recipe directions. """
    directionSpanAttrs = {"class": "recipe-directions__list--item"}
    directionSpan = htmlDocument.find_all("span", directionSpanAttrs)
    directions = []
    for direction in directionSpan:
        direction = utils.cleanString(direction.text)
        if direction != "":
            directions.append(direction)
    return directions

def getImage(htmlDocument):
    """ Parse BS Object and return string linking to recipe image. """
    imageSpanAttrs = {"class": "rec-photo"}
    imageSpan = htmlDocument.find("img", imageSpanAttrs)
    return imageSpan["src"]

def getServingSize(htmlDocument):
    """ Parse BS Object and return serving size of recipe as integer. """
    servingSpan = htmlDocument.find("div", class_="subtext")
    return utils.parseServings(servingSpan.next)

def getCookingTime(htmlDocument):
    """ Parse BS Object and return dict of cooking time information. """
    timeSpan = htmlDocument.find("span", class_="ready-in-time")
    hour, minute = utils.parseTime(timeSpan.next)
    timeInfo = {
        "hour": hour,
        "minute": minute
    }
    return timeInfo

def scrapeWebsite(url):
    """ Parse BS Object of the given url and return dict of recipe info. """
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
    return recipeInfo

def main():
    """ Iterates allrecipes.com recipes and save recipe info to a json. """
    # find recipe web pages
    # iterate over recipe webpages
    recipeInfo = scrapeWebsite("https://www.allrecipes.com/recipe/185896")
    with open('recipes/185896.json', 'w') as outfile:  
        json.dump(recipeInfo, outfile)

if __name__ == "__main__":
    main()
