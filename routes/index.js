const router = require("express").Router();
const RequestModel = require("../models/Request.model");

// GET Home
router.get("/", (req, res) => {
  res.render("index.hbs", { title: "Trackertools" });
});

// GET TonePortaStep
router.get("/toneportastep", (req, res) => {
  res.render("toneportastep.hbs", { title: "TonePortaStep" });
});

// GET VolSlideStep
router.get("/volslidestep", (req, res) => {
  res.render("volslidestep.hbs", { title: "VolSlideStep" });
});

// GET SearchFxCmd
router.get("/searchfxcmd", (req, res) => {
  res.render("searchfxcmd.hbs", { title: "SearchFxCmd" });
});

// GET UsedFxCmd
router.get("/usedfxcmd", (req, res) => {
  res.render("usedfxcmd.hbs", { title: "UsedFxCmd" });
});

// GET Contact
router.get("/contact", (req, res) => {
  res.render("contact.hbs", { title: "Contact" });
});

// POST Contact
router.post("/contact", (req, res) => {
  const { email, message } = req.body;
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
