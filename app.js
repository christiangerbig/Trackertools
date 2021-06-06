// Access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// Connect to database
require("./db");

// Handle http requests
// https://www.npmjs.com/package/express
const express = require("express");

// Handle handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// Function for middleware
require("./config")(app);

// Default value for title local
const projectName = "Trackertools";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with IronGenerator`;

// Set up connect-mongo
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

app.use(
  session(
    {
      secret: "NotMyAge",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 // milliseconds.  expiring in 1 day
      },
      store: new MongoStore(
        {
          mongooseConnection: mongoose.connection,
          ttl: 60 * 60 * 24 // seconds. expiring in 1 day
        }
      )
    }
  )
);

// Handle routes
const index = require("./routes/index");
app.use(
  "/",
  index
);

// Handle errors
require("./error-handling")(app);

module.exports = app;