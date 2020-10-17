const express = require("express");
const app = express();
const favicon = require("serve-favicon");


/////////////////////////////////// Middleware ///////////////////////////////////

// serve favicon
app.use(favicon(__dirname + "/public/images/favicon.ico"));

// make all the files in 'public' available
app.use(express.static("public"));


/////////////////////////////////// Routes ///////////////////////////////////
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});
app.get("/index.html", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});


/////////////////////////////////// Listener  ///////////////////////////////////

// listen for requests
const listener = app.listen(3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});


/////////////////////////////////// Database ///////////////////////////////////