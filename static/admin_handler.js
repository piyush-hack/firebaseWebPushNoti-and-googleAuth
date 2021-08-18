var alltokens = document.getElementById("token_data").getAttribute("data")
data = JSON.parse(alltokens);
console.log(data);



for (x in data) {
    if (data[x]["device_token"]) {
        createNotiBtn(data[x]["device_token"]);
    }
    // console.log(data[x]["username"]);
}

const theButton = document.querySelector(".button");

theButton.addEventListener("click", () => {
    alert("If You Want To Send Noti To Same Device From Which You Are Accessing This Page Then Put This Tab In Background WithIn 7 sec After Clicking Ok");
    theButton.classList.add("button--loading");
    theButton.style.color = "#007a63";
});


function createNotiBtn(token) {
    var noti_form = document.createElement("form");
    noti_form.method = "POST";
    noti_form.action = "/noti/admin";

    var noti_token = document.createElement("input");
    noti_token.type = "hidden";
    noti_token.value = token;
    noti_token.name = "tokenOfClient";

    noti_form.appendChild(noti_token);

    var noti_send = document.createElement("button");
    noti_send.type = "submit";
    noti_send.style.color = "#ffffff";
    noti_send.classList.add("button");
    noti_send.innerHTML = "Send Noti -- " + token.slice(0, 20);

    noti_form.appendChild(noti_send);

    document.getElementById("noti_div").appendChild(noti_form);

}




