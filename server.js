const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 0;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'albinjohn@321', 
    database: 'car'   
});


db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
    connection.release();
});

app.get('/services', (req, res) => {
    const sql = 'SELECT * FROM services';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error getting services' });
        } else {
            res.send(results);
        }
    });
});

app.post('/services', (req, res) => {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
        console.log('Missing required fields');
        return res.status(400).send({
            error: 'All fields (name, description, price) are required'
        });
    }
    const sql = 'INSERT INTO services (name, description, price) VALUES (?, ?, ?)';
    db.query(sql, [name, description, price], (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Error adding service' });
        }
        res.send({
            message: 'Service added successfully',
            serviceId: result.insertId  
        });
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

            let updates = 0;
            services.forEach((service, index) => {
                const newId = index + 1;
                if (service.id !== newId) {
                    const updateSql = 'UPDATE services SET id = ? WHERE id = ?';
                    db.query(updateSql, [newId, service.id], (err, result) => {
                        if (err) {
                            console.error('Error updating service ID:', err);
                        } else {
                            updates++;
                        }
                    });
                }
            });
            const resetAutoIncrementSql = 'ALTER TABLE services AUTO_INCREMENT = 1;';
            db.query(resetAutoIncrementSql, (err, result) => {
                if (err) {
                    console.error('Error resetting AUTO_INCREMENT:', err);
                    return res.status(500).send({ message: 'Error resetting AUTO_INCREMENT' });
                }

                res.send({ message: `${updates} service(s) deleted and IDs reorganized successfully` });
            });
        });
    });
});
app.put('/services/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
  
    const sql = 'UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?';
  
    db.query(sql, [name, description, price, id], (err, result) => {
      if (err) {
        console.error('Error updating service:', err);
        return res.status(500).json({ error: 'Failed to update service' });
      }
  
      res.json({ message: 'Service updated successfully' });
    });
  });

app.use((req, res) => {
    res.status(404).send({ error: 'Route not found' });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
const startServer = () => {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            console.log(`Server running on http://localhost:${server.address().port}`); 
            resolve(server);  
        });
        server.on('error', reject);  
    });
};

const stopServer = (server) => {
    return new Promise((resolve, reject) => {
        if (server) {
            server.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } else {
            reject(new Error('Server not initialized.'));
        }
    });
};

module.exports = { app, startServer, stopServer };