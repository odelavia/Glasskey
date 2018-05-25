var Company = require("../../client/src/models/company");
var Comment = require("../../client/src/models/comment");
var middlewareObj = {};

middlewareObj.checkCompanyOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Company.findById(req.params.id, (err, foundCompany) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundCompany.author.id.equals(req.user._id)) {
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

middlewareObj.checkCommentOwnership = (req, res, next) => {
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

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = middlewareObj