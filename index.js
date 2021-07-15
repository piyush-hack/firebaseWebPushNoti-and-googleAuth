const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = process.env.PORT;
// const port = 5000;
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose')
var bodyParser = require('body-parser');
const firebase = require("firebase-admin");
const serviceAccount = require("./service-account-file.json");

app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser());

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://jovial-branch-295110-default-rtdb.firebaseio.com/"
});

mongoose.connect("mongodb+srv://noti_token:piyush2001@notitoken.flzpe.mongodb.net/test", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    console.log("connected to mongooose");

});
const noti_token = new mongoose.Schema({

    device_token: String,

});

noti_token.methods.speak = function () {//this is used in case you wanna have have method callback
    const greeting = "token is " + this.device_token
    console.log(greeting);
}


const c_noti_token = mongoose.model('noti_token', noti_token);
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});



app.get('/firebase-messaging-sw.js', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('firebase-messaging-sw.js', { root: __dirname });      //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.post('/toserver', (req, res) => {
    const d_token = req.body.device_token;
    console.log(req.body.device_token);
    const c_token = new c_noti_token({
        device_token: `${d_token}`
    });

    // Inserts a new document with `name = 'Will Riker'` and
    // `rank = 'Commander'`
    c_token.save();
    res.send("done");
});

app.get('/admin', (req, res) => {

    c_noti_token.find({}, function (err, someValue) {
        if (err) console.log(err);
        const params = { 'alltokens': JSON.stringify(someValue) };
        console.log(params);
        res.status(200).render('admin', params);

    });
    // res.status(200).render('index', params);

});

app.post('/admin', (req, res) => {

    var clientToken = req.body.tokenOfClient;
    // sendnoti(clientToken, res);
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

 

    wait(4 * 1000).then(() => {
        console.log("waited for 4 seconds");
        sendnoti(clientToken);

    });

    wait(8 * 1000).then(() => {
        console.log("waited for 8 seconds")
        res.send("sent")

    });


});

function sendres(res) {
    res.send("sent")
}

// sendnoti("jlkj", "jvhj")
// The Firebase token of the device which will get the notification
// It can be a string or an array of strings
function sendnoti(clientToken) {

    // const firebaseToken = 'cCwYg6Lclvt5s9TKuFIMWV:APA91bHa9eT74fkeP4LVydr1f6r3YkzwXs8D7UcAq1i7BZahtlFXAxVqkCR890qFCrkIcFnch1VNNVcdOACCl9F-iC4oudGqElY7Q2SnOgAXbYSMkH61wbYtVhXX8VZ7GIpTZGIB_VwD';
    const firebaseToken = clientToken;

    // firebase.initializeApp({
    //     credential: firebase.credential.cert(serviceAccount),
    //     databaseURL: "https://jovial-branch-295110-default-rtdb.firebaseio.com/"
    // });

    const payload = {
        notification: {
            title: 'Notification Title',
            subtitle : "test subtitle",
            body: 'This is an my noti',
            image: "https://solarianprogrammer.com/images/2015/05/08/circles.jpg",
            click_action: "/"


        },
       
    };

    const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24, // 1 day
    };

    firebase.messaging().sendToDevice(firebaseToken, payload, options);
    console.log("sent by func");
    // res.send("sending noti");      

}

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});