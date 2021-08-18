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

    document.getElementById("logintext").innerHTML = 
        `<form>
            <div class="form-group row">
            <label for="name" class="col-sm-2 col-form-label">Full Name:</label>
            <div class="col-sm-10">
                <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="${profile.getName()}">
            </div>
            </div>
            <div class="form-group row">
            <label for="name" class="col-sm-2 col-form-label">Given Name:</label>
            <div class="col-sm-10">
                <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="${profile.getGivenName()}">
            </div>
            </div>
            <div class="form-group row">
            <label for="name" class="col-sm-2 col-form-label">Family Name:</label>
            <div class="col-sm-10">
                <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="${profile.getFamilyName()}">
            </div>
            </div>
            <div class="form-group row">
            <label for="name" class="col-sm-2 col-form-label">Image URL:</label>
            <div class="col-sm-10">
                <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="${profile.getImageUrl()}">
            </div>
            </div>
            <div class="form-group row">
            <label for="name" class="col-sm-2 col-form-label">Email:</label>
            <div class="col-sm-10">
                <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="${profile.getEmail()}">
            </div>
            </div>
        
      </form>`
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
        console.log("** An error occurred during the sigin");
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
    window.location.reload();

}