const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');
const c_noti_token = require('../models/notiloginschema');
const firebase = require("firebase-admin");
const serviceAccount = require("../service-account-file.json");
app.use(express.static("uploads"))
app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

router.route("/").get((req, res) => {
    res.send("Visit generate token to create token");

});

router.route("/generateToken").get((req, res) => {
    res.sendFile('webpushtokengen.html', { root: __dirname });
});

router.route("/generateToken").post((req, res) => {
    const d_token = req.body.device_token;
    console.log(req.body.device_token);
    const c_token = new c_noti_token({
        device_token: `${d_token}`
    })
});


router.route("/toserver").post((req, res) => {
    const my_token = req.body.device_token;

    c_noti_token.find({ device_token: my_token }, function (err, someValue) {
        if (err) console.log(err);
        console.log("someValue", someValue[0]);

        if (someValue[0] == undefined) {
            console.log(req.body.device_token);
            const c_token = new c_noti_token({
                device_token: `${my_token}`
            });

            c_token.save();
            res.send("Your Token is : <br><br> " + my_token + " <br><br> Use This Token As <br> /noti/admin?device_token=[[TOKEN]] <br> Or <br> Simply Click Go To Send Noti Page");

        } else {
            res.send("Your Token is <br><br> " + my_token + " <br><br> Use This Token As <br> /noti/admin?device_token=[[TOKEN]] <br> Or <br> Simply Click Go To Send Noti Page");

        }

    });


    // res.send("done");
})

router.route("/admin").get((req, res) => {
    // console.log("get in admin "+req.query.device_token);
    const d_token = req.query.device_token;

    if (req.query.device_token) {
        c_noti_token.find({device_token : d_token}, function (err, someValue) {
            if (err) console.log(err);
            const params = { 'alltokens': JSON.stringify(someValue) };
            // console.log(params);
            res.status(200).render('admin', params);

        });
    } else {
        res.send("No token Found");
    }
    // res.status(200).render('index', params);
});


router.route("/admin").post((req, res) => {

    var clientToken = req.body.tokenOfClient;
    // sendnoti(clientToken, res);
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    wait(4 * 1000).then(() => {
        console.log("waited for 4 seconds");
        sendnoti(clientToken);

    });

    wait(8 * 1000).then(() => {
        console.log("waited for 8 seconds")
        res.send("Noti Sent")

    });

})

// The Firebase token of the device which will get the notification
// It can be a string or an array of strings
function sendnoti(clientToken) {

    // const firebaseToken = 'cCwYg6Lclvt5s9TKuFIMWV:APA91bHa9eT74fkeP4LVydr1f6r3YkzwXs8D7UcAq1i7BZahtlFXAxVqkCR890qFCrkIcFnch1VNNVcdOACCl9F-iC4oudGqElY7Q2SnOgAXbYSMkH61wbYtVhXX8VZ7GIpTZGIB_VwD';
    const firebaseToken = clientToken;


    const payload = {
        notification: {
            title: 'Notification Title',
            subtitle: "test subtitle",
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


module.exports = router;
