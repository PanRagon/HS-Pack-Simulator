const express = require("express");
const Collection = require("../db/collection");
const Users = require("../db/users");
const Cards = require("../db/cards/cards");

const router = express.Router();



router.get("/collection/:id", function (req, res) {
    if(!req.user) {
        res.status(401).json(
            "401: Unauthenticated - Please log in"
        );
        return;
    }

    if(req.user.id !== req.params["id"]) {
        res.status(403).json(
            "403: Forbidden"
        )
    }


    const cards = Collection.getUserCards(req.user.id);

    if(!cards) {
        res.status(404).send();
    }
    res.status(200).json(cards);
});

router.delete("/collection/:id/mill", function (req, res) {
    if(!req.user) {
        res.status(401).json(
            "401: Unauthenticated - Please log in"
        )

    }
    if(req.user.id !== req.params["id"]) {
        res.status(403).json(
            "403: Forbidden"
        )
    }
    const milled = Collection.millCard(req.params["id"], req.body.cardId);
    if(!milled) {
        res.status(404).send();
    }
    res.status(200).send();
});

router.post("/collection/:id/buy", function (req, res) {
    if(!req.user) {
        res.status(401).json(
            "401: Unauthenticatd - Please log in"
        )
    }
    if(req.user.id !== req.params["id"]) {
        res.status(403).json(
            "403: Forbidden"
        );
    }
    const bought = Collection.buyCard(req.params["id"], req.body.cardId);
    if(!bought) {
        res.status(404).send();
    }
    res.status(201).send();
});



module.exports = router;
