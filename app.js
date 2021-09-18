require("dotenv").config();
require("./db");

const express = require("express");
const hbs = require("hbs");
const app = express();

// Run middlewares
require("./config")(app);

const projectName = "Trackertools";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with IronGenerator`;

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

app.use(
  session({
    secret: "NotMyAge",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // In milliseconds expiring in 1 day
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24, // In seconds expiring in 1 day
    }),
  })
);

// Routes
const index = require("./routes/index");
app.use("/", index);

// Error handling
require("./error-handling")(app);

module.exports = app;
