var alltokens = document.getElementById("token_data").getAttribute("data")
data = JSON.parse(alltokens);
console.log(data);

for(x in data){
    createNotiBtn(data[x]["device_token"]);
    console.log(data[x]["device_token"]);
}

function createNotiBtn(token){
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
