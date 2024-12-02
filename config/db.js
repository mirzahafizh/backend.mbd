const mysql = require('mysql2');

// Membuat koneksi ke database
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'ecommerce'
});

// Fungsi untuk menjalankan query ke database
async function executeQuery(query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

// Menghubungkan ke database
connection.connect((err) => {
    if (err) {
        console.error('error connecting to the database:', err.stack);
        return;
    }
    console.log('connected to the database');
});

module.exports = { connection, executeQuery };
