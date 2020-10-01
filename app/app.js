const express = require('express');
const dotenv = require('dotenv');
const app = express();

const path = require('path');
dotenv.config({path: path.join(__dirname,'.env')});

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const cors = require('cors');
app.use(cors());

const config = require('./config/config');

mongoose.connect( config.mongo.url,{ useNewUrlParser: true });
// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
const index = require('./routes/index');
  
// routes
app.use('/', index);
app.use(express.static(path.join(__dirname, '../')));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(error, req, res, next) {
  res.status(error.status || 500).json({ status:error.status, message:error.message, error });
});

module.exports = app;
