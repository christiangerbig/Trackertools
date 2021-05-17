const router = require("express").Router();
const RequestModel = require("../models/Request.model");

/* Get home page */
router.get(
  "/",
  (req, res, next) => {
    res.render(
      "index.hbs",
      {
        title: "Trackertools"
      }
    );
  }
);

/* Get TonePortaStep page */
router.get(
  "/toneportastep",
  (req, res, next) => {
    res.render(
      "toneportastep.hbs",
      {
        title: "TonePortaStep"
      }
    );
  }
);

/* Get VolSlideStep page */
router.get(
  "/volslidestep",
  (req, res, next) => {
    res.render(
      "volslidestep.hbs",
      {
        title: "VolSlideStep"
      }
    );
  }
);

/* Get SearchFxCmd page */
router.get(
  "/searchfxcmd",
  (req, res, next) => {
    res.render(
      "searchfxcmd.hbs",
      {
        title: "SearchFxCmd"
      }
    );
  }
);

/* Get UsedFxCmd page */
router.get(
  "/usedfxcmd",
  (req, res, next) => {
    res.render(
      "usedfxcmd.hbs",
      {
        title: "UsedFxCmd"
      }
    );
  }
);

/* Get Contact page */
router.get(
  "/contact",
  (req, res, next) => {
    res.render(
      "contact.hbs",
      {
        title: "Contact"
      }
    );
  }
);

// Post Contact page
router.post(
  "/contact",
  (req, res, next) => {
    const { email, message } = req.body;
    if (!email || !message) {
      res.render(
        "contact.hbs",
        { 
          errorMessage: "Please enter all fields" 
        }
      );
      return;
    }
    // validate if the user has entered email in the right format ( @ , .)
    // regex that validates an email in javascript
    const regEx = /\S+@\S+\.\S+/;
    if (!regEx.test(email)) {
      res.render(
        "contact.hbs",
        {
          errorMessage: "Email not in valid format" 
        }
      );
      return;
    }
    const request = {
      email: email,
      message: message
    };
    RequestModel.create(request)
      .then(
        () => {
          res.redirect(
            "/"
          );
        }
      )
      .catch(
        (err) => {
          console.log(err);
        }
      );
  }
);

module.exports = router;