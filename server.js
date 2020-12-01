const express = require("express");
const path = require("path");
const serveStatic = require("serve-static");

let app = express();
app.use(serveStatic(path.join(__dirname, "/dist")));

app.use(function forceLiveDomain(req, res, next) {
  // Don't allow user to hit Heroku now that we have a domain
  var host = req.get("Host");
  if (host === "natethedev-votingappfrontend.herokuapp.com/") {
    return res.redirect(301, "https://votingapp.natethedev.com");
  }
  return next();
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
