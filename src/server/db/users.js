//AuthAPI and simulated Users database based on example given in exercise solutions in web_development_and_api_design repository
//https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/db/users.js
const fs = require("fs");
let utils = require("./utils");
const Cards = require("./cards/cards");

//If the JSON-file doesn't already exist, create an empty one
const users = new Map();
const jsonPath = __dirname + "/users.json";


utils.initializeJson(users, jsonPath);


function getUser(id) {
    return users.get(id);
}

function verifyUser(id, password) {
    const user = getUser(id);

    if(!user) {
        return false;
    }

    return user.password === password;
}

function createUser(id, password) {
    if(getUser(id)) {
        return false;
    }


    const user = {
        id,
        password,
        packs: 3,
        collection: [],
        totalCards: 0,
        gold: 100
    };

    let cards = Cards.getAllCards();
    cards.forEach((card) =>{
        if(card.set === "Basic") {
            let newCard = {
                id: card.id,
                count: 2
            };
            user.collection.push(newCard);
        }
    });

    users.set(id, user);
    utils.updateJsonArray(user, jsonPath);
    return true;
}

function deleteAllUsers() {
    users.clear();
}

function getAllUsers() {
    return users;
}

function deleteUser(id) {
    const user = getUser(id);

    if(!user) {
        throw "Invalid User ID: " + id;
    }

    users.delete(id);
}

//Simulate User
/*function createInitialUsers() {
    createUser("andrea", "42");
    createUser("tomas", "FizzBuzz");
    createUser("richie_rich", "cashmoney");

}*/

module.exports = {getUser, verifyUser, createUser, getAllUsers, deleteAllUsers, deleteUser, users};