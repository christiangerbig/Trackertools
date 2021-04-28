const RequestModel = require("../models/Request.model");

const router = require("express").Router();

/* Get home page */
router.get(
  "/",
  (req, res, next) => {
    res.render(
      "index.hbs",
      {
        title: "Welcome Users on Trackertools Website"
      }
    );
  }
);

/* Get TonePortaStep page */
router.get(
  "/toneportastep/",
  (req, res, next) => {
    res.render(
      "toneportastep.hbs",
      {
        title: "Welcome Users on TonePortaStep Website"
      }
    );
  }
);

/* Get VolSlideStep page */
router.get(
  "/volslidestep/",
  (req, res, next) => {
    res.render(
      "volslidestep.hbs",
      {
        title: "Welcome Users on VolSlideStep Website"
      }
    );
  }
);

/* Get SearchFxCmd page */
router.get(
  "/searchfxcmd/",
  (req, res, next) => {
    res.render(
      "searchfxcmd.hbs",
      {
        title: "Welcome Users on SearchFxCmd Website"
      }
    );
  }
);

/* Get UsedFxCmd page */
router.get(
  "/usedfxcmd/",
  (req, res, next) => {
    res.render(
      "usedfxcmd.hbs",
      {
        title: "Welcome Users on UsedFxCmd Website"
      }
    );
  }
);

/* Get Contact page */
router.get(
  "/contact/",
  (req, res, next) => {
    res.render(
      "contact.hbs",
      {
        title: "Welcome Users on Contact Website"
      }
    );
  }
);

// Post Contact page
router.post(
  "/contact/",
  (req, res, next) => {
    const { email, message } = req.body;
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