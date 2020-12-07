var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors')
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
const fetch = require('node-fetch')
const redis = require('redis')
const dotenv = require('dotenv')
const session = require('express-session')
const responseTime = require('response-time')
var RedisStore = require("connect-redis")(session)




dotenv.config({path: './config/config.env'})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('trust proxy', 1);

app.use(session({
  // store: new RedisStore({
  //   host: "localhost",
  //   port: 6379,
  //   client: redis
  // }),
  cookie:{
    secure: true,
    maxAge:60000
       },
  store: new RedisStore()
	secret: process.env.SESSION_SECRET,
	saveUninitialized: false,
	resave: true,
}))

app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// if (process.env.REDIS_URL) {
//   // var rtg   = require("url").parse(process.env.REDISTOGO_URL);
//   // var redis = require("redis").createClient(rtg.port, rtg.hostname);
//   var client = require('redis').createClient(process.env.REDIS_URL)

//   redis.auth(rtg.auth.split(":")[1]);
// } else {
//   const REDIS_PORT = process.env.REDIS_PORT || 6379
//   // var redis = require("redis").createClient();
//   const client = redis.createClient(REDIS_PORT)
// }

const redisAuth = process.env.REDIS_AUTH || null
const PORT = process.env.PORT || 5000
const REDIS_PORT = process.env.REDIS_URL || 6379

var client = require('redis').createClient(REDIS_PORT)



app.listen(PORT, ()=>{
	console.log(`Server running on port: ${PORT}`)
})

