"use strict";


var nicknameDiv = document.getElementById("show_nickname");
var changeButton = document.getElementById("change_nickname_btn");
var changeDiv = document.getElementById("change_nickname");

function toggleNameArea(){
	nicknameDiv.classList.toggle("hide");
	changeDiv.classList.toggle("show");
}

changeButton.addEventListener("click", function(){
	toggleNameArea();
	document.getElementById("nickname_input").focus();
});
changeDiv.addEventListener("submit", function(){
	toggleNameArea();
	document.getElementsByTagName("h1")[0].innerHTML = "Name: " + document.getElementById("nickname_input").value;
	document.getElementById("msg_input").focus();
});