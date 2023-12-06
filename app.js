var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var assistantsRouter = require('./routes/assistants');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/assistants', assistantsRouter);

// setup connection to mongo
const mongoose = require('mongoose');

const DB_URL = "mongodb+srv://trabajoFIS:FIS2324@assistants-service.gonxlob.mongodb.net/"
console.log("Connecting: %s", DB_URL);
mongoose.connect(DB_URL);
const db = mongoose.connection;

// recover from errors
db.on('error', console.error.bind(console, 'db connection error'));

module.exports = app;