const Users = require("./users");
const Cards = require("./cards/cards");
const utils = require("./utils");
const jsonPath = __dirname + "/users.json";

function openPack(id, cardCount) {
    let user = Users.getUser(id);
    if(!user) {
        throw "User not found"
    }

    if(user.packs === 0) {
        return false;
    }

    let allCards = Cards.getAllCards();
    let newCards = [];

    for(let i = 0; i < cardCount; i++) {
        let shouldAdd = true;
        let card = allCards[Math.floor(Math.random() * allCards.length)];
        newCards.push(card);
        user.collection.forEach(existing => {
            if(existing.id === card.id) {
                existing.count++;
                shouldAdd = false;
            }
        });
        if(shouldAdd === true) {
            const newCard = {
                id: card.id,
                count: 1
            };
            user.collection.push(newCard);
        }
    }
    user.packs = user.packs -1;
    user.totalCards = user.totalCards + cardCount;
    utils.updateJsonElements(id, {packs: user.packs, totalCards: user.totalCards, collection: user.collection}, jsonPath);
    return newCards;
}

function getPacks(id) {
    let user = Users.getUser(id);
    if(!user) {
        throw "User not found";
    }
    return user.packs
}

function buyPack (id) {
    const user = Users.getUser(id);
    if(user.gold < 100) {
        return false;
    }
    user.gold = user.gold - 100;
    user.packs++;
    utils.updateJsonElements(id, {gold: user.gold, packs: user.packs}, jsonPath);
    return true;
}

function receiveAirdrop (id) {
    const user = Users.getUser(id);
    user.packs++;
    utils.updateJsonElements(id, {packs: user.packs}, jsonPath);
    return true;
}

module.exports = {openPack, getPacks, buyPack, receiveAirdrop};