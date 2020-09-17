const express = require("express");
const Cards = require("../db/cards/cards");
const router = express.Router();

//Shows all cards on the frontpage, this endpoint is open for all users.
router.get("/cards", function (req, res) {
    const cards = Cards.getAllCards();

    //If there are no cards to serve the user, we've probably messed up. 500 makes most sense here.
    if(!Array.isArray(cards) || !cards.length) {
        res.status(500).send();
        return
    }

    res.status(200).json(cards)
});

router.get("/sets", function (req, res) {
   const sets = Cards.getAllSets();

   if(!Array.isArray(sets) || !sets.length) {
       res.status(500).send();
       return
   }

   res.status(200).json(sets);
});

module.exports = router;