const express = require("express");
const Packs = require("../db/packs");
const Users = require("../db/users");

const router = express.Router();

router.put("/packs/:id/open", function (req, res) {
    if(!req.user) {
        res.status(401).json(
            "401: Unauthenticated - Please log in"
        );
    }
    if(req.user.id !== req.params["id"]) {
        res.status(403).json(
            "403: Forbidden"
        );
    }

    const user = Users.getUser(req.params["id"]);
    const newCards = Packs.openPack(user.id, 5);
    if(!newCards) {
        res.status(404).json(
            "404: Pack not found"
        );
    }
    //We send 200 rather than 201, we didn't create a new element, merely mutated the existing user collection
    res.status(200).json(newCards);
});

router.get("/packs/:id", function (req, res) {
    if(!req.user) {
        res.status(401).json(
            "401: Unauthenticated - Please log in"
        );
    }

    if(req.user.id !== req.params["id"]) {
        res.status(403).send(
            "403: Forbidden"
        );
    }

    const packs = Packs.getPacks(req.params["id"]);
    res.status(200).json(packs);
});

//Could also be a put since it also mutates entities, but it could go either way, I'm using a post here since one is required.
router.post("/packs/:id/buy", function (req, res) {
    if(!req.user) {
        res.status(401).json(
            "401: Unauthenticated - Please log in"
        )
    }
    const bought = Packs.buyPack(req.user.id);
    if(!bought) {
        res.status(400).json(
            "400: Bad Request - You don't have enough gold"
        )
    }
    res.status(200).send();
});

router.post("/packs/:id/airdrop", function (req, res) {
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
    const airdrop = Packs.receiveAirdrop(req.user.id);
    console.log(airdrop);
    res.status(201).json(
        "Received gift"
    );
});

module.exports = router;