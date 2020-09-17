//AuthAPI and simulated Users database based on example given in exercise solutions in web_development_and_api_design repository
//https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/routes/auth-api.js

const express = require("express");
const passport = require("passport");

const Users = require("../db/users");

const router = express.Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
    res.status(204).send();
});

router.post("/register", function (req, res) {

    const created = Users.createUser(req.body.id, req.body.password);

    if(!created) {
        res.status(400).send();
        return;
    }

    passport.authenticate("local") (req, res, () => {
        req.session.save((err) => {
            if (err) {
                res.status(500).send();
            } else {
                res.status(201).send();
            }
        })
    })
});

router.post("/logout", function (req, res) {

    req.logout();
    res.status(204).send();
});

router.get("/user", function(req, res) {

    if(!req.user) {
        res.status(401).send();
        return;
    }

    res.status(200).json({
        id: req.user.id
    });
});


router.get("/users/:id", function (req, res) {
    if(!req.user) {
        res.status(401).json(
            "401: Unauthenticated - Please login"
        )
    }

    if(req.user.id !== req.params["id"]) {
        res.status(403).json(
            "403: Forbidden"
        )
    }
    const user = Users.getUser(req.params["id"]);
    //Don't want to send out the password in plaintext...
    delete user.password;
    res.status(200).json(user);
});

module.exports = router;
