//3rd party modules
var bodyParser = require('body-parser');
var express = require('express');
var ip = require('ip');
var app = express();

//socket.io config
var Server = require('http').Server(app)
var io = require('socket.io')(Server);

//server variables
var serverIP = ip.address().toString();
var serverPort = 8080;

//movement handler setup
var movementHandler = require('./movementHandler.js');
movementHandler.startup(io);

//directory accessable by users
var publicDir = __dirname + '/public/';

//express configuration
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(publicDir));

//when connect to adress send game1.html
app.get('/', function(req, res){
    res.sendFile(publicDir + 'game1.html');
});

//start server
Server.listen(serverPort, serverIP);
console.log('server online at ' + serverIP + ':' + serverPort);