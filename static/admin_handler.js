var alltokens = document.getElementById("token_data").getAttribute("data")
data = JSON.parse(alltokens);
console.log(data);

for (x in data) {
    if (data[x]["device_token"]) {
        createNotiBtn(data[x]["device_token"]);
    }
    // console.log(data[x]["username"]);
}

function createNotiBtn(token) {
    var noti_form = document.createElement("form");
    noti_form.method = "POST";
    noti_form.action = "/admin";

    var noti_token = document.createElement("input");
    noti_token.type = "hidden";
    noti_token.value = token;
    noti_token.name = "tokenOfClient";

    noti_form.appendChild(noti_token);

    var noti_send = document.createElement("button");
    noti_send.type = "submit";
    noti_send.innerHTML = "Send Noti -- " + token.slice(0, 20);

    noti_form.appendChild(noti_send);

    document.getElementById("noti_div").appendChild(noti_form);

}

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

    var savedbbtn = document.getElementById("dbsave");
    savedbbtn.style.display = "block";
    console.log("Savebtn display");
    savedbbtn.onclick = function () {
        savetodb(this, id_token);
    }
    document.getElementById("signOut").style.display = "block";

}

function savetodb(btn, id_token) {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    var theUrl = "/auth";
    xmlhttp.open("POST", theUrl);
    xmlhttp.onload = function () {
        console.log(xmlhttp.responseURL); // http://example.com/test
        btn.innerHTML = "Saved";
    };

    xmlhttp.onerror = function () {
        console.log("** An error occurred during the transaction");
        btn.innerHTML = "TRy Again - Save in db";

    };
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({
        useridtoken: id_token
    }));
}
console.log("test");
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    var savedbbtn = document.getElementById("dbsave");
    savedbbtn.style.display = "block";
    document.getElementById("signOut").style.display = "none";

}


