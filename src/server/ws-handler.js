const express_ws = require('express-ws');

let ews;

function init(app) {

    ews = express_ws(app);

    app.ws('/', function (ws, req) {
        console.log("New connection");
        let airdrop = setInterval(() => {
            console.log("Airdropping...");
            ws.send(JSON.stringify({newPack: true}))
        }, 60000);
        ws.on("close", function(close) {
            console.log("Closed");
            clearInterval(airdrop);
        })
    });
}


module.exports = {init};