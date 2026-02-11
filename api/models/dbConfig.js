const mysql = require("mysql2");

const dbConfig = {
    host: "mysql-tanukistyles.alwaysdata.net",
    user: "368585",
    password: "46154774",
    database: "tanukistyles_proyectos",
};

const db = mysql.createConnection(dbConfig);

module.exports = db;