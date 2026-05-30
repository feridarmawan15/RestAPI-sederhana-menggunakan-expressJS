const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /api/products : Menampilkan semua produk
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// POST /api/products : Menambah produk baru
app.post('/api/products', (req, res) => {
    const { name, price, stock, category } = req.body;
    if (!name || price === undefined || stock === undefined || !category) {
        return res.status(400).json({ error: 'Please provide name, price, stock, and category' });
    }
    
    const sql = 'INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)';
    const params = [name, price, stock, category];
    
    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'product created',
            data: {
                id: this.lastID,
                name,
                price,
                stock,
                category
            }
        });
    });
});

// PUT /api/products/:id : Mengupdate data produk (Harga/Stok) berdasarkan ID
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { price, stock, name, category } = req.body;
    
    let sql = 'UPDATE products SET ';
    const params = [];
    
    if (price !== undefined) {
        sql += 'price = ?, ';
        params.push(price);
    }
    if (stock !== undefined) {
        sql += 'stock = ?, ';
        params.push(stock);
    }
    if (name !== undefined) {
        sql += 'name = ?, ';
        params.push(name);
    }
    if (category !== undefined) {
        sql += 'category = ?, ';
        params.push(category);
    }
    
    if (params.length === 0) {
        return res.status(400).json({ error: 'Please provide fields to update' });
    }
    
    sql = sql.slice(0, -2); // Remove last comma and space
    sql += ' WHERE id = ?';
    params.push(id);
    
    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({
            message: 'product updated',
            changes: this.changes
        });
    });
});

// DELETE /api/products/:id : Menghapus produk berdasarkan ID
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    
    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({
            message: 'product deleted',
            changes: this.changes
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
