var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var stripe = require('stripe')('sk_test_3AgSChpjOngrWOS8J7LdR36700PaSA0xdr');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var productsRouter = require('./routes/porducts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);

app.post('/payment', function (req, res) {
    var token = req.body.stripeToken;
    var amount = req.body.amount;
    var charge = stripe.charges.create({
        amount: amount,
        currency: "usd",
        source: token
    }, function (err, charge) {
        if (err) throw err
    });
    req.session.destroy();
    res.redirect("/");
})

app.locals.formatMoney = function (number) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

module.exports = app;
