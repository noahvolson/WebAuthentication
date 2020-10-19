const express = require("express");
const app = express();
const favicon = require("serve-favicon");
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const rateLimit = require("express-rate-limit");
const session = require('express-session')

const SALT_ROUNDS = 10;
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 20,                       // 20 attempts per day
});

///////////////////////////////// General Middleware /////////////////////////////////

/* ENFORCE HTTPS
app.use (function (req, res, next) {
    if (req.secure) {
        // https active, continue
        next();
    } else {
        // http request, redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});
*/

// serve favicon
app.use(favicon(__dirname + "/public/images/favicon.ico"));

// make all the files in 'public' available
app.use(express.static("public"));

// add sessions to track logged in users
app.use(session({
    cookie: {
        sameSite: true,
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

/////////////////////////////////// Routes ///////////////////////////////////

app.get('/', bodyParser.json(), (req, res) => {

    if (req.session && req.session.username) { // if user has logged in
        // send user data back
        res.sendFile(__dirname + "/views/index.html");
    }
    else {
        res.sendFile(__dirname + "/views/login.html");
    }
})

app.get('/index.html', bodyParser.json(), (req, res) => {

    if (req.session && req.session.username) { // if user has logged in
        // send user data back
        res.sendFile(__dirname + "/views/index.html");
    }
    else {
        res.sendFile(__dirname + "/views/login.html");
    }
})

app.get('/create.html', (req, res) => {
    res.sendFile(__dirname + "/views/create.html")
})

app.get('/mydata', (req, res) => {
    if (req.session && req.session.username) {      // if user has logged in
        getUser(req.session.username).then(user => {   // they must have some data in the db
            res.json({
                username: user.username,
                message: user.message
            })  // Note: DON'T SEND PASSWORD HASH
        })
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.sendFile(__dirname + "/views/login.html")
})

app.post('/userexists', [limiter, bodyParser.json()], (req, res) => {

    getUser(req.body.username).then(result => {
        res.json({userexists: Boolean(result)})
    })
})

app.post('/adduser', bodyParser.json(), (req, res) => {

    let username = req.body.username;
    let password = req.body.password;
    let message = req.body.message;

    let lowerAlphabetical = new RegExp("^(?=.*[a-z])");
    let upperAlphabetical = new RegExp("^(?=.*[A-Z])");
    let numericCharacter = new RegExp("^(?=.*[0-9])");
    let specialCharacter = new RegExp("^(?=.*[!@#\$%\^&\*])");

    getUser(req.body.username).then(user => {
        if (user) { // user already exists
            res.json({error: "Username taken."});
        }
        else if (username.length === 0) {
            res.json({error: "Invalid username."});
        }
        else if (password.length < 8) {
            res.json({error: "Password must eight characters or longer."});
        }
        else if (password.length > 24) {
            res.json({error: "Password must be less than 24 characters."});
        }
        else if (!lowerAlphabetical.test(password)) {
            res.json({error: "Password must contain at least one lowercase letter."});
        }
        else if (!upperAlphabetical.test(password)) {
            res.json({error: "Password must contain at least one uppercase letter."});
        }
        else if (!numericCharacter.test(password)) {
            res.json({error: "Password must contain at least one number."});
        }
        else if (!specialCharacter.test(password)) {
            res.json({error:  "Password must contain at least one special character (!@#$%^&*)."});
        }
        else if (message.length === 0) {
            res.json({error: "Please add a secret message."});
        }
        else {
            bcrypt.genSalt(SALT_ROUNDS, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {

                    let newUser = {
                        username: username,
                        password: hash,
                        message: message
                    }
                    upsertUser(newUser).then(() => {
                        console.log(`Added ${newUser.username}`)
                    })
                });
            });

            res.json({})
        }
    })
})

app.post('/login', [limiter, bodyParser.json()], (req, res) => {

    getUser(req.body.username).then(user => {
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (result) {
                req.session.username = req.body.username;
            }

            res.json(result);
        });
    })
})

/////////////////////////////////// Listener ///////////////////////////////////

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

////////////////////////////////// Graceful Termination //////////////////////////////////
function cleanup() {
    console.log("Cleaning up...")
    if (DBclient) DBclient.close()
    process.exit(0)
}

process.on('SIGTERM', cleanup)
process.on('SIGINT', cleanup)