const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const path = require("path");

// Middleware configuration
module.exports = (app) => {
  // Logs for development
  app.use(logger("dev"));

  // Access to `body` property in request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Normalize path to views folder
  app.set("views", path.join(__dirname, "..", "views"));

  // Set view engine to handlebars
  app.set("view engine", "hbs");

  // Access to public folder
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Access to favicon
  app.use(
    favicon(path.join(__dirname, "..", "public", "images", "favicon.ico"))
  );
};
