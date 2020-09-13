require('rootpath')();
var expressfileupload  = require('express-fileupload');
const express = require('express');
const ejs = require('ejs');
var path = require('path');
const paypal = require('paypal-rest-sdk');
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AYjBaKtupv5peM-INo9F71PUrEUmcL0clkA0IDBOspPxa1TaLm5aH5bE0gVDj0uU-6URjQlrfNfUuZAK',
    'client_secret': 'EDSN1jLSY3yntoSL4pFvZ9YZyMX8LtCpdD70qIDNm5Zi91BtYVofd5x5mOSn17OakVq5F1yi9vVKYfN7'
  });

const app = express();
app.use(expressfileupload());
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// api routes
app.use('/users', require('./users/users.controller'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/content')));
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/forget', (req, res) => res.render('forget'));
app.get('/resetpassword', (req, res) => res.render('resetPassword'));

app.post('/pay', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/success",
          "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Red Sox Hat",
                  "sku": "001",
                  "price": "25.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "25.00"
          },
          "description": "Hat for the best team ever"
      }]
  };
  
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
  
  });
  
  app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": "25.00"
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
          res.send('Success');
      }
  });
  });
  
  app.get('/cancel', (req, res) => res.send('Cancelled'));


// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
app.listen(port, () => console.log('Server listening on port ' + port));