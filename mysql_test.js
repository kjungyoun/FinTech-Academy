var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "******",
    database: "fintech", // 데이터베이스 (스키마)
});

connection.connect();
connection.query("SELECT * FROM user", function (error, results, fields) {
    if (error) throw error;
    console.log("The name is: ", results[0].name);
});

connection.end();
