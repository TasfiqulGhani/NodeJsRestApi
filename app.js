var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var bodyParser= require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

mongoose.connect('mongodb+srv://tashfik:TASH123$h@cluster0-cyypu.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
var app = express();
mongoose.Promise = global.Promise;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;




