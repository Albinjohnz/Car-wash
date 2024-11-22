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


db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
    connection.release();
});




