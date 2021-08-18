const mongoose = require('mongoose');

const noti_token = new mongoose.Schema({
    usermail: String,
    username: String,
    device_token: String,

});

noti_token.methods.speak = function () {//this is used in case you wanna have have method callback
    const greeting = "token is " + this.device_token
    console.log(greeting);
}

module.exports = mongoose.model('noti_token', noti_token);
