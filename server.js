const express = require("express");
const app = express();
const favicon = require("serve-favicon");
const {MongoClient} = require('mongodb');
const bodyParser = require("body-parser");


/////////////////////////////////// Middleware ///////////////////////////////////

// serve favicon
app.use(favicon(__dirname + "/public/images/favicon.ico"));

// make all the files in 'public' available
app.use(express.static("public"));


/////////////////////////////////// Routes ///////////////////////////////////

app.get('/', bodyParser.json(), (req, res) => {

    if (req.user !== undefined && req.user !== null) { // if user has logged in
        // send user data back
        res.sendFile(__dirname + "/views/index.html");
    }
    else {
        res.sendFile(__dirname + "/views/login.html");
    }
})

app.get('/index.html', bodyParser.json(), (req, res) => {

    if (req.user !== undefined && req.user !== null) { // if user has logged in
        // send user data back
        res.sendFile(__dirname + "/views/index.html");
    }
    else {
        res.sendFile(__dirname + "/views/login.html");
    }
})

app.post('/login', bodyParser.json(), (req, res) => {
    console.log(req.body)
    //req["user"] = 5
})

/////////////////////////////////// Listener  ///////////////////////////////////

// listen for requests
const listener = app.listen(3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});


/////////////////////////////////// Database ///////////////////////////////////
let DBclient = null;

async function initConnection() {
    const uri = `mongodb+srv://noahvolson:${process.env.DB_PASSWORD}@cluster0.mbhva.mongodb.net/<dbname>?retryWrites=true&w=majority`;
    DBclient = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    await DBclient.connect();
}

async function getUser(username) {
    if (DBclient === null) {await initConnection()}
    let collection = DBclient.db("WebAuth").collection("UserData");
    return await collection.findOne({username: username});
}

async function upsertUser(userData) {
    if (DBclient === null) {await initConnection()}
    let collection = DBclient.db("WebAuth").collection("UserData");
    collection.updateOne(
        { username: userData.username },
        { $set: userData },
        { upsert: true });
}
