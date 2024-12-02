const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authentication');
const productController = require('../controllers/productControllers');

router.post('/products', authenticateToken, productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/user/:id_user',authenticateToken, productController.getProductsByUserId);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', authenticateToken, productController.updateProduct);
router.delete('/products/:id', authenticateToken, productController.deleteProduct);
router.get('/search', productController.searchProducts);
module.exports = router;
