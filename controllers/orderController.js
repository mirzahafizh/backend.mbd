const db = require("../config/db");

exports.createOrder = async (req, res) => {
  const { userId, productData, shippingStatus, paymentStatus } = req.body;

  try {
    // Adjust the order of parameters to match the stored procedure
    const orderQuery = "CALL create_order(?, ?, ?, ?)";
    const result = await db.executeQuery(orderQuery, [
      userId,
      JSON.stringify(productData),
      paymentStatus,
      shippingStatus,
    ]);

    // Assuming the stored procedure returns the inserted order ID
    res.json({ message: "Orders created", orderId: result[0].insertId }); // Adjust based on your result structure
  } catch (err) {
    console.error("Error creating order:", err); // Log the error for debugging
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderByUserId = async (req, res) => {
  const { userId } = req.params; // Mengambil userId dari parameter URL

  try {
    const orderQuery = "CALL get_order_by_user_id(?)";
    const result = await db.executeQuery(orderQuery, [userId]);

    // Pastikan result ada dan sesuai dengan struktur yang diharapkan
    if (result && result.length > 0) {
      res.json({ message: "Orders retrieved", orders: result });
    } else {
      res.json({ message: "No orders found for this user" });
    }
  } catch (err) {
    console.error("Error retrieving orders:", err); // Log error untuk debugging
    res.status(500).json({ error: err.message });
  }
};

// Contoh fungsi lainnya dapat ditambahkan di sini...
