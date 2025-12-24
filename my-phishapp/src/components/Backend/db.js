// db.js
const mysql = require('mysql2');

// Creating a connection pool to the database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Sangamkendre@13', // your password
    database: 'phishing_simulator',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = pool.promise();