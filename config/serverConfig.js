const mysql = require('mysql')

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: {"PUTYOURPASSWORDHERE"},
    database: "CMS_db"
});

module.exports = connection