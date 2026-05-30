const sqlite3 = require('sqlite3').verbose();
const dbName = 'products.db';

let db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price INTEGER,
            stock INTEGER,
            category TEXT
        )`, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                // Insert dummy data if the table is empty
                db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
                    if (row && row.count === 0) {
                        const insert = 'INSERT INTO products (name, price, stock, category) VALUES (?,?,?,?)';
                        db.run(insert, ["Mie Instan Goreng", 3500, 50, "Makanan"]);
                        db.run(insert, ["Kopi Susu Botol", 8000, 30, "Minuman"]);
                        db.run(insert, ["Buku Tulis Sinar Dunia", 4500, 100, "Alat Tulis"]);
                        db.run(insert, ["Pensil 2B", 3000, 150, "Alat Tulis"]);
                        console.log('Dummy data inserted.');
                    }
                });
            }
        });
    }
});

module.exports = db;
