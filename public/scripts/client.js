"use strict";

// create an io object, "socket"; this object represents the
// client-specific socket (?). I think (?) this triggers the
// socket.io server object to emit a "connection" event when it
// is declared, but I'll have to figure that out... because this
// object is not equivalent to the "io" object server-side.
// Pretty sure it emits the "disconnect" event when it is torn
// down (?).
// It's definitely passed alongside the "connection" event,
// so it can be funneled into the callback function for the
// connection listener on the socket.io server.
// On the other hand, once it has been passed during that event,
// it is not editable from this side. It can emit events, but
// you can't, say, add an attribute to the object and have the
// server read that attribute. I tried that by adding a 
// "socket.nickname = nicknameBox.value" and then trying to
// read that on the server after the connection had been made.
// doesn't work.
var socket = io();

var nicknameForm = document.getElementById("nickname_form");
var nicknameBox = document.getElementById("nickname_input");
var msgForm = document.getElementById("msg_form");
var msgBox = document.getElementById("msg_input");

// on submit, prevent the default behavior (page would reload,
// causing disconnect/connect events, etc.), then emit a "chat
// message" event along with the text from the input box. Then
// clear the message box.
msgForm.addEventListener("submit", function(event){
  event.preventDefault();
  socket.emit("chat message", msgBox.value);
  msgBox.value = "";
});

// if the user presses enter, submit the form. Ctrl+Enter will
// insert a new line, like normal.
msgBox.onkeydown = function(event){
	if(event.keyCode === 13 && !event.shiftKey){
		event.preventDefault();
		var submitEvent = new Event("submit", {
			"bubbles": true,
			"cancelable": true
		});
		msgForm.dispatchEvent(submitEvent);
	}
};

nicknameForm.addEventListener("submit", function(event){
  event.preventDefault();
  socket.emit("nickname set", nicknameBox.value);
});

socket.addEventListener("message published", function(msg_object){
  var msgContainer = document.getElementById("messages_container");
  var msgList = document.getElementById("messages");
  var newMsg = document.createElement("li");

  var isAtBottom = (document.body.scrollHeight - window.innerHeight) <= (window.pageYOffset + 1);
  
  newMsg.innerHTML = "<h2>" + msg_object.nickname + ":</h2> " + msg_object.message;
  msgList.appendChild(newMsg);
  
  if(isAtBottom){
  	window.scroll(0, 1000);
  }
});
