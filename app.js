const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const dotenv = require('dotenv'); 

dotenv.config(); 
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlistRoutes');
const app = express();
app.use(cors({
    methods: ['GET', 'POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());

// Menggunakan routes
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', userRoutes);
app.use('/api', cartRoutes);
app.use('/api', wishlistRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
