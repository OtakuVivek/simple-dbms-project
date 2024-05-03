// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Create Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// PostgreSQL configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});

// Create customers table if not exists
async function createTableIfNotExists() {
  try {
    const result = await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL
      )
    `);
    console.log('Table created successfully');
  } catch (err) {
    console.error('Error creating table', err);
  }
}

createTableIfNotExists();

// Routes
// Get all customers
app.get('/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

// Get customer by ID
app.get('/customers/:id', async (req, res) => {
  const customerId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [customerId]);
    if (result.rows.length === 0) {
      res.status(404).send('Customer not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new customer
app.post('/customers', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query('INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

// Update customer by ID
app.put('/customers/:id', async (req, res) => {
  const customerId = req.params.id;
  const { name, email } = req.body;
  try {
    const result = await pool.query('UPDATE customers SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, customerId]);
    if (result.rows.length === 0) {
      res.status(404).send('Customer not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete customer by ID
app.delete('/customers/:id', async (req, res) => {
  const customerId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [customerId]);
    if (result.rows.length === 0) {
      res.status(404).send('Customer not found');
    } else {
      res.json({ message: 'Customer deleted successfully' });
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
