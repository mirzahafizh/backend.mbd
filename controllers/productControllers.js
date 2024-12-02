const db = require("../config/db");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await db.executeQuery("CALL get_all_products()");
    res.json(products[0]); // Stored procedures return result sets as arrays
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await db.executeQuery("CALL get_product_by_id(?)", [id]);

    if (products[0].length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(products[0][0]);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const userId = req.user.id;

    // Validasi input
    if (!name || !description || !price || !stock) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await db.executeQuery(
      "INSERT INTO products (name, description, price, stock, id_user) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, stock, userId]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      price,
      stock,
      id_user: userId,
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const userId = req.user.id;
    const productCheck = await db.executeQuery(
      "SELECT * FROM products WHERE id = ? AND id_user = ?",
      [id, userId]
    );

    if (productCheck.length === 0) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this product" });
    }

    // Validasi input
    if (!name && !description && !price && !stock) {
      return res
        .status(400)
        .json({ error: "At least one field is required for update" });
    }

    const updatedFields = [];
    const values = [];

    if (name) {
      updatedFields.push("name = ?");
      values.push(name);
    }
    if (description) {
      updatedFields.push("description = ?");
      values.push(description);
    }
    if (price) {
      updatedFields.push("price = ?");
      values.push(price);
    }
    if (stock) {
      updatedFields.push("stock = ?");
      values.push(stock);
    }

    values.push(id, userId);

    await db.executeQuery(
      `UPDATE products SET ${updatedFields.join(
        ", "
      )} WHERE id = ? AND id_user = ?`,
      [...values]
    );

    res.json({ message: "Product updated" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productCheck = await db.executeQuery(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (productCheck.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    await db.executeQuery("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

exports.getProductsByUserId = async (req, res) => {
  try {
    const { id_user } = req.params;
    const products = await db.executeQuery(
      "SELECT * FROM products WHERE id_user = ?",
      [id_user]
    );

    if (products.length === 0) {
      return res.status(200).json({ error: "No products found for this user" });
    }

    res.json(products);
  } catch (err) {
    console.error("Error fetching products by user ID:", err);
    res.status(500).json({ error: "Failed to fetch products by user ID" });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { term } = req.query;

    if (!term) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const products = await db.executeQuery(
      "SELECT * FROM products WHERE name LIKE ?",
      [`%${term}%`]
    );

    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found matching your search" });
    }

    res.json(products);
  } catch (err) {
    console.error("Error searching for products:", err);
    res.status(500).json({ error: "Failed to search for products" });
  }
};
