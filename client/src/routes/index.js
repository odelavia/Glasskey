var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//ROOT route
router.get('/', (req, res) => res.render('../client/src/views/landing'));

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
      return res.render("../client/src/views/register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/companies");
    });
  });
});

//show login form
router.get("/login", (req, res) => {
  res.render("../client/src/views/login", {message: req.flash("error")});
});

//handle login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/companies",
    failureRedirect: "/login"
  }), (req, res) => {
    console.log('this is where your code breaks');
});

//logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/companies")
});

//MIDDLEWARE
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;