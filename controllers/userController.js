const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { executeQuery } = require("../config/db");

const saltRounds = 10; // Jumlah salt rounds yang digunakan oleh bcrypt

// Fungsi untuk membuat pengguna baru
exports.createUser = async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  try {
    // Hash password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan pengguna baru ke database melalui stored procedure
    const query = "CALL create_user(?, ?, ?, ?, ?)";
    const params = [name, email, hashedPassword, address, phone];
    await executeQuery(query, params);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fungsi untuk login pengguna
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Call the stored procedure to get user by email
    const query = "CALL login(?)";
    const result = await executeQuery(query, [email]);

    // Check if any user was returned
    if (result[0].length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result[0][0]; // Get the first user from the result set

    // Check if the user password is undefined or null
    if (!user.password) {
      return res.status(500).json({ error: "User password is missing" });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET // Ensure you have JWT_SECRET in your .env
    );

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
      token, // Return token
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: err.message });
  }
};

// Fungsi untuk mendapatkan semua pengguna
exports.getAllUsers = async (req, res) => {
  try {
    const query = "CALL get_all_users()"; // Stored procedure untuk mendapatkan semua pengguna
    const users = await executeQuery(query);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fungsi untuk mendapatkan informasi pengguna berdasarkan ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id; // Ambil user ID dari parameter route

  try {
    // Ambil informasi pengguna dari database melalui stored procedure
    const query = "CALL get_user_by_id(?)";
    const result = await executeQuery(query, [userId]);

    // Menambahkan log untuk memeriksa hasil dari stored procedure
    console.log(result); // Cek hasil yang dikembalikan

    // Pastikan hasilnya ada dan sesuai
    if (result.length === 0 || result[0].length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result[0][0]; // Ambil pengguna pertama dari hasil
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
    });
  } catch (err) {
    console.error(err); // Log error untuk debugging
    res.status(500).json({ error: err.message });
  }
};

