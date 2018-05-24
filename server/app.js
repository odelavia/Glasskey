const path       = require('path'),
      express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      passport   = require('passport'),
      LocalStrategy   = require('passport-local'),
      Company    = require('../client/src/models/company'),
      seedDB     = require('../client/src/seeds')
      Comment    = require('../client/src/models/comment'),
      User    = require('../client/src/models/user');

mongoose.connect('mongodb://localhost/glass_key');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
seedDB();

app.use(express.static(__dirname + '../client/dist'));

//seed data, adds a new company everytime we run this server
Company.create(
  {
    name: 'Glassdoor',
    image: 'data:image/png;base64,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',
    description: 'Glassdoor is like yelp but for reviewing companies and their work culture'
  }, (err, company) => {
    if(err) {
      console.log(err);
    } else {
      console.log('NEWLY CREATED COMPANY: ');
      console.log(company);
    }
  });

app.get('/', (req, res) => res.render('../client/src/views/landing'));


//  index route. Displays a list of all companies
app.get('/companies', (req, res) => {
  Company.find({}, (err, allCompanies) => {
    if(err){
      console.log('err')
    } else {
      res.render('../client/src/views/companies/index', {companies:allCompanies});
    }
  });
});

// create route. Add new company to DB.
app.post('/companies', (req, res) => {
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

// new route. Displays form to make a new company
app.get('/companies/new', (req, res) => res.render('../client/src/views/companies/new'));

//show route. shows more info about one company
app.get('/companies/:id', (req, res) => {
  Company.findById(req.params.id).populate("comments").exec((err, foundCompany) => {
    if(err) {
      console.log(err);
    } else {
      res.render('../client/src/views/companies/show', {company: foundCompany});
    }
  });
});

// Comments route.
app.get('/companies/:id/comments/new', (req, res) => {
  Company.findById(req.params.id, (err, company) => {
    if(err) {
      console.log(err);
    } else {
      res.render('../client/src/views/comments/new', {company: company});
    }
  });
});

// create comment route. Add new comment to DB.
app.post('/companies/:id/comments', (req, res) => {
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
          company.comments.push(comment);
          company.save();
          res.redirect('/companies/' + company._id);
        }
      });
    }
  });
});

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.listen(8000, () => console.log('glasskey server is listening on port 8000!'));