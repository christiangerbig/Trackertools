// Access to the `body` property in requests
const express = require("express");

// Handle messages from the terminal as requests come in
// https://www.npmjs.com/package/morgan
const logger = require("morgan");

// Handle cookies
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require("cookie-parser");

// Custom favicon
// https://www.npmjs.com/package/serve-favicon
const favicon = require("serve-favicon");

// `normalize` paths amongst different operating systems
// https://www.npmjs.com/package/path
const path = require("path");

// Middleware configuration
module.exports = (app) => {
  // In development environment app logs
  app.use(logger("dev"));

  // Access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Normalize path to the views folder
  app.set(
    "views", 
    path.join(
      __dirname, 
      "..", 
      "views"
    )
  );
  // Set view engine to handlebars
  app.set(
    "view engine", 
    "hbs"
  );
  // Handle access to public folder
  app.use(
    express.static(
      path.join(
        __dirname, 
        "..", 
        "public"
      )
    )
  );

  // Handle access to favicon
  app.use(
    favicon(
      path.join(
        __dirname, 
        "..", 
        "public", 
        "images", 
        "favicon.ico"
      )
    )
  );
}