const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = process.env.PORT || 5000;
// const port = 5000;
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
const firebase = require("firebase-admin");
const serviceAccount = require("./service-account-file.json");
const queryString = require("query-string");
// var Session = require('express-session');
// var google = require('googleapis');
// const { OAuth2Client } = require('google-auth-library');


var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser());

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://jovial-branch-295110-default-rtdb.firebaseio.com/"
});


const stringifiedParams = queryString.stringify({
    client_id: "92463015553-fv6fqpch3hifsd9tjjda92pq0n23nbfm.apps.googleusercontent.com",
    redirect_uri: 'http://localhost:5000/auth',
    scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '), // space seperated string
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
});

console.log(stringifiedParams)

mongoose.connect("mongodb+srv://noti_token:piyush2001@notitoken.flzpe.mongodb.net/test", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    console.log("connected to mongooose");

});


app.get('/', (req, res) => {
    var params = { "data": stringifiedParams }
    res.status(200).render('index', params);
});

app.get('/firebase-messaging-sw.js', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('firebase-messaging-sw.js', { root: __dirname });      //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

const notirouter = require('./routes/noti');
const loginrouter = require('./routes/googlelogin');

app.use('/noti', notirouter);
app.use('/login', loginrouter);


app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});