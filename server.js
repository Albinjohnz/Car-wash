const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;


app.use(bodyParser.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'albinjohn@321', 
    database: 'car'   
});

// Test the database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
    connection.release(); // Release the connection back to the pool
});



// Add a new service
app.post('/services', (req, res) => {
    const { name, description, price } = req.body;

    const sql = 'INSERT INTO services (name, description, price) VALUES (?, ?, ?)';
    db.query(sql, [name, description, price], (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Error adding service' });
        } else {
            res.send({ message: 'Service added successfully' });
        }
    });
});
// Get all services
app.get('/services', (req, res) => {
    const sql = 'SELECT * FROM services';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error retrieving services' });
        } else {
            res.send(results);
        }
    });
});
// Handle invalid routes
app.use((req, res) => {
    res.status(404).send({ error: 'Route not found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
