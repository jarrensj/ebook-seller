const express = require('express');
var configs = require('./configs.js');
var secret = configs.secret;
const stripe = require('stripe')(secret);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// set static folder
app.use(express.static(`${__dirname}/public`));

// index route
app.get('/', (req, res) => {
  res.render('index');
});

// charge route
app.post('/charge', (req, res) => {
  const amount = 1000;
  // console.log(req.body);
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount:amount,
    description: "Jarren's Ebook",
    currency: 'usd',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});

app.listen(3000,function(){
  console.log("listening on port 3000");
});
