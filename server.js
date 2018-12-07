const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require("express-session");
const bodyParser = require("body-parser");
const router = require('./routes');

var app = express();
const PORT = 8080;

//app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize(), function(req, res, next) {
  //console.log('Invoked passport');
  next();
});
app.use(passport.session());
app.use(router);

mongoose.connect('mongodb://localhost/passportDB');

app.listen(PORT, function() {
  console.log(`API server listening on port ${PORT}`);
});
