//This app file is based on the code from Andrea Arcuri's code from exercise solutions
//https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/app.js

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

const authApi = require("./routes/auth-api");
const Users = require("./db/users");

const cardsApi = require("./routes/cards-api");
const collectionApi = require("./routes/collection-api");

const packsApi = require("./routes/packs-api");

const WsHandler = require('./ws-handler');

const app = express();

app.use(bodyParser.json());

WsHandler.init(app);

app.use(session({
    secret: "a secret used to encrypt the session cookies",
    resave: false,
    saveUnitialized: false
}));

//Serve static files
app.use(express.static("public"));

passport.use(new LocalStrategy(
    {
        usernameField: "id",
        passwordField: "password"
    },
    function (id, password, done) {

        const ok = Users.verifyUser(id, password);

        if(!ok) {
            return done(null, false, {message: "Invalid username or password"})
        }

        const user = Users.getUser(id);
        return done(null, user);
    }
));

passport.serializeUser(function (user, done) {{
    done(null, user.id);
}});

passport.deserializeUser(function (id, done) {
    const user = Users.getUser(id);

    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
});

app.use(passport.initialize());
app.use(passport.session());

//Use /api for all API routes
app.use("/api", authApi);
app.use("/api", cardsApi);
app.use("/api", collectionApi);
app.use("/api", packsApi);

app.use(express.static('public'));

//Handle 404
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});


module.exports = app;