// Not sure if best practice is to "use strict" globally or in functions
"use strict";

/* Easier to do initialize this way, but I don't like it...

var app = require("express")();
var serv = require("http").Server(app);
var io = require("socket.io")(serv);

*/

var express = require("express");
var http = require("http");
var socket = require("socket.io");

// create an express app
var app = express();

// create an http server to serve our express app
var serv = http.Server(app);

// mount a socket.io server onto our regular http server
var io = socket(serv);

// when the root of the site is accessed, call a callback function,
// and pass into it the received REQUEST object and an (empty?) RESPONSE
// object, then just send our index.html file.
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// have the SOCKET.IO server listen for connection events,
// then call a callback function and pass into it the SOCKET object that's
// been instantiated client-side
io.on("connection", function(socket){
	console.log("a user connected");
	socket.nickname = "Anonymous";

	socket.on("disconnect", function(){
		console.log('user disconnected');
	});

	socket.on("nickname set", function(nickname){
		socket.nickname = nickname;
	})

	socket.on("chat message", function(message){
		console.log(socket.nickname + " says: " + message);
		io.emit("message published", {
			nickname: socket.nickname,
			message: message
		});
	})
});

// have the HTTP server listen for requests on port 3000
serv.listen(3000, function() {
    console.log("Listening on *:3000...");
});
