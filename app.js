var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session')

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var listRouter = require('./routes/list');
var authRouter = require('./routes/auth');

var { syncDB } = require('./models/conf');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  // In a production application the secret would be 
  // loaded from an enviroment variable and not committed to the repository.
  secret: 'dummy secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
}));

// Initializes the tables in the database if they're not yet created.
syncDB();

// Store information related to app registration with Github.
// We store these in loca variables so they can be accessed anywhere in the app.
app.locals.clientId = 'c55ffa3bf7b54760958f';
// In a production application the secret would be 
// loaded from an enviroment variable and not committed to the repository.
app.locals.clientSecret = 'afd14eb531de74933fec2f6ee4ca7c179c55d418';

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/list', listRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
