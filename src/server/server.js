const app = require("./app");

const server = require("http").Server(app);

const port = process.env.PORT || 8080;
const Users = require("./db/users");
const Collection = require("./db/collection");



app.listen(port, () => {
    console.log('Started server on port ' + port);
});