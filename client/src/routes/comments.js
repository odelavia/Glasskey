var express = require('express');
var router = express.Router({mergeParams: true});
var Company = require('../models/company');
var Comment = require('../models/comment');

// COMMENTS NEW route
router.get('/new', isLoggedIn, (req, res) => {
  Company.findById(req.params.id, (err, company) => {
    if(err) {
      console.log(err);
    } else {
      res.render('../client/src/views/comments/new', {company: company});
    }
  });
});

// COMMENTS CREATE
router.post('/', isLoggedIn, (req, res) => {
  // find company creat and save new comment to db
  Company.findById(req.params.id, (err, company) => {
    if(err) {
      console.log('err');
      res.redirect('/companies');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if(err) {
          console.log('err');
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          company.comments.push(comment);
          company.save();
          res.redirect('/companies/' + company._id);
        }
      });
    }
  });
});

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;