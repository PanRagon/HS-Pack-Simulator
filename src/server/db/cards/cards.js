//This is JSON-representation of all the collectible cards in Blizzard's card game Hearthstone, it can be found here:
//https://hearthstonejson.com/
//I've limited the amount of cards imported here to keep the file from being unecessarily large.

let json = require("./newCards.json");
const utils = require("./utils.js");

json = JSON.stringify(json);
let cards = new Map();


let cardsArr = JSON.parse(json);

//Just filtering out some properties we don't need to keep it streamlined
let propertiesToRemove = ["artist", "collectible", "playRequirements", "mechanics", "flavor", "faction"];


cardsArr.forEach((card, index) => {
    //This API also serves hero skins for some reason, we don't want that.


    //I had originally changed dbfId, which is purely numerical, to be the card's ID for the purpose of
    //cleaner API URIs. Later when I added images, I needed access to images which were on the id-field, but I still
    //wanted the primary ID used to access cards be named as id.
    [card.id, card.dbfId] = [card.dbfId, card.id];

    //Making Hall of Fame cards uncollectible here.
    if(card.set === "HOF") {
        cardsArr.splice(index, 1);
    }

    if(utils.sets[card.set]) {
        card.set = utils.sets[card.set];
    }

    //Spells have a $ in front of them if they deal damage and # if they heal, we don't want this.
    if(card.text) {
        card.text = card.text.replace(/\$/, "");
        card.text = card.text.replace(/#/, "");
    }


    propertiesToRemove.forEach((property) => {
        delete card[property]
    });
    cards.set(card.id, card);
});

//We just return the card array here so that we can map it in the UI later.
function getAllCards() {
    return cardsArr;
}

function getAllSets() {
    return Object.values(utils.sets);
}

function getCard(id) {
    return cards.get(id);
}

//Only used to verify that the API will give an error if the array is empty, this isn't actually available as an endpoint.
function deleteAllCards() {
    cardsArr = [];
}

module.exports = {getAllCards, getCard, deleteAllCards, getAllSets};
