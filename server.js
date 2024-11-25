const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
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
app.delete('/services/:id', (req, res) => {
    const { id } = req.params;

    const deleteSql = 'DELETE FROM services WHERE id = ?';
    db.query(deleteSql, [id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Error deleting service' });
        }

        const getServicesSql = 'SELECT * FROM services ORDER BY id';
        db.query(getServicesSql, (err, services) => {
            if (err) {
                console.error('Error fetching services:', err);
                return res.status(500).send({ message: 'Error fetching services' });
            }

            services.forEach((service, index) => {
                const updateSql = 'UPDATE services SET id = ? WHERE id = ?';
                db.query(updateSql, [index + 1, service.id], (err, result) => {
                    if (err) {
                        console.error('Error updating service ID:', err);
                    }
                });
            });

            const resetAutoIncrementSql = 'ALTER TABLE services AUTO_INCREMENT = 1;';
            db.query(resetAutoIncrementSql, (err, result) => {
                if (err) {
                    console.error('Error resetting AUTO_INCREMENT:', err);
                    return res.status(500).send({ message: 'Error resetting AUTO_INCREMENT' });
                }

                res.send({ message: 'Service deleted and IDs reorganized successfully' });
            });
        });
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




