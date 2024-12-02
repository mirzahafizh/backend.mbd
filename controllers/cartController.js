const db = require("../config/db");

const addToCart = async (req, res) => {
    try {
      const { product_id, quantity } = req.body;
      const user_id = req.user.id;
  
      // Call the stored procedure to add or update cart item
      await db.executeQuery("CALL add_to_cart(?, ?, ?)", [
        user_id,
        product_id,
        quantity,
      ]);
  
      // Call the function to calculate the total and update prices
      const [result] = await db.executeQuery("SELECT calculate_total(?) AS total", [user_id]);
  
      res.json({
        message: "Product added to cart or updated successfully",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

const getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Call the stored procedure to get cart items
    const cartItems = await db.executeQuery("CALL get_cart(?)", [user_id]);

    res.json({
      success: true,
      message:
        cartItems.length === 0
          ? "Cart is empty"
          : "Cart items retrieved successfully",
      cartItems,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Function to calculate total cart price using SQL function
const getCartTotal = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Using SQL function to calculate total cart price
    const result = await db.executeQuery("SELECT calculate_total(?) AS total", [
      user_id,
    ]);

    res.json({
      success: true,
      total: result[0].total,
      message: "Total cart price retrieved successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Using view to fetch cart details from user_cart_view
    const cartItems = await db.executeQuery(
      "SELECT * FROM user_cart_view WHERE user_id = ?",
      [user_id]
    );

    res.json({
      success: true,
      message:
        cartItems.length === 0
          ? "Cart is empty"
          : "Cart items retrieved successfully",
      cartItems,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Call the stored procedure to delete cart item
    await db.executeQuery("CALL delete_cart_item(?)", [id]);

    // Send a success response
    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  getCartTotal, // New function to get cart total
  getCartByUserId,
  deleteCartItem,
};
