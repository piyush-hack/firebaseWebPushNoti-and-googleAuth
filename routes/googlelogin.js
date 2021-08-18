const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');
const c_noti_token = require('../models/notiloginschema');
app.use(express.static("uploads"))
app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
const { OAuth2Client } = require('google-auth-library');

router.route("/").get((req, res) => {
    res.status(200).render('googleLogin');

});

router.route("/").post((req, res) => {

    var user_idtoken = req.body.useridtoken;
    console.log(user_idtoken);
    //or send post or get at https://oauth2.googleapis.com/tokeninfo?id_token=client_idtoken to verify user
    const client = new OAuth2Client("92463015553-fv6fqpch3hifsd9tjjda92pq0n23nbfm.apps.googleusercontent.com");
    async function verify() {
        console.log("verifying");
        const ticket = await client.verifyIdToken({
            idToken: user_idtoken,
            audience: "92463015553-fv6fqpch3hifsd9tjjda92pq0n23nbfm.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];

        console.log(payload['given_name'])
        const user = new c_noti_token({
            username: payload.given_name,
            usermail: payload.email
        });

        // Inserts a new document with `name = 'Will Riker'` and
        // `rank = 'Commander'`
        user.save();
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    }
    verify().catch(console.error);

    res.status(200).render('admin');

});


module.exports = router;
