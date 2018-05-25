var express = require('express');
var router = express.Router();
var Company    = require('../models/company');
// ================//
// COMPANY ROUTES  //
// ================//

// INDEX route. Show all companies
router.get('/', (req, res) => {
  Company.find({}, (err, allCompanies) => {
    if(err){
      console.log('err')
    } else {
      res.render('../client/src/views/companies/index', {companies:allCompanies});
    }
  });
});

// CREATE route. Add new company to DB.
router.post('/', isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var caption = req.body.caption; //delete this after, I only need name
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCompany = {name: name, image: image, caption: caption, description: desc, author: author}
  // create a new company and save to db
  Company.create(newCompany, (err, newlyCreated) => {
    if(err) {
      console.log('err');
    } else {
      // redirect back to the companies page
      res.redirect('/companies');
    }
  });
});

// NEW route. Display form to create a new company
router.get('/new', isLoggedIn, (req, res) => res.render('../client/src/views/companies/new'));

// SHOW route. shows more info about one company
router.get('/:id', (req, res) => {
  Company.findById(req.params.id).populate("comments").exec((err, foundCompany) => {
    if(err) {
      console.log(err);
    } else {
      res.render('../client/src/views/companies/show', {company: foundCompany});
    }
  });
});

//EDIT route. Edit company
router.get("/:id/edit", (req, res) => {
  Company.findById(req.params.id, (err, foundCompany) => {
    if (err) {
      res.redirect("/companies");
    } else {
      res.render("../client/src/views/companies/edit", {company: foundCompany});
    }
  })
})

//UPDATE route
router.put("/:id", (req, res) => {
  Company.findByIdAndUpdate(req.params.id, req.body.company, (err, updatedCompany) => {
    if (err) {
      res.redirect("/companies");
    } else {
      res.redirect('/companies/' + req.params.id);
    }
  });
});

//DESTROY route
router.delete("/:id", (req, res) => {
  Company.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/companies");
    } else {
      res.redirect('/companies/');
    }
  });
})

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;