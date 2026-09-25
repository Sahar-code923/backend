// server.js
// Install: npm install express mysql2 cors
// Run:     node server.js

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection pool (change these to match your setup)
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'operations',
  waitForConnections: true,
  connectionLimit: 10,
});

// ---------- CRUD ROUTES ----------

// CREATE - add a new product
app.post('/products', async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)',
      [name, category, price, stock]
    );

    res.status(201).json({
      message: 'Product created',
      product_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - get all products
app.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - get a single product by id
app.get('/products/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE product_id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - update a product by id
app.put('/products/:id', async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    const [result] = await db.query(
      'UPDATE products SET name = ?, category = ?, price = ?, stock = ? WHERE product_id = ?',
      [name, category, price, stock, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - delete a product by id
app.delete('/products/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM products WHERE product_id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
