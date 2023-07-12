const router = require("express").Router();
const RequestModel = require("../models/Request.model");

// GET Home
router.get("/", (req, res) => {
  res.render("index.hbs", { title: "Trackertools" });
});

// GET Tone Portamento Step
router.get("/toneportastep", (req, res) => {
  res.render("tone-portamento-step.hbs", { title: "Tone Portamento Step" });
});

// GET Volume Slide Step
router.get("/volslidestep", (req, res) => {
  res.render("volume-slide-step.hbs", { title: "Volume Slide Step" });
});

// GET Search Fx Commands
router.get("/searchfxcmd", (req, res) => {
  res.render("search-fx-commands.hbs", { title: "Search Fx Commands" });
});

// GET Used Fx Commands
router.get("/usedfxcmd", (req, res) => {
  res.render("used-fx-commands.hbs", { title: "Used Fx Commands" });
});

// GET Contact
router.get("/contact", (req, res) => {
  res.render("contact.hbs", { title: "Contact" });
});

// POST Contact
router.post("/contact", (req, res) => {
  const {
    body: { email, message },
  } = req;
  if (!email || !message) {
    res.render("contact.hbs", {
      errorMessage: "Please enter all fields",
    });
    return;
  }
  // Validate email
  const regEx = /\S+@\S+\.\S+/;
  if (!regEx.test(email)) {
    res.render("contact.hbs", {
      errorMessage: "Email not in valid format",
    });
    return;
  }
  const request = {
    email,
    message,
  };
  RequestModel.create(request)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
