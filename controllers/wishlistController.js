const db = require("../config/db");

// Menambahkan item ke wishlist
const addToWishlist = async (req, res) => {
    try {
        const { produk_id, nama_produk } = req.body;
        const user_id = req.user.id; // Mengambil user_id dari request user

        // Memeriksa apakah produk_id sudah ada di wishlist
        const existingItem = await db.executeQuery(
            "SELECT * FROM wishlists WHERE user_id = ? AND produk_id = ?",
            [user_id, produk_id]
        );

        if (existingItem.length > 0) {
            return res.status(200).json({ error: "Produk sudah ada di wishlist" });
        }

        // Memanggil stored procedure untuk menambahkan item ke wishlist
        await db.executeQuery("CALL add_to_wishlist(?, ?, ?)", [
            produk_id,
            nama_produk,
            user_id,
        ]);

        res.json({
            message: "Item added to wishlist successfully",
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Menghapus item dari wishlist
const deleteWishlistItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Memanggil stored procedure untuk menghapus item dari wishlist
        await db.executeQuery("CALL delete_wishlist_item(?)", [id]);

        res.status(200).json({ message: "Wishlist item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mengambil wishlist berdasarkan user_id
const getWishlistByUserId = async (req, res) => {
    try {
        const user_id = req.user.id;


        const wishlistItems = await db.executeQuery("CALL get_wishlist_by_user(?)", [user_id]);

        res.json({
            success: true,
            message: wishlistItems.length === 0 ? "Wishlist is empty" : "Wishlist items retrieved successfully",
            wishlistItems,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addToWishlist,
    deleteWishlistItem,
    getWishlistByUserId,
};
