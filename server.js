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

db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
    connection.release();
});




