var express = require('express');
var router = express.Router();
var passport   = require('passport');
var User    = require('../models/user');


// ================//
//   AUTH ROUTES   //
// ================//

//SHOW register form
router.get("/register", (req, res) => {
  res.render("../client/src/views/register");
});

//handle signup logic
router.post("/register", (req, res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render("../client/src/views/register")
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/companies");
    });
  });
});

//show login form
router.get("/login", (req, res) => {
  res.render("../client/src/views/login");
});

//handle login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/companies",
    failureRedirect: "/login"
  }), (req, res) => {
});

//logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/companies")
});

//middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router