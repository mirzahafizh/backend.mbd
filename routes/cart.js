const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authentication');
const cartController = require('../controllers/cartController');


router.post('/add-to-cart', authenticate, cartController.addToCart);

router.get('/carts', authenticate,cartController.getCart);
router.get('/cart/user/:user_id', cartController.getCartByUserId);
router.delete('/cart/:id', authenticate, cartController.deleteCartItem);
router.get('/cart/get-cart-total', authenticate, cartController.getCartTotal);
module.exports = router;
