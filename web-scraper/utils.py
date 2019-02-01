import re
import word_labels

FIND_QUANTITY_PATTERN = re.compile(r"(\d+( \d+/\d+)?|(\d+/\d+))")
FIND_HOUR_PATTERN = re.compile(r"(\d+) h")
FIND_MINUTE_PATTERN = re.compile(r"(\d+) m")
FIND_SERVINGS_PATTERN = re.compile(r"(\d+) serving")


def parseIngredientInfo(textString):
    ingredientText = re.sub("\(.*\)", "", textString.lower())
    ingredientText = re.search("([ \d/]+)([^\d/]+)", ingredientText).group(2)
    words = ingredientText.split(" ")

    unit = getIfIsUnit(words[0])
    if unit != "":
        words = words[1:]

    ingredient = ""
    ingredientDescription = " ".join(words)

    ingredientDescription = re.sub(" with.*", "", ingredientDescription)
    ingredientDescription = re.sub(r"[^A-Za-z -]", " ", ingredientDescription)
    ingredientDescription = cleanString(ingredientDescription)
    ingredient = []
    descriptions = []
    current_ingredient = []
    for word in ingredientDescription.split(" "):
        if word in word_labels.DescriptiveAdjs:
            descriptions.append(word)
        elif word not in word_labels.StopWords:
            current_ingredient.append(word)
            continue
        if len(current_ingredient) > len(ingredient):
            ingredient = current_ingredient
            current_ingredient = []
    if len(current_ingredient) > len(ingredient):
            ingredient = current_ingredient
            current_ingredient = []
    return unit, descriptions, " ".join(ingredient)

def getIfIsUnit(textString):
    if textString in word_labels.MeasurementUnits:
        return textString
    elif textString + "s" in word_labels.MeasurementUnits:
        return textString + "s"
    elif textString + "es" in word_labels.MeasurementUnits:
        return textString + "es"
    return ""
    
def parseQuantity(textString):
    quantityString = re.search(FIND_QUANTITY_PATTERN, textString)
    if quantityString == None:
        return None
    quantityString = quantityString.group(0)
    wholeFractionSplit = str.split(quantityString, " ")
    return sum(map(convertStringToNum, wholeFractionSplit))

def convertStringToNum(s):
    numDenom = str.split(s, "/")
    if len(numDenom) == 1:
        return float(numDenom[0])
    return float(numDenom[0]) / float(numDenom[1])

def parseTime(textString):
    hourSearch = re.search(FIND_HOUR_PATTERN, textString)
    hour = 0
    if hourSearch != None:
        hour = int(hourSearch.group(1))
    
    minuteSearch = re.search(FIND_MINUTE_PATTERN, textString)
    minute = 0
    if minuteSearch != None:
        minute = int(minuteSearch.group(1))

    return hour, minute

def parseServings(textString):
    servingsSearch = re.search(FIND_SERVINGS_PATTERN, textString)
    return int(servingsSearch.group(1))

def cleanString(textString):
    textString = textString.replace("\n", "")
    textString = re.sub(r"\s\s+", " ", textString)
    return textString.strip()
    