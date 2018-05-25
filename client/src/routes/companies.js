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
router.post('/', (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var caption = req.body.caption;
  var desc = req.body.description;
  var newCompany = {name: name, image: image, caption: caption, description: desc}
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

// NEW route. Displays form to make a new company
router.get('/new', (req, res) => res.render('../client/src/views/companies/new'));

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

module.exports = router;