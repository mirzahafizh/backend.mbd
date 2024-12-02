const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/authentication');
// Route untuk membuat pengguna baru
router.post('/register', UserController.createUser);

// Route untuk login pengguna
router.post('/login', UserController.loginUser);
// Route untuk mendapatkan semua pengguna (protected route)
router.get('/users', auth, UserController.getAllUsers);

// Route untuk mendapatkan pengguna berdasarkan ID (protected route)
router.get('/users/:id', auth, UserController.getUserById);
module.exports = router;
