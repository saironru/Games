// // Required Modules
// var express    = require("express");
// var morgan     = require("morgan");
// var app        = express();

// var port = process.env.PORT || 3002;

// app.use(morgan("dev"));
// //app.use(express.static("../dist/li/"));

// app.get("/", function(req, res) {
//     res.sendFile("../dist/li/index.html"); //index.html file of your angularjs application
//     //res.render('../dist/li/index.html');

// });

// app.route('/*').get(function(req, res) { 
//     res.sendFile(path.join(config.root, '../dist/li/index.html')); 
// });

// // Start Server
// app.listen(port, function () {
//     console.log( "Express server listening on port " + port);
// });

const path = require('path');
const express = require('express');
const app = express();
app.use(express.static('../dist/li/'))
app.get('/', (req, res) => {
    res.sendFile(`../dist/li/index.html`);
});
app.listen(3333, () => {
    console.log('Application listening on port 3333!');
});