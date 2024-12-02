const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController'); // Pastikan jalur benar
const authenticateToken = require('../middleware/authentication');
// Menambahkan item ke wishlist
router.post('/wishlist/add',authenticateToken, wishlistController.addToWishlist);

// Mendapatkan semua item wishlist berdasarkan user_id
router.get('/wishlist/:user_id',authenticateToken, wishlistController.getWishlistByUserId);

// Menghapus item dari wishlist
router.delete('/wishlist/delete/:id',authenticateToken, wishlistController.deleteWishlistItem);

module.exports = router;
