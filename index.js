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
const axios = require("axios");
var Session = require('express-session');
var google = require('googleapis');
const { OAuth2Client } = require('google-auth-library');


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




// app.post('/auth', (req, res) => {
//     var user_idtoken = req.body.useridtoken;
//     console.log(user_idtoken);
//     //or send post or get at https://oauth2.googleapis.com/tokeninfo?id_token=client_idtoken to verify user
//     const client = new OAuth2Client("92463015553-fv6fqpch3hifsd9tjjda92pq0n23nbfm.apps.googleusercontent.com");
//     async function verify() {
//         console.log("verifying");
//         const ticket = await client.verifyIdToken({
//             idToken: user_idtoken,
//             audience: "92463015553-fv6fqpch3hifsd9tjjda92pq0n23nbfm.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
//             // Or, if multiple clients access the backend:
//             //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//         });
//         const payload = ticket.getPayload();
//         const userid = payload['sub'];

//         console.log(payload['given_name'])
//         const user = new c_noti_token({
//             username: payload.given_name,
//             usermail: payload.email
//         });

//         // Inserts a new document with `name = 'Will Riker'` and
//         // `rank = 'Commander'`
//         user.save();
//         // If request specified a G Suite domain:
//         // const domain = payload['hd'];
//     }
//     verify().catch(console.error);

//     res.status(200).render('admin');


// });





// app.get('/admin', (req, res) => {

//     c_noti_token.find({}, function (err, someValue) {
//         if (err) console.log(err);
//         const params = { 'alltokens': JSON.stringify(someValue) };
//         // console.log(params);
//         res.status(200).render('admin', params);

//     });
//     // res.status(200).render('index', params);

// });

// app.post('/admin', (req, res) => {

//     var clientToken = req.body.tokenOfClient;
//     // sendnoti(clientToken, res);
//     const wait = ms => new Promise(resolve => setTimeout(resolve, ms));



//     wait(4 * 1000).then(() => {
//         console.log("waited for 4 seconds");
//         sendnoti(clientToken);

//     });

//     wait(8 * 1000).then(() => {
//         console.log("waited for 8 seconds")
//         res.send("sent")

//     });


// });



// // The Firebase token of the device which will get the notification
// // It can be a string or an array of strings
// function sendnoti(clientToken) {

//     // const firebaseToken = 'cCwYg6Lclvt5s9TKuFIMWV:APA91bHa9eT74fkeP4LVydr1f6r3YkzwXs8D7UcAq1i7BZahtlFXAxVqkCR890qFCrkIcFnch1VNNVcdOACCl9F-iC4oudGqElY7Q2SnOgAXbYSMkH61wbYtVhXX8VZ7GIpTZGIB_VwD';
//     const firebaseToken = clientToken;


//     const payload = {
//         notification: {
//             title: 'Notification Title',
//             subtitle: "test subtitle",
//             body: 'This is an my noti',
//             image: "https://solarianprogrammer.com/images/2015/05/08/circles.jpg",
//             click_action: "/"

//         },

//     };

//     const options = {
//         priority: 'high',
//         timeToLive: 60 * 60 * 24, // 1 day
//     };

//     firebase.messaging().sendToDevice(firebaseToken, payload, options);
//     console.log("sent by func");
//     // res.send("sending noti");      

// }

// function getOAuthClient() {
//     return new OAuth2("92463015553-fv6fqpch3hifsd9tjjda92pq0n23nbfm.apps.googleusercontent.com", "LAhUoyQIAuHlKt6HsPV1E8jr", "http://localhost:5000/auth");
// }



app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});