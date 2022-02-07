var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var db = require('monk')('localhost:27017/E-CommerceDB');


var { check, validationResult } = require('express-validator');

var session = require('express-session');

/* GET home page. */
router.get('/', function (req, res, next) {
  var categories = db.get('categories');
  var products = db.get('products');
  products.find({}, {}, function (err, product) {
    categories.find({}, {}, function (err, category) {
      res.render('index', {
        categories: category, products: product
      });
    })
  })
});

router.post('/cart/', function (req, res, next) {
  var products = db.get('products');
  var product_id = req.body.product_id;
  req.session.cart = req.session.cart || {};
  var cart = req.session.cart;
  products.find({
    _id: product_id
  }, {}, function (err, product) {
    if (cart[product_id]) {
      cart[product_id].qty++;
    } else {
      product.forEach(function (item) {
        cart[product_id] = {
          item: item._id,
          title: item.name,
          price: item.price,
          qty: 1,
          img: item.img
        }
      });
    }
    res.redirect('/products/cart');
  });
});

router.get('/cart', function (req, res, next) {
  var cart = req.session.cart;
  var displayCart = { items: [], total: 0 };
  var total = 0;
  for (item in cart) {
    displayCart.items.push(cart[item]);
    total += (cart[item].qty * cart[item].price);
  }
  displayCart.total = total;
  res.render('cart', { cart: displayCart });
});
module.exports = router;
