// Not sure if best practice is to "use strict" globally or in functions
"use strict";

/* Easier to do initialize this way, but I don't like it...

var app = require("express")();
var serv = require("http").Server(app);
var io = require("socket.io")(serv);

...etc.

*/

var express = require("express");
var http = require("http");
var socket = require("socket.io");
var helmet = require("helmet");
var auth = require("basic-auth");
var fs = require("fs");
var bodyParser = require("body-parser");
var users = require(__dirname + "/users.json");

// create an express app
var app = express();

// use basic http header security measures
app.use(helmet());

// the following two middleware functions serve to parse
// the bodies of all incoming requests.
// they place the parsed data on a "body" object on the
// request, so data can be accessed like: req.body.username
// 1) parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// 2) parse application/json
app.use(bodyParser.json());

// create an http server to serve our express app
var serv = http.Server(app);

// mount a socket.io server onto our regular http server
var io = socket(serv);

// statically serve the styles and scripts
app.use("/styles", express.static(__dirname + "/public/styles"));
app.use("/scripts", express.static(__dirname + "/public/scripts"));


app.get("/marathon", function(req, res){
	res.sendFile(__dirname + "/pages/auth.html");
});

app.post("/marathon", function(req, res){
	var uname = req.body.username;
	var pwd = req.body.password;
	if (!users[uname] || pwd !== users[uname]){
		res.sendFile(__dirname + "/pages/reauth.html");
	} else {
		res.sendFile(__dirname + "/pages/main.html");
	}
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
		console.log("User \"" + socket.nickname + "\" is now \"" + nickname + "\"");
		socket.nickname = nickname;
	});

	socket.on("chat message", function(message){
		console.log(socket.nickname + " says: " + message);
		io.emit("message published", {
			nickname: socket.nickname,
			message: message
		});
	});
});

// have the HTTP server listen for requests on port 3000
serv.listen(3000, function() {
    console.log("Listening on *:3000...");
});
