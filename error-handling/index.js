module.exports = (app) => {
  app.use(
    (req, res, next) => res.status(404).render("not-found")
  );

  app.use(
    (err, req, res, next) => {
      console.error("ERROR", req.method, req.path, err);
      // Only render if error ocurred before sending response
      if (!res.headersSent) res.status(500).render("error");
    }
  );
}