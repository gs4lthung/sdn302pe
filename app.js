var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
require("dotenv").config();
const methodOverride = require("method-override");
const handlebars = require("express-handlebars");

var app = express();
const db = require("./config/db");
const session = require("express-session");
const MongoStore = require("connect-mongo");
db.connect();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
    },
  })
);

// view engine setup
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    helpers: {
      increment: function (value) {
        return value + 1;
      },
      eq: function (a, b) {
        return String(a) === String(b);
      },
      range: function (n) {
        return [...Array(n).keys()];
      },
      formatDate: (date, format) => {
        return moment(date).format(format);
      },
    },
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));

const authRouter = require("./routes/auth");
const { jwtMiddleware } = require("./middlewares/auth.middleware");

// app.use((req, res, next) => {
//   res.locals.error = req.session.error;
//   req.session.error = null;
//   next();
// });

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/api/courses", jwtMiddleware, require("./routes/course"));
app.use("/view/sessions", require("./routes/section"));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  req.session.accessToken = null;
  req.session.username = null;
  req.session.courses = null;
  req.session.sections = null;

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
