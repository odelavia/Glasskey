var express = require('express');
var router = express.Router({mergeParams: true});
var Company = require('../models/company');
var Comment = require('../models/comment');
var middleware = require("../../../server/middleware");

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

//EDIT route
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect("back")
    } else {
      res.render("../client/src/views/comments/edit", {company_id: req.params.id, comment: foundComment})
    }
  });
});

//UPDATE route
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect('/companies/' + req.params.id);
    }
  });
})

//DESTROY route
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect('/companies/' + req.params.id);
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

function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;